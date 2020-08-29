using System.Net;
using System.Net.Mail;

namespace WebApplication2.AppCode.Handler
{
    public class EmailHandler
    {

        public static bool enabled;

        public static void sentMail(string toMail, string subject, string body)
        {
            if (enabled)
            {
                using (SmtpClient smtp = new SmtpClient())
                {
                    string emailAdmin = "coban.yusuf.hassan@gmail.com";
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtp.UseDefaultCredentials = false;
                    smtp.EnableSsl = true;
                    smtp.Host = "smtp.gmail.com";
                    smtp.Port = 587;
                    smtp.Credentials = new NetworkCredential(emailAdmin, "9halloHALLO3112");
                    // send the email

                    smtp.Send(emailAdmin, toMail, subject, body);
                }
            }
        }
    }

}
