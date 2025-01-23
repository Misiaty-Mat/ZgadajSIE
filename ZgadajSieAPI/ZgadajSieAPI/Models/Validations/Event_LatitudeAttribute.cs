using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class Event_LatitudeAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var @event = validationContext.ObjectInstance as EventCreateDTO;

            if (value == null)
            {
                return new ValidationResult("Latitude value is required.");
            }

            if (!double.TryParse(value.ToString(), out var latitude))
            {
                return new ValidationResult("Latitude must be a valid number.");
            }

            if (Math.Round(latitude, 6) != latitude)
            {
                return new ValidationResult("Latitude must have at most 6 decimal places.");
            }

            if (latitude < -90 || latitude > 90)
            {
                return new ValidationResult("Latitude must be between -90 and 90.");
            }

            return ValidationResult.Success;
        }
    }
}
