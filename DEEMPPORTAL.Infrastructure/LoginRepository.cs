using Dapper;
using DEEMPPORTAL.Application.Auth;
using DEEMPPORTAL.Domain.Auth;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DEEMPPORTAL.Infrastructure;

public class LoginRepository(IConfiguration configuration) : ILoginRepository
{
	private readonly string? _connectionString = configuration.GetConnectionString("Default");
	private readonly string _jwtKey = configuration.GetSection("Jwt:Key").Value ?? "";
	private readonly string _jwtIssuer = configuration.GetSection("Jwt:Issuer").Value ?? "";
	private readonly string _jwtAudience = configuration.GetSection("Jwt:Audience").Value ?? "";

	public async Task<AuthResponse> AuthenticateAsync(AuthRequest request)
	{
		await using var connection = new SqlConnection(_connectionString);

		await connection.OpenAsync();

		const string storedProcedure = "CLOUD_v1_ERP_USER_AUTHENTICATE_sel";
		var parameters = new
		{
			USERNAME = request.Username,
			PASSWORD = request.Password
		};

		var user = await connection.QueryFirstOrDefaultAsync<AuthResponse>(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		return user!;
	}

	public string GenerateJwtToken(AuthResponse user)
	{
		var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
		var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

		var claims = new[]
		{
				new Claim(ClaimTypes.NameIdentifier, user.USERNAME),
				new Claim(ClaimTypes.Email, user.EMAIL_ADDRESS),
				new Claim(ClaimTypes.Role, user.ROLE),
				new Claim(ClaimTypes.Name, user.USERNAME),
				new Claim("PERSONNEL_NAME", user.PERSONNEL_NAME),
				new Claim("DEPARTMENT", user.DEPARTMENT),
				new Claim("USER_CODE", user.USER_CODE.ToString())
		};

		var token = new JwtSecurityToken(
				_jwtIssuer,
				_jwtAudience,
				claims,
				notBefore: new DateTimeOffset(DateTime.Now).DateTime,
				expires: new DateTimeOffset(DateTime.Now.AddHours(1)).DateTime,
				signingCredentials: credentials);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}

	public async Task<int> InsertOtpCodeAsync(int userCode, string emailAddress, string otp)
	{
		await using var connection = new SqlConnection(_connectionString);

		await connection.OpenAsync();

		const string storedProcedure = "CLOUD_v1_ERP_USER_OTP_crt";
		var parameters = new
		{
			USER_CODE = userCode,
			EMAIL_ADDRESS = emailAddress,
			OTP_CODE = otp
		};

		var rowsAffected = await connection.ExecuteAsync(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		return rowsAffected;
	}

	public async Task<int> TrackLoginLocationAsync(
			string? username, string browserDetails, string? ip, string? city, string? country)
	{
		await using var connection = new SqlConnection(_connectionString);

		await connection.OpenAsync();

		const string storedProcedure = "CLOUD_v1_ERP_LOGIN_TRACKER_crt";
		var parameters = new
		{
			USERNAME = username,
			IP_ADDRESS = ip,
			IP_CITY = city,
			IP_COUNTRY = country,
			BROWSER_INFO = browserDetails
		};

		var rowsAffected = await connection.ExecuteAsync(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		return rowsAffected;
	}

	public async Task<bool> VerifyOtpCodeAsync(int userCode, string otp)
	{
		await using var connection = new SqlConnection(_connectionString);

		await connection.OpenAsync();

		const string storedProcedure = "CLOUD_v1_ERP_USER_VERIFY_OTP_sel";

		var parameters = new
		{
			USER_CODE = userCode,
			OTP_CODE = otp
		};

		var isValid = await connection.QueryFirstOrDefaultAsync<int>(
				storedProcedure,
				parameters,
				commandType: CommandType.StoredProcedure);

		return isValid > 0;
	}
}
