using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.Validations
{
    public class Profile_AgeAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (!int.TryParse(value.ToString(), out var age))
            {
                return new ValidationResult("Age must be a valid integer.");
            }

            if (age < 18)
            {
                return new ValidationResult("Age value must be 18 or more.");
            }

            return ValidationResult.Success;
        }
    }
}
