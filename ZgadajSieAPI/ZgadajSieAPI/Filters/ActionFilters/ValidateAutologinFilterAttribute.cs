using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Services.Interfaces;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class ValidateAutologinFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public ValidateAutologinFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // pusty obiekt

            var userId = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                context.ModelState.AddModelError("Autologin", "Invalid or expired token.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status401Unauthorized
                };
                context.Result = new UnauthorizedObjectResult(problemDetails);

                return;
            }

            // nie znaleziono użytkownika

            var user = await db.Users.FindAsync(Guid.Parse(userId));

            if (user == null)
            {
                context.ModelState.AddModelError("Autologin", $"User with id '{userId}' not found.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);

                return;
            }

            // dodaj usera do httpcontext

            context.HttpContext.Items["User"] = user;

            await next();
        }
    }
}
