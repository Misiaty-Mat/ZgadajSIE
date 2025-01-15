using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.Validations;

namespace ZgadajSieAPI.Models.DTO
{
    public class UserRegistrationDTO
    {
        [Required]
        [User_Name]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
