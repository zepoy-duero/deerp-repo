using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace DEEMPPORTAL.Common;

public class EmailService(IConfiguration configuration)
{
	private readonly int Port = int.Parse(configuration.GetSection("EmailSettings:Port").Value ?? "0");
	private readonly string Host = configuration.GetSection("EmailSettings:Host").Value ?? "";
	private readonly string Username = configuration.GetSection("EmailSettings:Username").Value ?? "";
	private readonly string Password = configuration.GetSection("EmailSettings:Password").Value ?? "";
	private readonly string Sender = configuration.GetSection("EmailSettings:Sender").Value ?? "";
	private const bool EnableSsl = true;

	public async Task<bool> SendAsync(
			string sender,
			string recipient,
			string subject,
			string body,
			string? cc,
			string? bcc)
	{
		using var mailMessage = new MailMessage();
		using var smtpClient = new SmtpClient(Host);

		smtpClient.Port = Port;
		smtpClient.EnableSsl = EnableSsl;
		smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
		smtpClient.Credentials = new NetworkCredential(Username, Password);

		mailMessage.From = new MailAddress(sender);
		mailMessage.To.Add(recipient);

		if (!string.IsNullOrEmpty(cc)) mailMessage.CC.Add(cc);

		if (!string.IsNullOrEmpty(bcc)) mailMessage.Bcc.Add(bcc);

		mailMessage.Subject = subject;
		mailMessage.Body = body;
		mailMessage.BodyEncoding = Encoding.UTF8;
		mailMessage.IsBodyHtml = true;

		try
		{
			await smtpClient.SendMailAsync(mailMessage);
			return true;
		}
		catch (Exception e)
		{
			Console.WriteLine(e);

			return false;
		}
	}

	public async Task<bool> SendAsync(
			string recipient,
			string subject,
			string body,
			string? cc,
			string? bcc,
			IFormFile? file)
	{
		using var mailMessage = new MailMessage();
		using var smtpClient = new SmtpClient(Host);

		smtpClient.Port = Port;
		smtpClient.EnableSsl = EnableSsl;
		smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
		smtpClient.Credentials = new NetworkCredential(Username, Password);

		mailMessage.From = new MailAddress(Sender);
		mailMessage.To.Add(recipient);

		if (!string.IsNullOrEmpty(cc)) mailMessage.CC.Add(cc);

		if (!string.IsNullOrEmpty(bcc)) mailMessage.Bcc.Add(bcc);

		if (file != null)
		{
			var attachment = new Attachment(file.OpenReadStream(), file.FileName, file.ContentType);
			mailMessage.Attachments.Add(attachment);
		}

		mailMessage.Subject = subject;
		mailMessage.Body = body;
		mailMessage.BodyEncoding = Encoding.UTF8;
		mailMessage.IsBodyHtml = true;

		try
		{
			await smtpClient.SendMailAsync(mailMessage);
			return true;
		}
		catch (Exception e)
		{
			Console.WriteLine(e);
			return false;
		}
	}

	public async Task<bool> SendAsync(
			string recipient,
			string subject,
			string body,
			string? cc,
			string? bcc,
			List<MailAttachment>? files)
	{
		using var mailMessage = new MailMessage();
		using var smtpClient = new SmtpClient(Host);

		smtpClient.Port = Port;
		smtpClient.EnableSsl = EnableSsl;
		smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
		smtpClient.Credentials = new NetworkCredential(Username, Password);

		mailMessage.From = new MailAddress(Sender);
		mailMessage.To.Add(recipient);

		if (!string.IsNullOrEmpty(cc)) mailMessage.CC.Add(cc);

		if (!string.IsNullOrEmpty(bcc)) mailMessage.Bcc.Add(bcc);

		if (files != null && files.Count > 0)
		{
			foreach (var file in files)
			{
				var ms = new MemoryStream(file.FileBytes);
				var attachment = new Attachment(ms, file.ContentType);
				if (attachment.ContentDisposition != null)
					attachment.ContentDisposition.FileName = file.FileName;

				mailMessage.Attachments.Add(attachment);
			}
		}

		mailMessage.Subject = subject;
		mailMessage.Body = body;
		mailMessage.BodyEncoding = Encoding.UTF8;
		mailMessage.IsBodyHtml = true;

		try
		{
			await smtpClient.SendMailAsync(mailMessage);
			return true;
		}
		catch (Exception e)
		{
			Console.WriteLine(e);
			return false;
		}
	}

	public async Task<bool> SendErrorAsync(string fn,
			Exception exception)
	{
		using var mailMessage = new MailMessage();
		using var smtpClient = new SmtpClient(Host);

		smtpClient.Port = Port;
		smtpClient.EnableSsl = EnableSsl;
		smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
		smtpClient.Credentials = new NetworkCredential(Username, Password);

		mailMessage.From = new MailAddress(Sender);
		mailMessage.To.Add("landrex@dahbashi.com");
		mailMessage.CC.Add("riyaz@dahbashi.com, avito@dahbashi.com");

		mailMessage.Subject = "System Error @ " + fn;
		mailMessage.Body = $@"
            <html>
                <body>
					<p>
                        Error: {exception.Message} <br/>
                        Stack Trace: {exception.StackTrace}
                    </p>
                    
                    <p>Best regards,</p>
                    <p>DahbashiOnline</p>
                </body>
            </html>
        ";

		mailMessage.BodyEncoding = Encoding.UTF8;
		mailMessage.IsBodyHtml = true;

		try
		{
			await smtpClient.SendMailAsync(mailMessage);
			return true;
		}
		catch (Exception e)
		{
			Console.WriteLine(e);
			return false;
		}
	}
}

public class MailAttachment
{
	public string FileName { get; set; }
	public byte[] FileBytes { get; set; }
	public string ContentType { get; set; }
}
