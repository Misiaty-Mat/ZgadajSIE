using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Data.Migrations;
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

            // pobranie tagów wydarzenia

            var tags = await db.Events
                .Where(e => e.EventId == @event.EventId)
                .SelectMany(e => e.Tags)
                .ToListAsync();

            // dodaj event do httpcontext

            @event.Tags = tags;

            @event.EventDetails = eventDetails;

            context.HttpContext.Items["Event"] = @event;

            await next();
        }
    }
}
