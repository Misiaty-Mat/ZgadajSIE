using Microsoft.AspNetCore.Mvc;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Filters.ActionFilters;
using ZgadajSieAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using ZgadajSieAPI.Models.Other;

namespace ZgadajSieAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ZgadajsieDbContext db;
        private readonly IJwtService jwt;
        private readonly IPasswordService pw;

        public UserController(ZgadajsieDbContext db, IConfiguration config, IJwtService jwt, IPasswordService pw)
        {
            this.db = db;
            this.jwt = jwt;
            this.pw = pw;
        }


        [HttpPost("register")]
        [TypeFilter(typeof(ValidateRegisterFilterAttribute))]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDTO model)
        {
            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                PasswordHash = pw.Hash(model.Password),
                Profile = new Profile()
            };

            db.Users.Add(user);

            await db.SaveChangesAsync();

            var token = jwt.GenerateToken(user);

            return Ok(new { Message = "Registartion succesful.", User = new UserDTO(user), Token = token });
        }


        [HttpPost("login")]
        [TypeFilter(typeof(ValidateLoginFilterAttribute))]
        [TypeFilter(typeof(ValidateProfileFilterAttribute))]
        public IActionResult Login([FromBody] UserLoginDTO model)
        {
            var user = HttpContext.Items["User"] as User;

            var token = jwt.GenerateToken(user);

            return Ok(new { Message = "Login succesful.", Token = token, User = new UserDTO(user) });
        }


        [Authorize]
        [HttpPost("autologin")]
        [TypeFilter(typeof(ValidateAutologinFilterAttribute))]
        [TypeFilter(typeof(ValidateProfileFilterAttribute))]
        public IActionResult Autologin([FromHeader(Name = "Authorization")] string token)
        {
            var user = HttpContext.Items["User"] as User;

            return Ok(new { Message = "Login succesful.", User = new UserDTO(user) });
        }


        [Authorize]
        [HttpGet("profile")]
        [TypeFilter(typeof(ValidateCurrentUserFilterAttribute))]
        [TypeFilter(typeof(ValidateProfileFilterAttribute))]
        public async Task<IActionResult> GetProfile()
        {
            var user = HttpContext.Items["User"] as User;

            return Ok(new { Profile = new UserDTO(user) });
        }


        [Authorize]
        [HttpPut("profile/update")]
        [TypeFilter(typeof(ValidateCurrentUserFilterAttribute))]
        [TypeFilter(typeof(ValidateProfileFilterAttribute))]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDTO model)
        {
            var user = HttpContext.Items["User"] as User;

            user.Name = model.Name;
            user.Profile.Age = model.Age;
            user.Profile.Gender = model.Gender;
            user.Profile.Description = model.Description;

            await db.SaveChangesAsync();

            return NoContent();
        }


        [Authorize]
        [HttpGet("joined")]
        public async Task<IActionResult> GetJoinedEvents()
        {
            var userId = Guid.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var joinedEvents = await db.Events
                .Where(e => e.Participants.Any(p => p.Id == userId))
                .Include(e => e.EventDetails)
                .Include(e => e.Tags)
                .Select(e => new EventPersonalDTO(e))
                .ToListAsync();

            return Ok(new { JoinedEvents = joinedEvents });
        }


        [Authorize]
        [HttpGet("created")]
        public async Task<IActionResult> GetCreatedEvents()
        {
            var userId = Guid.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var createdEvents = await db.Events
                .Where(e => e.OrganizerId == userId)
                .Include(e => e.EventDetails)
                .Include(e => e.Tags)
                .Select(e => new EventPersonalDTO(e))
                .ToListAsync();

            return Ok(new { CreatedEvents = createdEvents });
        }

        [Authorize]
        [HttpPost("scan/{eventId}/qr")]
        [TypeFilter(typeof(ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(ValidateCurrentUserFilterAttribute))]
        [TypeFilter(typeof(ValidateProfileFilterAttribute))]
        [TypeFilter(typeof(ValidateEventsStartDate))]
        [TypeFilter(typeof(ValidateQrCodeFilterAttribute))]

        public async Task<IActionResult> ScanEventsQrCode([FromRoute] Guid eventId, [FromBody] CodeRequest code)
        {
            //var @event = HttpContext.Items["Event"] as Event;

            var user = HttpContext.Items["User"] as User;

            var checkIn = new CheckIn
            {
                EventId = eventId,
                UserId = user.Id,
            };

            db.CheckIns.Add(checkIn);

            user.Profile.SocialScore++;

            await db.SaveChangesAsync();

            return Ok(new { Message = "Check-in successful." });
        }
    }
}