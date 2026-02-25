using DEEMPPORTAL.Application.Account;
using DEEMPPORTAL.Application.Auth;
using DEEMPPORTAL.Application.Dashboard;
using DEEMPPORTAL.Application.Home;
using DEEMPPORTAL.Application.HR;
using DEEMPPORTAL.Application.Library.Certificate;
using DEEMPPORTAL.Application.Library.CreditApplication;
using DEEMPPORTAL.Application.Library.Form;
using DEEMPPORTAL.Application.Library.Logo;
using DEEMPPORTAL.Application.Manage.Main;
using DEEMPPORTAL.Application.Manage.Menu;
using DEEMPPORTAL.Application.Manage.Role;
using DEEMPPORTAL.Application.Manage.RoleMenu;
using DEEMPPORTAL.Application.Manage.User;
using DEEMPPORTAL.Application.MyProfile;
using DEEMPPORTAL.Application.Report;
using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Application.Support;
using DEEMPPORTAL.Application.Support.EmployeeDirectoryService;
using DEEMPPORTAL.Application.Support.SpeedDialDirectoryService;
using DEEMPPORTAL.Common;
using Erp.Application.MyProfile;
using Microsoft.Extensions.DependencyInjection;

namespace DEEMPPORTAL.Infrastructure;

public static class DependencyInjection
{
	public static IServiceCollection AddInfrastructure(this IServiceCollection services)
	{
		services.AddScoped<ConnectionPool>();
		services.AddScoped<CurrentUser>();
		services.AddScoped<EmailService>();
		services.AddScoped<ExcelService>();
		services.AddScoped<IpInfo>();

		// shared dependencies
		services.AddScoped<ISelectOptionsRepository, SelectOptionsRepository>();
		services.AddScoped<ISelectOptionsService, SelectOptionsService>();
		services.AddScoped<IFetchOnlyOneRepository, FetchOnlyOneRepository>();
		services.AddScoped<IFetchOnlyOneService, FetchOnlyOneService>();

		// login
		services.AddScoped<ILoginRepository, LoginRepository>();
		services.AddScoped<ILoginService, LoginService>();

		// home
		services.AddScoped<IHomeRepository, HomeRepository>();
		services.AddScoped<IHomeService, HomeService>();

		// page menu
		services.AddScoped<IUserMenuRepository, UserMenuRepository>();
		services.AddScoped<IUserMenuService, UserMenuService>();

		services.AddScoped<IMenuRepository, MenuRepository>();
		services.AddScoped<IMenuService, MenuService>();

		services.AddScoped<IUserRepository, UserRepository>();
		services.AddScoped<IUserService, UserService>();

		services.AddScoped<IRoleRepository, RoleRepository>();
		services.AddScoped<IRoleService, RoleService>();

		services.AddScoped<IRoleMenuRepository, RoleMenuRepository>();
		services.AddScoped<IRoleMenuService, RoleMenuService>();

		services.AddScoped<IMyProfileRespository, MyProfileRepository>();
		services.AddScoped<IMyProfileService, MyProfileService>();

		services.AddScoped<IEmployeeHeadCountRepository, EmployeeHeadCountRepository>();
		services.AddScoped<IEmployeeHeadCountService, EmployeeHeadCountService>();

		services.AddScoped<IEmployeeReportRepository, EmployeeReportRepository>();
		services.AddScoped<IEmployeeReportService, EmployeeReportService>();

		services.AddScoped<ILeaveApplicationRepository, LeaveApplicationRepository>();
		services.AddScoped<ILeaveApplicationService, LeaveApplicationService>();

		services.AddScoped<ICertificateRepository, CertificateRepository>();
		services.AddScoped<ICertificateService, CertificateService>();

		services.AddScoped<ICreditApplicationRepository, CreditApplicationRepository>();
		services.AddScoped<ICreditApplicationService, CreditApplicationService>();

		services.AddScoped<IFormRepository, FormRepository>();
		services.AddScoped<IFormService, FormService>();

		services.AddScoped<ILogoRepository, LogoRepository>();
		services.AddScoped<ILogoService, LogoService>();

		services.AddScoped<ISpeedDialDirectoryRepository, SpeedDialDirectoryRepository>();
		services.AddScoped<ISpeedDialDirectoryService, SpeedDialDirectoryService>();

		services.AddScoped<IEmployeeDirectoryRepository, EmployeeDirectoryRepository>();
		services.AddScoped<IEmployeeDirectoryService, EmployeeDirectoryService>();

		services.AddScoped<IUserSatisfactionRepository, UserSatisfactionRepository>();
		services.AddScoped<IUserSatisfactionService, UserSatisfactionService>();

		services.AddScoped<IResetPasswordRepository, ResetPasswordRepository>();
		services.AddScoped<IResetPasswordService, ResetPasswordService>();

		services.AddScoped<IChangePasswordRepository, ChangePasswordRepository>();
		services.AddScoped<IChangePasswordService, ChangePasswordService>();

		services.AddScoped<IForgotPasswordRepository, ForgotPasswordRepository>();
		services.AddScoped<IForgotPasswordService, ForgotPasswordService>();

		return services;
	}
}
