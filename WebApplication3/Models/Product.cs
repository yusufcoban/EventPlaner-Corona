using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApplication2.AppCode.Models
{
    public class Product
    {
        private static string dbName = "Produkte";

        public int id { get; }
        public int maxOrderCount { get; set; }
        [MinLength(4)]
        public string productname { get; set; }
        public static string getDbName()
        {
            return dbName;
        }
    }

    public class Product_User
    {
        private static string dbName = "nm_user_produkte";
        public int userid { get; set; }
        public int produkteid { get; set; }
        [CheckAmount]
        public int amount { get; set; }

        public static string getDbName()
        {
            return dbName;
        }
    }
}
