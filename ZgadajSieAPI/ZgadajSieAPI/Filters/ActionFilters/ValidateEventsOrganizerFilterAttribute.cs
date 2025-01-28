using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class ValidateEventsOrganizerFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public ValidateEventsOrganizerFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var @event = context.HttpContext.Items["Event"] as Event;

            // brak organizatora

            var organizer = await db.Users.FindAsync(@event.OrganizerId);

            if (organizer == null)
            {
                context.ModelState.AddModelError("User", $"User with id '{organizer.Id}' not found.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);

                return;
            }

            // user nie jest organizatorem

            var userId = Guid.Parse(context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            if (organizer.Id != userId)
            {
                context.ModelState.AddModelError("User", $"User with id '{userId}' is not the event's organizer.");
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
