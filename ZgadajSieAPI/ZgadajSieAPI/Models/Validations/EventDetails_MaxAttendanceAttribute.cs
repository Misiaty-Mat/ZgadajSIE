using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Models.Validations
{
    public class EventDetails_MaxAttendanceAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var details = validationContext.ObjectInstance as EventCreateDTO;

            if (details == null)
            {
                return new ValidationResult("Event details object is empty.");
            }

            if (details.MaxAttendance <= 0)
            {
                return new ValidationResult("Value must be an integer greater than 0.");
            }

            if (details.MinAttendance != null)
            {
                if (details.MaxAttendance < details.MinAttendance)
                {
                    return new ValidationResult($"Value must be an integer greater than {details.MinAttendance}.");
                }
            }

            return ValidationResult.Success;
        }
    }
}
