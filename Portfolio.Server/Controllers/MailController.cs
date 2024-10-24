using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace Portfolio.Server.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] MailRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var smtpClient = new SmtpClient("smtp.webio.pl") 
                    {
                        Port = 587, 
                        Credentials = new NetworkCredential("Mkedzierski@mkedzierski.com.pl", "Koniczyna!654"), 
                        EnableSsl = false, 
                    };

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("Mkedzierski@mkedzierski.com.pl"), 
                        Subject = request.Subject,
                        Body = $"Wiadomość od: {request.Email}\n\n{request.Message}",
                        IsBodyHtml = false, 
                    };

                    mailMessage.To.Add("Mkedzierski@mkedzierski.com.pl"); 

                 
                    await smtpClient.SendMailAsync(mailMessage);

                    return Ok(new { message = "Wiadomość została wysłana!" });
                }
                catch (SmtpException ex)
                {
                    return StatusCode(500, new { message = "Wystąpił błąd podczas wysyłania wiadomości: " + ex.Message });
                }
            }

            return BadRequest(new { message = "Dane są nieprawidłowe." });
        }
    }

  
    public class MailRequest
    {
        public string Subject { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }

}

