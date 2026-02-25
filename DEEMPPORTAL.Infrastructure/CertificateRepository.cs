using Dapper;
using DEEMPPORTAL.Application.Library.Certificate;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Library;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DEEMPPORTAL.Infrastructure;

public class CertificateRepository(ConnectionPool cp, CurrentUser cu) : ICertificateRepository
{
    private readonly ConnectionPool _cp = cp;
    private readonly CurrentUser _cu = cu;

    public async Task<IEnumerable<LibraryInformationResponse>> GetAllLibraryInformation(int orgCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_LIBRARY_INFORMATION_sel";
        var parameters = new
        {
            ORG_CODE = orgCode,
            LIBRARY_TYPE = "CERTIFICATE"
        };

        var results = await conn.QueryAsync<LibraryInformationResponse>(
          storedProcedure,
          parameters,
          commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }

    public async Task<LibraryInformationResponse> GetLibraryInformation(int libraryInformationCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_LIBRARY_INFORMATION_DETAIL_sel";
        var parameters = new
        {
            LIBRARY_INFORMATION_CODE = libraryInformationCode
        };

        var results = await conn.QueryFirstOrDefaultAsync<LibraryInformationResponse>(
          storedProcedure,
          parameters,
          commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results ?? new LibraryInformationResponse();
    }

    public async Task<bool> SaveLibraryInformation(DataTable dt)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_LIBRARY_INFORMATION_upd";
        var parameters = new
        {
            TT = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_LIBRARY_INFORMATION"),
            USER_ID = _cu.UserId,
        };

        var rowsAffected = await conn.ExecuteAsync(
          storedProcedure,
          parameters,
          commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected > 0;
    }

    public async Task<bool> DeleteLibraryInformation(int libraryInformationCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_LIBRARY_INFORMATION_del";
        var parameters = new
        {
            LIBRARY_INFORMATION_CODE = libraryInformationCode,
        };

        var rowsAffected = await conn.ExecuteAsync(
          storedProcedure,
          parameters,
          commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected > 0;
    }

    public async Task<IEnumerable<LibraryAttachmentResponse>> GetAllLibraryAttchment(int libraryInformationCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_LIBRARY_ATTACHMENT_sel";
        var parameters = new
        {
            LIBRARY_INFORMATION_CODE = libraryInformationCode
        };

        var results = await conn.QueryAsync<LibraryAttachmentResponse>(
          storedProcedure,
          parameters,
          commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }

    public async Task<bool> DeleteLibraryAttachment(int libraryAttachmentCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_LIBRARY_ATTACHMENT_del";
        var parameters = new
        {
            LIBRARY_ATTACHMENT_CODE = libraryAttachmentCode,
        };

        var rowsAffected = await conn.ExecuteAsync(
          storedProcedure,
          parameters,
          commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected > 0;
    }

    public async Task<bool> InsertLibraryAttachment(DataTable dt)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "dbo.CLOUD_v1_ERP_LIBRARY_ATTACHMENT_crt";
        var parameters = new
        {
            TT = dt.AsTableValuedParameter("dbo.TT_CLOUD_v1_ERP_LIBRARY_ATTACHMENT"),
            USER_ID = _cu.UserId,
        };

        var rowsAffected = await conn.ExecuteAsync(
          storedProcedure,
          parameters,
          commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return rowsAffected > 0;
    }

    public async Task<LibraryAttachmentResponse> GetLibraryAttachment(int libraryAttachmentCode)
    {
        await using var conn = new SqlConnection(_cp.ConnectionName);

        await conn.OpenAsync();

        const string storedProcedure = "CLOUD_v1_ERP_LIBRARY_ATTACHMENT_DETAIL_sel";
        var parameters = new
        {
            LIBRARY_ATTACHMENT_CODE = libraryAttachmentCode
        };

        var results = await conn.QueryFirstOrDefaultAsync<LibraryAttachmentResponse>(
          storedProcedure,
          parameters,
          commandType: CommandType.StoredProcedure);

        await conn.CloseAsync();

        return results;
    }
}
