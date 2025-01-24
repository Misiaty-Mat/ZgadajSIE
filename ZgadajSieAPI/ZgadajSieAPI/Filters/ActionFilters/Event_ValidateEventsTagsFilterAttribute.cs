using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Tracing;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateEventsTagsFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateEventsTagsFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var @event = context.HttpContext.Items["Event"] as Event;

            // pobranie tagów wydarzenia (i powiązanie z EF)

            db.Entry(@event).Collection(e => e.Tags).Load();

            // brak tagów na wydarzeniu

            if (@event.Tags == null)
            {
                context.ModelState.AddModelError("Tags", $"Event with id '{@event.EventId}' does not have any tags attached.");
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
