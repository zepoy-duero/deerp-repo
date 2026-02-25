using DEEMPPORTAL.Application.Shared;
using DEEMPPORTAL.Common;
using DEEMPPORTAL.Domain.Support;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

namespace DEEMPPORTAL.Application.Support
{
  public class UserSatisfactionService(
    IUserSatisfactionRepository userSatisfactionRepository,
    IFetchOnlyOneRepository fetchOnlyOneRepository,
    IHttpContextAccessor httpContextAccessor,
    EmailService emailService,
    IpInfo ipInfo) : IUserSatisfactionService
  {
    private readonly IUserSatisfactionRepository _userSatisfactionRepository = userSatisfactionRepository;
    private readonly IFetchOnlyOneRepository _fetchOnlyOneRepository = fetchOnlyOneRepository;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly EmailService _emailService = emailService;
		private readonly IpInfo _ipInfo = ipInfo;

		public async Task<bool> InsertAsync(UserSatisfactionRequest request, int recordId)
    {
      var (ip, country, city, browser) = await _ipInfo.GetIpAsync();

      request.IP_ADDRESS = ip ?? "";
      request.IP_CITY = city ?? "";
      request.IP_COUNTRY = country ?? "";
      request.BROWSER_INFO = browser ?? "";
      request.EMAIL_TEXT = await GetUserSatisfactionEmailContent(request, recordId);

      return await _userSatisfactionRepository.InsertAsync(request);
    }

    public async Task SendEmailAsync(UserSatisfactionRequest request, int recordId)
    {
      var sender = "info@dahbashi.com";
      var recipient = await _fetchOnlyOneRepository.GetUserSatisfactionEmailRecipient();
      var cc = string.Empty;
      var bcc = string.Empty;
      var subject = $@"Number#{recordId} : Anonymous User Message from DE Employee Portal";

      // Build optional message parts
      var feedbackSection = !string.IsNullOrWhiteSpace(request.FEEDBACK)
          ? $"<p><strong>Feedback:</strong> {request.FEEDBACK}</p>"
          : string.Empty;

      var complaintsSection = !string.IsNullOrWhiteSpace(request.COMPLAINT)
          ? $"<p><strong>Complaints:</strong> {request.COMPLAINT}</p>"
          : string.Empty;

      var suggestionsSection = !string.IsNullOrWhiteSpace(request.SUGGESTION)
          ? $"<p><strong>Suggestions:</strong> {request.SUGGESTION}</p>"
          : string.Empty;

      var ratingSection = request.RATING_VALUE > 0
          ? $"<p><strong>Rating:</strong> {request.RATING_VALUE} / 5</p>"
          : string.Empty;

      var body = $@"<html>
                  <body style='font-family: Inter, Calibri, Arial, sans-serif; font-size:11pt'>

                      {ratingSection}
                      {feedbackSection}
                      {complaintsSection}
                      {suggestionsSection}

                      <p>This is an auto-generated email - kindly DON'T reply.</p>

                      <p>
                        <div>From Dahbashi Engineering</div> 
                        <div>Online Employee Portal</div>
                      </p>
                  </body>
              </html>";

      await _emailService.SendAsync(sender, recipient, subject, body, cc, bcc);
    }

    public async Task<string> GetUserSatisfactionEmailContent(UserSatisfactionRequest request, int recordId)
    {
      var sender = "info@dahbashi.com";
      var recipient = await _fetchOnlyOneRepository.GetUserSatisfactionEmailRecipient();
      var cc = string.Empty;
      var subject = $@"Number#{recordId} : Anonymous User Message from DE Employee Portal";

      // Build optional message parts
      var feedbackSection = !string.IsNullOrWhiteSpace(request.FEEDBACK)
          ? $"<p><strong>Feedback:</strong> {request.FEEDBACK}</p>"
          : string.Empty;

      var complaintsSection = !string.IsNullOrWhiteSpace(request.COMPLAINT)
          ? $"<p><strong>Complaints:</strong> {request.COMPLAINT}</p>"
          : string.Empty;

      var suggestionsSection = !string.IsNullOrWhiteSpace(request.SUGGESTION)
          ? $"<p><strong>Suggestions:</strong> {request.SUGGESTION}</p>"
          : string.Empty;

      var ratingSection = request.RATING_VALUE > 0
          ? $"<p><strong>Rating:</strong> {request.RATING_VALUE} / 5</p>"
          : string.Empty;

      // Format current date like “Wednesday, October 15, 2025 2:52 PM”
      var sentDate = DateTime.Now.ToString("dddd, MMMM dd, yyyy h:mm tt");

      var body = $@"<html>
                  <body style='font-family: Inter, Calibri, Arial, sans-serif; font-size:11pt'>

                    <p><strong>From:</strong> {sender}<br>
                    <strong>Sent:</strong> {sentDate}<br>
                    <strong>To:</strong> {recipient}<br>
                    {(string.IsNullOrWhiteSpace(cc) ? "" : $"<strong>Cc:</strong> {cc}<br>")}
                    <strong>Subject:</strong> {subject}</p>

                      {ratingSection}
                      {feedbackSection}
                      {complaintsSection}
                      {suggestionsSection}

                      <p>This is an auto-generated email - kindly DON'T reply.</p>

                      <p>
                        <span>From Dahbashi Engineering</span> <br> 
                        Online Employee Portal
                      </p>
                  </body>
              </html>
      ";

      string text = Regex.Replace(body, "<br.*?>", "\n", RegexOptions.IgnoreCase);
      text = Regex.Replace(text, "<.*?>", string.Empty); // remove all HTML tags
      text = System.Net.WebUtility.HtmlDecode(text); // decode HTML entities 
      text = text.Trim(); // trim and normalize spacing

      return text;
    }
	}
}
