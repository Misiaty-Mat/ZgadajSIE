using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class User_NameAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return new ValidationResult("Name is required.");
            }

            var name = value.ToString();

            // Legenda:
            // ^     - Początek ciągu
            // [A-Z]    - Duża litera
            // [a-z]*     - Dowolna liczba małych liter
            // $     - Koniec ciągu

            bool wrongName = !Regex.IsMatch(name, @"^[A-Z][a-z]*$");

            if (wrongName)
            {
                return new ValidationResult("Name must consists of letters only and start with a capital letter.");
            }

            return ValidationResult.Success;
        }
    }
}
