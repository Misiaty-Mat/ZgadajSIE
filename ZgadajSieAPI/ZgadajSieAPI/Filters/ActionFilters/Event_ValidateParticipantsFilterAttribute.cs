using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateParticipantsFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateParticipantsFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var @event = context.HttpContext.Items["Event"] as Event;

            // brak uczestników

            await db.Entry(@event).Collection(e => e.Participants).LoadAsync();

            if (@event.Participants.Count == 0)
            {
                context.ModelState.AddModelError("Event", $"Event '{@event.EventId}' doesn't have any participants.");
                var userProblem = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(userProblem);

                return;
            }

            var participantIds = @event.Participants.Select(p => p.Id).ToList();

            // aktualizauj event w httpcontext

            context.HttpContext.Items["Participants"] = participantIds;

            await next();
        }
    }
}
