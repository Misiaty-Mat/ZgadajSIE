using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateJoinEventFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateJoinEventFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // nie znaleziono użytkownika

            var userId = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await db.Users.FindAsync(Guid.Parse(userId));

            if (user == null)
            {
                context.ModelState.AddModelError("User", $"User with id '{userId}' not found.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);

                return;
            }

            // limit uczestników 

            var @event = context.HttpContext.Items["Event"] as Event;

            await db.Entry(@event)
                    .Collection(e => e.Participants)
                    .LoadAsync();

            if (@event.EventDetails.MaxParticipation > @event.Participants.Count)
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

            // dodaj usera do httpcontext

            context.HttpContext.Items["User"] = user;

            await next();
        }

    }
}
