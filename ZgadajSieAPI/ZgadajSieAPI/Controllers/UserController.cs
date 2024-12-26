using Microsoft.AspNetCore.Mvc;
using ZgadajSieAPI.Models.DTO;
using System.Security.Claims;
using ZgadajSieAPI.Models;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using ZgadajSieAPI.Data;
using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Filters.ActionFilters;
using ZgadajSieAPI.Services.Interfaces;

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

        [HttpGet]
        public IActionResult Test()
        {
            return Ok();
        }

        [HttpPost("register")]
        [TypeFilter(typeof(User_ValidateRegisterFilterAttribute))]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDTO model)
        {
            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                PasswordHash = pw.Hash(model.Password)
            };

            db.Users.Add(user);

            await db.SaveChangesAsync();

            var token = jwt.GenerateToken(user);

            return Ok(new { Message = "Registartion succesful.", User = new UserWithoutSensitiveDataDTO(user), Token = token });
        }

        [HttpPost("login")]
        [TypeFilter(typeof(User_ValidateLoginFilterAttribute))]
        public IActionResult Login([FromBody] UserLoginDTO model)
        {
            var user = db.Users.First(x => x.Email == model.Email);

            var token = jwt.GenerateToken(user);

            return Ok(new { Token = token, User = new UserWithoutSensitiveDataDTO(user) });
        }
    }
}