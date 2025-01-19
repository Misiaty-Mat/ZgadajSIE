using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class Event_LatitudeAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var @event = validationContext.ObjectInstance as EventCreateDTO;

            if (@event == null)
            {
                return new ValidationResult("Event details object is empty.");
            }

            var lat = @event.Latitude;

            if (Math.Round(lat, 6) != lat)
            {
                return new ValidationResult("Latitude must have at most 6 decimal places.");
            }

            if (lat < -90 || lat > 90)
            {
                return new ValidationResult("Latitude must be between -90 and 90.");
            }

            return ValidationResult.Success;
        }
    }
}
