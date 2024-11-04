using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.DTO
{
    public class UserRegistrationDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
