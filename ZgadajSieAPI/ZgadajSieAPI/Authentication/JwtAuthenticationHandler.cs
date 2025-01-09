using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using ZgadajSieAPI.Services.Interfaces;

namespace ZgadajSieAPI.Authentication
{
    public class JwtAuthenticationHandler : AuthenticationHandler<JwtBearerOptions>
    {
        private readonly IJwtService jwt;

        public JwtAuthenticationHandler(IOptionsMonitor<JwtBearerOptions> options, ILoggerFactory logger, UrlEncoder encoder, IJwtService jwtService) : base(options, logger, encoder)
        {
            jwt = jwtService;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token == null)
            {
                return AuthenticateResult.Fail("Authorization token is missing");
            }

            var userId = jwt.ValidateToken(token);

            if (userId == null)
            {
                return AuthenticateResult.Fail("Invalid or expired token");
            }

            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId) };
            var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, JwtBearerDefaults.AuthenticationScheme);

            return AuthenticateResult.Success(ticket);
        }
    }
}