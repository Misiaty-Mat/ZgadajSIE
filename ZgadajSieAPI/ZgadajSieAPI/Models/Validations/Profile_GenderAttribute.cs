using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.Validations
{
    public class Profile_GenderAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var gender = value.ToString();

            if (gender == null) // nie wymagane
            {
                return ValidationResult.Success;
            }

            if (gender.Equals("male", StringComparison.OrdinalIgnoreCase) ||
                gender.Equals("female", StringComparison.OrdinalIgnoreCase))
            {
                return ValidationResult.Success;
            }

            return new ValidationResult("Gender needs to have any of the following values: 'male', 'female'.");
        }
    }
}