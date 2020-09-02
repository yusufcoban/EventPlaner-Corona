using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using Dapper;

using Microsoft.Data.SqlClient;

using WebApplication2.AppCode.Models;

namespace WebApplication2.AppCode.Handler
{
    public class ProductHandler
    {
        public static string connectionBase = "SELECT * FROM " + Product.getDbName() + " ";

        public static IEnumerable<Product> Get()
        {
            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                return db.Query<Product>(connectionBase);
        }

        public static Product GetById(int id)
        {
            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                return db.QueryFirstOrDefault<Product>(connectionBase + " WHERE id=@id", new { id });
        }

        public static IEnumerable<Product_User> GetByUserId(int userId)
        {
            string sql = @"Select * FROM " + Product_User.getDbName() + " WHERE userid=@userid";
            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                return db.Query<Product_User>(sql, new { userid = userId });
        }
        public static void OverwriteOrder(IEnumerable<Product_User> newOrderList, string barcode)
        {
            User user = UserHandler.GetByBarCode(barcode);
            string sql = "DELETE FROM {0} WHERE userid=@userid;";
            if (newOrderList.Where(x => x.amount > 0).Count() > 0)
            {
                sql += @" INSERT INTO {0} (userid, produkteid, amount) VALUES {1}; ";
                sql = String.Format(sql, Product_User.getDbName(),
                generateValueOrder(newOrderList));
            }
            else
            {
                sql = String.Format(sql, Product_User.getDbName());
            }
            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                db.Execute(sql, new { userid = user.id });
        }

        public static string generateValueOrder(Product_User order)
        {
            return "(" + order.userid + "," + order.produkteid + "," + order.amount + ")";
        }

        public static string generateValueOrder(IEnumerable<Product_User> order)
        {
            List<string> valuesStrings = new List<string>();
            foreach (var item in order)
            {
                valuesStrings.Add(generateValueOrder(item));
            }
            return string.Join(",", valuesStrings); ;
        }
    }
}
