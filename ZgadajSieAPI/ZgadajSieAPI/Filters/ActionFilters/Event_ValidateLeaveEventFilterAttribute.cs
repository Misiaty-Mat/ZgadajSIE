using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateLeaveEventFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateLeaveEventFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // jest organizatorem

            var @user = context.HttpContext.Items["User"] as User;

            var @event = context.HttpContext.Items["Event"] as Event;

            if (user.Id == @event.OrganizerId)
            {
                context.ModelState.AddModelError("Event", $"User is the organizer of event '{@event.EventId}'.");
                var eventProblem = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(eventProblem);

                return;
            }

            // doładuj uczestników

            await db.Entry(@event).Collection(e => e.Participants).LoadAsync();

            for (int i = 0; i < @event.Participants.Count; i++)
            {
                if (user.Id == @event.Participants[i].Id)
                {
                    // uaktualnij event o uczestników w httpcontext

                    context.HttpContext.Items["Event"] = @event;

                    await next();   // sukces
                }
            }

            // nie jest uczestnikiem

            context.ModelState.AddModelError("Event", $"User is not participating in event '{@event.EventId}'.");
            var problemDetails = new ValidationProblemDetails(context.ModelState)
            {
                Status = StatusCodes.Status400BadRequest
            };
            context.Result = new BadRequestObjectResult(problemDetails);

            return;
        }
    }
}
