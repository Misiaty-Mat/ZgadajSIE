using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class EventDetails_MaxParticipationAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return ValidationResult.Success;
            }

            if (!int.TryParse(value.ToString(), out var maxParticipation))
            {
                return new ValidationResult("Max participation must be a valid integer.");
            }

            if (maxParticipation <= 0)
            {
                return new ValidationResult("Value must be an integer greater than 0.");
            }

            return ValidationResult.Success;
        }
    }
}
