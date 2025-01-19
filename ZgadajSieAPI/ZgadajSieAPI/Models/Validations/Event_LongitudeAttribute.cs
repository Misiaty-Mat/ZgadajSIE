using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class Event_LongitudeAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var @event = validationContext.ObjectInstance as EventCreateDTO;

            if (@event == null)
            {
                return new ValidationResult("Event details object is empty.");
            }

            var lng = @event.Longitude;

            if (Math.Round(lng, 6) != lng)
            {
                return new ValidationResult("Latitude must have at most 6 decimal places.");
            }

            if (lng < -180 || lng > 0)
            {
                return new ValidationResult("Longitude must be between -180 and 180.");
            }

            return ValidationResult.Success;
        }
    }
}