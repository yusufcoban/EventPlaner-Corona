using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace WebApplication2.AppCode.Models
{
    public class User
    {
        private static string dbName = "users";

        public int id { get; }
        [MinLength(3)]
        public string firstname { get; set; }
        [MinLength(3)]
        public string lastname { get; set; }
        [MinLength(3)]
        public string addresse { get; set; }
        [MinLength(10)]
        [EmailAddress]
        [EmailCheckUsage]
        public string email { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public string barcode { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public DateTime FirstViewDate { get; set; }

        public static string getDbName()
        {
            return dbName;
        }
    }

}
