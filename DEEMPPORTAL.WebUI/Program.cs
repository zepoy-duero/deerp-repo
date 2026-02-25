using DEEMPPORTAL.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews()
	.AddJsonOptions(options =>
	{
		options.JsonSerializerOptions.PropertyNamingPolicy = null; // This will format the json output to proper naming conventions
	});

builder.Services.AddSession(options =>
{
	options.IdleTimeout = TimeSpan.FromHours(1);
	options.Cookie.HttpOnly = true;
	options.Cookie.IsEssential = true;
	options.Cookie.SameSite = SameSiteMode.Strict;
});

builder.Services
	.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
		.AddJwtBearer(options =>
		{
			options.RequireHttpsMetadata = false;
			options.SaveToken = true;
			options.TokenValidationParameters = new TokenValidationParameters
			{
				ValidateIssuer = false,
				ValidateAudience = false,
				ValidateLifetime = true,
				ValidateIssuerSigningKey = true,
				ValidIssuer = builder.Configuration["Jwt:Issuer"],
				ValidAudience = builder.Configuration["Jwt:Audience"],
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? string.Empty))
			};

			options.Events = new JwtBearerEvents
			{
				OnAuthenticationFailed = context =>
				{
					if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
					{
						context.Response.StatusCode = 401;
						context.Response.Headers.Append("Token-Expired", "true");
					}

					Console.WriteLine("JWT AUTH FAILED: " + context.Exception.Message);
					Console.WriteLine(context.Exception.ToString());
					return Task.CompletedTask;
				},

				OnMessageReceived = context =>
				{
					context.Token = context.Request.Cookies["JwtToken"];
					return Task.CompletedTask;
				}
			};
		});

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll", policyBuilder =>
	{
		policyBuilder
			.AllowAnyOrigin()
			.AllowAnyMethod()
			.AllowAnyHeader();
	});
});

// add http client factory
builder.Services.AddHttpClient();

// Auto Mapper Configurations
builder.Services.AddAutoMapper(typeof(Program));

// Register memory cache
builder.Services.AddMemoryCache();

// Implement Infrastructure Dependency Injection
builder.Services.AddHttpContextAccessor();
builder.Services.AddInfrastructure();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Home/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("AllowAll");
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
	if (context.Request.Path == "/")
	{
		context.Response.Redirect("/auth/login");
		return;
	}

	await next();
});

app.MapControllerRoute(
		name: "default",
		pattern: "{controller=Login}/{action=Index}/{id?}");

app.Run();
