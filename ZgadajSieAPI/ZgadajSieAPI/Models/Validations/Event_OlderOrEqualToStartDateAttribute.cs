using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class Event_OlderOrEqualToStartDateAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var @event = validationContext.ObjectInstance as EventCreateDTO;

            if (@event == null)
            {
                return new ValidationResult("Event object is empty.");
            }

            //if (@event.EndDate == null) // nie wymagane
            //{
            //    return ValidationResult.Success;
            //}

            if (@event.StartDate != null)
            {
                if (@event.EndDate.Date < @event.StartDate.Date)
                {
                    return new ValidationResult("End date must be the same or later then start date.");
                }
            }

            return ValidationResult.Success;
        }
    }
}