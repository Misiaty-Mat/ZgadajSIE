using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class EventIdFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public EventIdFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // pusty guid

            var eventId = context.ActionArguments["eventId"] as Guid?;

            if (eventId == null)
            {
                context.ModelState.AddModelError("EventId", "Id not found.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);

                return;
            }

            // nie znaleziono wydarzenia

            var @event = await db.Events.FindAsync(eventId);

            if (@event == null)
            {
                context.ModelState.AddModelError("Event", $"Event with id '{eventId}' not found.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);

                return;
            }

            // dodaj event do httpcontext

            context.HttpContext.Items["Event"] = @event;

            await next();
        }
    }
}
