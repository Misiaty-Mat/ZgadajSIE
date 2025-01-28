using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class ValidateRegisterFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public ValidateRegisterFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // pusty obiekt

            var model = context.ActionArguments["model"] as UserRegistrationDTO;

            if (model == null)
            {
                context.ModelState.AddModelError("Register", "Model object is null.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // zajęty email

            var existingUser = await db.Users.FirstOrDefaultAsync(x => x.Email == model.Email);

            if (existingUser != null)
            {
                context.ModelState.AddModelError("Register", "Provided email already exists.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            await next();
        }
    }
}
