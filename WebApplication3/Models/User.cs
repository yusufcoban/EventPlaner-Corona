using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace WebApplication2.AppCode.Models
{
    public class User
    {
        public int id { get; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string addresse { get; set; }
        public string email { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public string barcode { get; set; }
    }
}
