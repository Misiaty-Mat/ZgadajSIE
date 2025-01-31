using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class EventsStartDate : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public EventsStartDate(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var @event = context.HttpContext.Items["Event"] as Event;

            // czas eventu

            if (DateTime.Now.Date > @event.StartDate.Date)
            {
                context.ModelState.AddModelError("Event", $"Event is terminated since {@event.StartDate.Date.AddDays(1).ToString("dd-MM-yyyy")}.");
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
