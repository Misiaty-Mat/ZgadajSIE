using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.DTO
{
    public class UserLoginDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
    }
}
