using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ZgadajSieAPI.Data;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateGetEventFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateGetEventFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // pusty obiekt

            var eventId = context.ActionArguments["eventId"] as Guid?;

            if (eventId == null)
            {
                context.ModelState.AddModelError("EventId", "Id not found.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);
            }

            // brak eventu

            var @event = await db.Events.FindAsync(eventId);

            if (@event == null)
            {
                context.ModelState.AddModelError("Event", $"Event with id '{eventId}' doesn't exist.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);
            }

            context.HttpContext.Items["Event"] = @event;

            await next();
        }
    }
}
