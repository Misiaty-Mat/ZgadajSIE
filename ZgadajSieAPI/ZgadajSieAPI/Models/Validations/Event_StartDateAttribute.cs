using System;
using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class Event_StartDateAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var @event = validationContext.ObjectInstance as EventCreateDTO;

            if (@event == null || @event.StartDate == null)
            {
                return new ValidationResult("Event object or start date is empty.");
            }

            if (@event.StartDate.Date < DateTime.Now.Date)
            {
                return new ValidationResult("Date must be present or future.");
            }

            return ValidationResult.Success;
        }
    }
}
