using Dapper;
using DEEMPPORTAL.Application.HR;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.HR;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure
{
    public class LeaveApplicationRepository(ConnectionPool cp, CurrentUser cu) : ILeaveApplicationRepository
    {
        private readonly ConnectionPool _cp = cp;
        private readonly CurrentUser _cu = cu;

        public async Task<int> DeleteLeaveApplicationTemporarilyAsync(int leaveApplicationCode)
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_del_upd";
            var parameters = new
            {
                LEAVE_APPLICATION_CODE = leaveApplicationCode,
                USER_CODE = _cu.UserId
            };

            var rowsAffected = await conn.ExecuteAsync(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return rowsAffected!;
        }

        public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationForManagerApproval()
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_FOR_MANAGER_APPROVAL_sel";
            var parameters = new { };

            var results = await conn.QueryAsync<LeaveApplicationResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results!;
        }

        public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationForResumption()
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_FOR_RESUMPTION_sel";
            var parameters = new { };

            var results = await conn.QueryAsync<LeaveApplicationResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results!;
        }

        public async Task<LeaveApplicationResponse> GetLeaveApplicationRequestAsync(int leaveApplicationCode)
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_DETAIL_sel";
            var parameters = new
            {
                LEAVE_APPLICATION_CODE = leaveApplicationCode,
            };

            var results = await conn.QueryFirstOrDefaultAsync<LeaveApplicationResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results!;
        }

        public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationRequestsAsync()
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_sel";
            var parameters = new
            {
                SEARCH_PARAM = "",
                USER_CODE = _cu.UserId,
            };

            var results = await conn.QueryAsync<LeaveApplicationResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results;
        }

        public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationRequestsByDepartmentAsync(string searchParam, string filterType, string filterValue, int pageNo)
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_BY_DEPARTMENT_sel";

            var parameters = new
            {
                SEARCH_PARAM = searchParam,
                FILTER_TYPE = filterType,
                FILTER_VALUE = filterValue,
                USER_CODE = _cu.UserId,
                PNO = pageNo
            };

            var results = await conn.QueryAsync<LeaveApplicationResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results;
        }

        public async Task<IEnumerable<LeaveApplicationResponse>> GetLeaveApplicationRequestsByEmployeeAsync(string searchParam, string filterType, string filterValue, int pageNo)
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_BY_EMPLOYEE_sel";

            var parameters = new
            {
                SEARCH_PARAM = searchParam,
                FILTER_TYPE = filterType,
                FILTER_VALUE = filterValue,
                USER_CODE = _cu.UserId,
                PNO = pageNo
            };

            var results = await conn.QueryAsync<LeaveApplicationResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results;
        }

        public async Task<LeaveResumptionDetailsResponse> GetLeaveResumptionDateAsync(int? userCode)
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_HR_EMP_LEAVE_MAST_RESUMPTION_sel";
            var parameters = new
            {
                USER_CODE = userCode is null ? _cu.UserId : userCode,
            };

            var results = await conn.QueryFirstOrDefaultAsync<LeaveResumptionDetailsResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results!;
        }

        public async Task<LeaveSummaryResponse> GetTotalLeaveCountByDepartmentAsync()
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_BY_DEPARTMENT_TOTAL_COUNT_sel";
            var parameters = new
            {
                USER_CODE = _cu.UserId,
            };

            var results = await conn.QueryFirstOrDefaultAsync<LeaveSummaryResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results!;
        }

        public async Task<LeaveSummaryResponse> GetTotalLeaveCountByEmployeeAsync()
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_BY_EMPLOYEE_TOTAL_COUNT_sel";
            var parameters = new
            {
                USER_CODE = _cu.UserId,
            };

            var results = await conn.QueryFirstOrDefaultAsync<LeaveSummaryResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results!;
        }

        public async Task<IEnumerable<LeaveDepartmentSummaryResponse>> GetTotalUserPerDepartmentCountAsync()
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_TOTAL_DEPARTMENT_sel";
            var parameters = new
            {
                USER_CODE = _cu.UserId,
            };

            var results = await conn.QueryAsync<LeaveDepartmentSummaryResponse>(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return results!;
        }

        public async Task<int> UpdateLeaveApplicationStatusAsync(int leaveApplicationCode, string applicationStatus, string reasons)
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_STATUS_upd";
            var parameters = new
            {
                LEAVE_APPLICATION_CODE = leaveApplicationCode,
                APPLICATION_STATUS = applicationStatus,
                REASONS = reasons,
                USER_CODE = _cu.UserId
            };

            var rowsAffected = await conn.ExecuteAsync(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            return rowsAffected!;
        }

        public async Task<int> UpdSertLeaveApplicationAsync(DataTable dt, byte[] fileBytes, string fileName, string fileExtension)
        {
            await using var conn = new SqlConnection(_cp.ConnectionName);

            await conn.OpenAsync();

            const string storedProcedure = "CLOUD_v1_ERP_LEAVE_APPLICATION_upd";

            var parameters = new DynamicParameters();
            parameters.Add("@TT", dt.AsTableValuedParameter("dbo.TT_v1_CLOUD_ERP_LEAVE_APPLICATION"));
            parameters.Add("@FILE_BYTES", fileBytes);
            parameters.Add("@FILE_NAME", fileName);
            parameters.Add("@FILE_EXTENSION", fileExtension);
            parameters.Add("@USER_CODE", _cu.UserId);
            parameters.Add("@RETVAL", dbType: DbType.Int32, direction: ParameterDirection.ReturnValue);

            await conn.ExecuteAsync(
                storedProcedure,
                parameters,
                commandType: CommandType.StoredProcedure);

            await conn.CloseAsync();

            var returnValue = parameters.Get<int>("@RETVAL");

            return returnValue;
        }
    }
}
