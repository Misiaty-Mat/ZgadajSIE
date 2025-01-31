using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class JoinEventFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public JoinEventFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {

            // limit uczestników 

            var @event = context.HttpContext.Items["Event"] as Event;

            await db.Entry(@event).Collection(e => e.Participants).LoadAsync();

            if (@event.Participants.Count > @event.EventDetails.MaxParticipation)
            {
                context.ModelState.AddModelError("Event", $"Event has reached its participants limit: {@event.EventDetails.MaxParticipation}.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // już jest uczestnikiem

            var @user = context.HttpContext.Items["User"] as User;

            for (int i = 0; i < @event.Participants.Count; i++)
            {
                if (user.Id == @event.Participants[i].Id)
                {
                    context.ModelState.AddModelError("Event", $"User is already participating in event '{@event.EventId}'.");
                    var problemDetails = new ValidationProblemDetails(context.ModelState)
                    {
                        Status = StatusCodes.Status400BadRequest
                    };
                    context.Result = new BadRequestObjectResult(problemDetails);

                    return;
                }
            }

            // jest już organizatorem

            if (user.Id == @event.OrganizerId)
            {
                context.ModelState.AddModelError("Event", $"User is the organizer of event '{@event.EventId}'.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // uaktualnij event o uczestników w httpcontext

            context.HttpContext.Items["Event"] = @event;

            await next();
        }

    }
}
