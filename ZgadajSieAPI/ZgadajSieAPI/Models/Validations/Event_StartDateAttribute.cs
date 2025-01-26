using System;
using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class Event_StartDateAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || value.ToString() == "01.01.0001 00:00:00")
            {
                return new ValidationResult("Start date is required.");
            }

            if (!DateTime.TryParse(value.ToString(), out var startDate))
            {
                return new ValidationResult("Start date must be a valid date.");
            }

            if (startDate.Date < DateTime.Now.Date)
            {
                return new ValidationResult("Date must be present or future.");
            }

            return ValidationResult.Success;
        }
    }
}
