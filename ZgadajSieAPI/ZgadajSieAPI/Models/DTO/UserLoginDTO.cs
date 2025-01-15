using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.DTO
{
    public class UserLoginDTO
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
