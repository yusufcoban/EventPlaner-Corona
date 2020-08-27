using System.Collections.Generic;
using System.Data;

using Dapper;

using Microsoft.Data.SqlClient;

using WebApplication2.AppCode.Models;

namespace WebApplication2.AppCode.Handler
{
    public class UserHandler
    {
        public static string connectionBaseUsers = "SELECT * FROM users ";
        public static IEnumerable<User> Get()
        {
            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                return db.Query<User>(connectionBaseUsers);
        }

        public static User GetByBarCode(string barcode)
        {
            string query = connectionBaseUsers + "WHERE barcode LIKE @barcode";
            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                return db.QueryFirstOrDefault<User>(query, new { barcode });
        }
    }

}
