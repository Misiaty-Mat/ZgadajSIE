using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_NullCheckFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_NullCheckFilterAttribute(ZgadajsieDbContext db)
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

            // nie pobrano szczegółów wydarzenia

            var eventDetails = await db.EventsDetails.FindAsync(eventId);

            if (eventDetails == null)
            {
                context.ModelState.AddModelError("EventDetails", $"Event details with id '{eventId}' not found.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);

                return;
            }

            // dodaj event do httpcontext

            @event.EventDetails = eventDetails;

            context.HttpContext.Items["Event"] = @event;

            await next();
        }
    }
}
