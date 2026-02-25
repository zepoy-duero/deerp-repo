using Dapper;
using DEEMPPORTAL.Application.Support.SpeedDialDirectoryService;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Support;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;
public class SpeedDialDirectoryRepository(ConnectionPool cp, CurrentUser cu) : ISpeedDialDirectoryRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<SpeedDialDirectoryResponse>>
        GetAllSpeedDialDirectoryAsync(
            int orgCode,
            int locCode,
            string searchString
           )
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);
        await conn.OpenAsync();

        var multi = await conn.QueryMultipleAsync(
            "CLOUD_v1_ERP_SPEEDDIAL_opts",
            new { orgCode, locCode, searchString },
            commandType: CommandType.StoredProcedure);

        var data = await multi.ReadAsync<SpeedDialDirectoryResponse>();
        //var total = await multi.ReadFirstAsync<int>();
        await conn.CloseAsync();
        return (data);
    }

}
//public class SpeedDialDirectoryRepository(ConnectionPool cp, ErpCurrentUser cu) : ISpeedDialDirectoryRepository
//{
//    private readonly ConnectionPool _cp = cp;
//    private readonly ErpCurrentUser _cu = cu;

//    public async Task<IEnumerable<SpeedDialDirectoryResponse>> GetAllSpeedDialDirectoryAsync(
//        int draw,
//    int start,
//    int length,
//    string searchValue,
//    int orderColumn,
//    string orderDir
//        )
//    {
//        await using var conn = new SqlConnection(_cp.ConnectionName);

//        await conn.OpenAsync();

//        const string storedProcedure = "CLOUD_v1_ERP_SPEEDDIAL_opts";
//        var parameters = new
//        {
//            draw,
//            start,
//            length,
//            searchValue,
//            orderColumn,
//            orderDir
//        };
//        var multi = await conn.QueryMultipleAsync(
//            storedProcedure,
//            parameters,
//            commandType: CommandType.StoredProcedure);

//        var data = await multi.ReadAsync<SpeedDialDirectoryResponse>();
//        var recordsTotal = await multi.ReadFirstAsync<int>();

//        await conn.CloseAsync();

//        return (data, recordsTotal);
//    }
//}
//using Azure.Core;
//using Common.Configurations;
//using Dapper;
//using DocumentFormat.OpenXml.Office2016.Excel;
//using Erp.Application.Support.SpeedDialDirectoryService;
//using Erp.Domain.Support;
//using Microsoft.Data.SqlClient;
//using System.Data;

//namespace Erp.Infrastructure;
//public class SpeedDialDirectoryRepository(ConnectionPool cp, ErpCurrentUser cu) : ISpeedDialDirectoryRepository
//{
//    private readonly ConnectionPool _cp = cp;
//        private readonly ErpCurrentUser _cu = cu;
//    public async Task<DataTableResponse<SpeedDialDirectoryResponse>> GetAllSpeedDialDirectoryAsync(
//            int draw,
//            int start,
//            int length,
//            string searchValue,
//            int orderColumn,
//            string orderDir
//        )
//    {
//        await using var conn = new SqlConnection(_cp.ConnectionName);
//        await conn.OpenAsync();

//        const string storedProcedure = "CLOUD_v1_ERP_SPEEDDIAL_opts";

//        var parameters = new
//        {
//            draw,
//            start,
//            length,
//            searchValue,
//            orderColumn,
//            orderDir
//        };

//        using var multi = await conn.QueryMultipleAsync(
//            storedProcedure,
//            parameters,
//            commandType: CommandType.StoredProcedure);

//        // Result set #1 → table rows
//        var data = (await multi.ReadAsync<SpeedDialDirectoryResponse>()).ToList();

//        // Result set #2 → meta
//        var meta = await multi.ReadFirstAsync<DataTableResponse>();

//        await conn.CloseAsync();

//        return new DataTableResponse<SpeedDialDirectoryResponse>
//        {
//            draw = draw,
//            recordsTotal = meta.recordsTotal,
//            recordsFiltered = meta.recordsFiltered,
//            data = data
//        };
//    }
//}


