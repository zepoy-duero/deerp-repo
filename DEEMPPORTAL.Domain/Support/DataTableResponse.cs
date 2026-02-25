namespace DEEMPPORTAL.Domain.Support;

public class DataTableResponse<T>
{
    public int draw { get; set; }
    public int recordsTotal { get; set; }
    public int recordsFiltered { get; set; }
    public IEnumerable<T>? data { get; set; }
}
