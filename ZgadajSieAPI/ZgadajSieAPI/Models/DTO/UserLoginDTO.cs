using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.DTO
{
    public class UserLoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
