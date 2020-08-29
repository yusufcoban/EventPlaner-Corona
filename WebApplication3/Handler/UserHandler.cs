using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;

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
            User user;
            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                user = db.QueryFirstOrDefault<User>(query, new { barcode });

            if (user != null && user.FirstViewDate.Year == 1)
            {
                string updatequery = "UPDATE users SET FirstViewDate = GETDATE() WHERE id = @id";
                using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                    db.Execute(updatequery, new { id = user.id });
            }

            return user;
        }

        public static int CreateNewUser(User user)
        {
            int newId;
            string query = @"INSERT INTO users 
                            (firstname, lastname,addresse, email, barcode) 
                            output INSERTED.[id] 
                            VALUES(@firstname, @lastname,@addresse, @email,@barcode); ";
            string barcodeGenerate = RandomString(29);
            string queryCheckUnique = connectionBaseUsers + "WHERE barcode LIKE @barcode";
            bool alreadyExists = true;

            while (alreadyExists == true)
            {
                using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                    alreadyExists = db.ExecuteScalar<bool>(queryCheckUnique, new { barcode = barcodeGenerate });
                barcodeGenerate = RandomString(29);
            }

            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                newId = db.ExecuteScalar<int>(query,
                    new
                    {
                        barcode = barcodeGenerate,
                        addresse = user.addresse,
                        firstname = user.firstname,
                        lastname = user.lastname,
                        email = user.email
                    });

            EmailHandler.sentMail("josef1708@gmail.com",
                "new user generated",
                "new genereated user:" + user.firstname + " " + user.lastname);
            EmailHandler.sentMail(user.email, "Your link for event",
                "Your link for event:" + 
                "https://webapplication3yco.azurewebsites.net/index.html?barcode=" +
                barcodeGenerate);

            return newId;
        }

        private static Random random = new Random();

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }

}
