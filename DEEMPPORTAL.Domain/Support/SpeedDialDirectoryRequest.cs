using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DEEMPPORTAL.Domain.Support
{
    public class SpeedDialDirectoryRequest
    {
        public int? orgCode { get; set; }
        public int? locCode { get; set; }
        public string? searchString { get; set; }
  
    }
}
