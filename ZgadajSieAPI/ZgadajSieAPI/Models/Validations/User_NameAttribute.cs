using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class User_NameAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var user = validationContext.ObjectInstance as UserRegistrationDTO;

            if (user == null || string.IsNullOrWhiteSpace(user.Name))
            {
                return new ValidationResult("User object is empty.");
            }

            // Legenda:
            // ^     - Początek ciągu
            // [A-Z]    - Duża litera
            // [a-z]*     - Dowolna liczba małych liter
            // $     - Koniec ciągu

            bool wrongName = !Regex.IsMatch(user.Name, @"^[A-Z][a-z]*$");

            if (wrongName)
            {
                return new ValidationResult("Name must consists of letters only and start with a capital letter.");
            }

            return ValidationResult.Success;
        }
    }
}
