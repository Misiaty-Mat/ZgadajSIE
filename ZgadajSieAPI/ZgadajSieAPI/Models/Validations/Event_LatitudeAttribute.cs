﻿using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class Event_LatitudeAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return new ValidationResult("Latitude is required.");
            }

            if (!double.TryParse(value.ToString(), out var latitude))
            {
                return new ValidationResult("Latitude must be a valid number.");
            }

            if (latitude < -90 || latitude > 90)
            {
                return new ValidationResult("Latitude must be between -90 and 90.");
            }

            return ValidationResult.Success;
        }
    }
}
