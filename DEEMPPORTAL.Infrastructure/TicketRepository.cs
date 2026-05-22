using Dapper;
using DEEMPPORTAL.Application.Ticket;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain;
using DEEMPPORTAL.Domain.Manage.User;
using DEEMPPORTAL.Domain.Support;
using DEEMPPORTAL.Domain.Ticket;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class TicketRepository(ConnectionPool cp, CurrentUser cu) : ITicketRepository
{

    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<TicketResponse>> CreateTicketAsync(CreateTicketParams request)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_TICKET_create";
        var parameters = new
        {
            request.DeptCode,
            request.RequestedByCode,
            request.RequestedByName,
            request.RequestedDate,
            request.TaskTypeCode,
            request.TicketDescription,
            request.TicketSubject
        };
        var rowsAffected = await conn.QueryAsync<TicketResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected;
    }
    public async Task<IEnumerable<TicketResponse>> GetAllTicketAsync(
   
     int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_TICKET_MAST_sel";
        var parameters = new
        {
             DeptCode
        };


        var data = await conn.QueryAsync<TicketResponse>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);

        //var data = await multi.ReadAsync<TicketSelectOptions>();
        //var totalCount = await multi.ReadFirstAsync<int>();

        await conn.CloseAsync();

        return data;
    }

    public async Task<IEnumerable<TicketSelectOptions>> GetUserOptionsAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_USER_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetAssigneeOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_ASSIGNEE_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetPriorityOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_PRIORITY_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<SelectOptionResponse>> GetTicketDepartmentListAsync(int OrgCode, int LocCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        const string storedProcedure = "CLOUD_v1_ERP_DEPARTMENT_MAST_opts";
        var parameters = new
        {
            OrgCode,
            LocCode
        };
        var results = await conn.QueryAsync<SelectOptionResponse>(

            storedProcedure,
              parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetModuleOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_MODULE_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetDurationUnitOptionsAsync()
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
      
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_DURATION_UNIT_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetStatusOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_STATUS_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    public async Task<IEnumerable<TicketSelectOptions>> GetTypeOptionsAsync(int OrgCode, int LocCode, int DeptCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();
        var parameters = new
        {
            OrgCode,
            LocCode,
            DeptCode
        };
        const string storedProcedure = "CLOUD_v1_ERP_CM_TICKET_TASKTYPE_opts";
        var results = await conn.QueryAsync<TicketSelectOptions>(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure);
        await conn.CloseAsync();

        return results!;
    }
    

}