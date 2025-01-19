﻿using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class EventDetails_MaxParticipationAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var @event = validationContext.ObjectInstance as EventCreateDTO;

            if (@event == null)
            {
                return new ValidationResult("Event details object is empty.");
            }

            if (@event.MaxParticipation < 2)
            {
                return new ValidationResult("Value must be an integer greater than 2.");
            }

            return ValidationResult.Success;
        }
    }
}
