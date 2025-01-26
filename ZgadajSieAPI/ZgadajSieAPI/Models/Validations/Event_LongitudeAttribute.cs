using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class Event_LongitudeAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return new ValidationResult("Latitude value is required.");
            }

            if (!double.TryParse(value.ToString(), out var longitude))
            {
                return new ValidationResult("Latitude must be a valid number.");
            }

            if (longitude < -180 || longitude > 180)
            {
                return new ValidationResult("Longitude must be between -180 and 180.");
            }

            return ValidationResult.Success;
        }
    }
}