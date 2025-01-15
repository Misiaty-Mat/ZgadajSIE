using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.Validations
{
    public class Profile_GenderAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var profile = validationContext.ObjectInstance as Profile;

            if (profile == null)
            {
                return new ValidationResult("Profile object is empty.");
            }

            if (profile.Gender == null) // nie wymagane
            {
                return ValidationResult.Success;
            }

            if (profile.Gender.Equals("male", StringComparison.OrdinalIgnoreCase) ||
                profile.Gender.Equals("female", StringComparison.OrdinalIgnoreCase))
            {
                return ValidationResult.Success;
            }

            return new ValidationResult("Gender needs to have any of the following values: 'male', 'female'.");
        }
    }
}