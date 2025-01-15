using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.Validations
{
    public class Profile_AgeAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var profile = validationContext.ObjectInstance as Profile;

            if (profile == null)
            {
                return new ValidationResult("Profile object is empty.");
            }

            if (profile.Age == null) // nie wymagane
            {
                return ValidationResult.Success;
            }

            if (profile.Age < 18)
            {
                return new ValidationResult("Age value must be 18 or more.");
            }

            return ValidationResult.Success;
        }
    }
}
