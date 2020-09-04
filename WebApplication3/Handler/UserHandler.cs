using System;
using System.Collections.Generic;
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


        public static User GetByEmail(string email)
        {
            string query = connectionBaseUsers + "WHERE email LIKE @email";
            User user;
            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                user = db.QueryFirstOrDefault<User>(query, new { email });

            return user;
        }

        public static string CreateNewUser(User user)
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

            user.barcode = barcodeGenerate;
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

            _ = EmailHandler.sentMailSentgridAsync("josef1708@gmail.com",
                "new user generated",
                "new genereated user:" + user.firstname + " " + user.lastname, user.firstname + " " + user.lastname);
            sentRegMailToUser(user);

            return barcodeGenerate;
        }

        private static void sentRegMailToUser(User user)
        {
            _ = EmailHandler.sentMailSentgridAsync(user.email, "Your link for event",
                "Your link for event:" +
                "*" +
                user.barcode, user.firstname + " " + user.lastname);
        }

        private static Random random = new Random();

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static bool mailNotUsed(string email)
        {
            bool mailUsed = true;
            int counter = 0;
            string sql = @"SELECT * 
                            FROM {0}
                            WHERE email=@email;";
            sql = String.Format(sql, User.getDbName());
            using (IDbConnection db = new SqlConnection(ConnectionHandler.getConnectionString()))
                counter = db.QueryFirstOrDefault<int>(sql, new { email });
            if (counter == 0)
            {
                mailUsed = false;
            }

            return !mailUsed;
        }

        /**
         * Sent Link to page
         */
        public static void resentMailToUser(string email)
        {
            if (mailNotUsed(email) == false)
            {
                User user = GetByEmail(email);
                sentRegMailToUser(user);
            }
        }

    }
}
