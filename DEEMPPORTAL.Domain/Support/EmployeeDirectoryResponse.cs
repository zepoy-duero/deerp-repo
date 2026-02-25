namespace DEEMPPORTAL.Domain.Support
{
    public class EmployeeDirectoryResponse
    {
        public int ORG_CODE { get; set; }
        public int LOC_CODE { get; set; }
        public int DEPT_CODE { get; set; }
        public string? EMP_NAME { get; set; }
        public string? EMP_POSITION { get; set; }
        public string? EMP_LOCATION { get; set; }
        public string? MOBILE_NO { get; set; }
        public string? TELEPHONE_NO { get; set; }
        public string? EXTENSION_NO { get; set; }
        public string? EMAIL_ADDRESS { get; set; } = null;
        public byte[]? EMP_PHOTO { get; set; }
        public string? IS_ACTIVE { get; set; }
    }

}
