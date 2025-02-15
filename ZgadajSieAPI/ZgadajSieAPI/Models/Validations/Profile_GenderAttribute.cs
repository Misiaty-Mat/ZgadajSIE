using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.Validations
{
    public class Profile_GenderAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || value == string.Empty)
            {
                return ValidationResult.Success;
            }

            var gender = value.ToString();

            if (gender.Equals("male", StringComparison.OrdinalIgnoreCase) ||
                gender.Equals("female", StringComparison.OrdinalIgnoreCase))
            {
                return ValidationResult.Success;
            }

            return new ValidationResult("Gender needs to have any of the following values: 'male', 'female'.");
        }
    }
}