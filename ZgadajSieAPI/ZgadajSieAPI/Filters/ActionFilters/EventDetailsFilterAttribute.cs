using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Data.Migrations;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class EventDetailsFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public EventDetailsFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var @event = context.HttpContext.Items["Event"] as Event;

            // nie pobrano szczegółów wydarzenia

            var eventDetails = await db.EventsDetails.FindAsync(@event.EventId);

            if (eventDetails == null)
            {
                context.ModelState.AddModelError("EventDetails", $"Event details with id '{@event.EventId}' not found.");
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
