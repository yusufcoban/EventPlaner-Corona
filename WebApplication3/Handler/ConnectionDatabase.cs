using Microsoft.Data.SqlClient;

namespace WebApplication2.AppCode.Handler
{
    public class ConnectionHandler
    {
       public static string getConnectionString()
        {
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.DataSource = "*";
            builder.UserID = "*";
            builder.Password = "*";
            builder.InitialCatalog = "WebApplication2_db";
            return builder.ConnectionString;
        }
    }

}
