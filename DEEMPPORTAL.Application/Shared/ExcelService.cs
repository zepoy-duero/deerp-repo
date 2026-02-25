using ClosedXML.Excel;
using DEEMPPORTAL.Domain.Report;
using DEEMPPORTAL.Domain.Support;

namespace DEEMPPORTAL.Application.Shared;

public class ExcelService
{
    public static void GenerateEmployeeExcelAsync(IEnumerable<EmployeeReportResponse> profiles, string template, Stream stream)
    {
        byte[] fileBytes = File.ReadAllBytes(@template);
        stream.Write(fileBytes, 0, fileBytes.Length); // enable to write the file

        var data = profiles.ToList();
        var totalCount = data.Count;

        try
        {
            using var workbook = new XLWorkbook(stream);
            var workSheet = workbook.Worksheet(1);

            var startRow = 2;

            if (totalCount > 0)
            {
                foreach (var item in profiles)
                {
                    var emergencyParts = (item.EMERGENCY_CONTACT ?? "").Split('|');
                    var emergencyContactName = emergencyParts.Length > 0 ? emergencyParts[0] : string.Empty;
                    var emergencyContactRelationship = emergencyParts.Length > 1 ? emergencyParts[1] : string.Empty;
                    var emergencyContactNumber = emergencyParts.Length > 2 ? emergencyParts[2] : string.Empty;

                    workSheet.Cell(startRow, 1).Value = item.ROW_NO;
                    workSheet.Cell(startRow, 2).Value = item.EMPLOYEE_NAME;
                    workSheet.Cell(startRow, 3).Value = item.BLOOD_GROUP;
                    workSheet.Cell(startRow, 4).Value = item.FOOD_PREFERENCE;
                    workSheet.Cell(startRow, 5).Value = item.DIETARY_RESTRICTION;
                    workSheet.Cell(startRow, 6).Value = item.MEDICAL_ALLERGIES;
                    workSheet.Cell(startRow, 7).Value = emergencyContactName;
                    workSheet.Cell(startRow, 8).Value = emergencyContactRelationship;
                    workSheet.Cell(startRow, 9).Value = emergencyContactNumber;
                    workSheet.Cell(startRow, 10).Value = item.RESIDENTIAL_ADDRESS;
                    workSheet.Cell(startRow, 11).Value = item.MOBILE_NO;
                    startRow++;
                }
            }

            workbook.SaveAs(stream);
        }
        catch (Exception ex)
        {
            throw new Exception($"Error generating order Excel file: {ex.Message}", ex);
        }
        finally
        {
            stream.Position = 0; // reset the position of the stream to the beginning
        }
    }
    public static void GenerateSpeedDialDirectoryExcelAsync(IEnumerable<SpeedDialDirectoryResponse> speedDialDirectory, string template, Stream stream)
    {
        byte[] fileBytes = File.ReadAllBytes(@template);
        stream.Write(fileBytes, 0, fileBytes.Length); // enable to write the file

        var data = speedDialDirectory.ToList();
        var totalCount = data.Count;

        try
        {
            using var workbook = new XLWorkbook(stream);
            var workSheet = workbook.Worksheet(1);

            var startRow = 2;

            if (totalCount > 0)
            {
                foreach (var item in speedDialDirectory)
                {
                    

                    workSheet.Cell(startRow, 1).Value = item.SPEEDDIAL_NUMBER;
                    workSheet.Cell(startRow, 2).Value = item.SPEEDDIAL_REMARK;
                    workSheet.Cell(startRow, 3).Value = item.SPEEDDIAL_TELEPHONE_NUMBER;
                   
                    startRow++;
                }
            }

            workbook.SaveAs(stream);
        }
        catch (Exception ex)
        {
            throw new Exception($"Error generating order Excel file: {ex.Message}", ex);
        }
        finally
        {
            stream.Position = 0; // reset the position of the stream to the beginning
        }
    }
}
