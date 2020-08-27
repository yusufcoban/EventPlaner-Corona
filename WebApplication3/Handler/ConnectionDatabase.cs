using Microsoft.Data.SqlClient;

namespace WebApplication2.AppCode.Handler
{
    public class ConnectionHandler
    {
       public static string getConnectionString()
        {
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.DataSource = "weplkkll.database.windows.net";
            builder.UserID = "yco";
            builder.Password = "hallo9hallo!";
            builder.InitialCatalog = "WebApplication2_db";
            return builder.ConnectionString;
        }
    }

}
