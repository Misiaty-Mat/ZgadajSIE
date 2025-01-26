using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateMaxParticipationFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateMaxParticipationFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // pobierz aktualna liczbę uczestników

            var @event = context.HttpContext.Items["Event"] as Event;

            var participantsCount = await db.Events.
                Where(e => e.EventId == @event.EventId)
                .Select(e => e.Participants.Count)
                .FirstOrDefaultAsync();

            // brak uczestników

            if (participantsCount == 0)
            {
                await next();
            }

            // pusty model

            var model = context.ActionArguments["model"] as EventUpdateDTO;

            if (model == null)
            {
                context.ModelState.AddModelError("Event", $"Model object is empty.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // nowy limit mniejszy od liczby uczestników

            if (model.MaxParticipation < participantsCount)
            {
                context.ModelState.AddModelError("EventDetails", $"New participation limit cannot be lesser then current participants' count.");
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
