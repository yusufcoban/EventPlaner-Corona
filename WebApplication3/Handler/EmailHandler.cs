using System.Collections.Generic;

using SendGrid;
using SendGrid.Helpers.Mail;

namespace WebApplication2.AppCode.Handler
{
    public class EmailHandler
    {
        // Startup sets this value from appsettings.json
        public static bool enabled;
        public static string apikey;

        public static async System.Threading.Tasks.Task sentMailSentgridAsync(string toMail, string subject, string body, string username)
        {
            if (enabled)
            {
                var msg = new SendGridMessage();

                msg.SetFrom(new EmailAddress("yco@kuk-is.de", "Event planer admin"));

                var recipients = new List<EmailAddress>
                            {
                                new EmailAddress(toMail, username),
                            };
                msg.AddTos(recipients);

                msg.SetSubject(subject);

                msg.AddContent(MimeType.Text, body);
                var client = new SendGridClient(apikey);
                var response = await client.SendEmailAsync(msg);
            }
        }
    }
}
