using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Security.Claims;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.Other;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class QrCodeFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public QrCodeFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var @event = context.HttpContext.Items["Event"] as Event;

            // różne kody

            var request = context.ActionArguments["code"] as CodeRequest;

            if (request.Code != @event.CheckInCode)
            {
                context.ModelState.AddModelError("Event", $"Code sent dosen't match event's code.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // zeskanowany kod

            var userId = Guid.Parse(context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            bool alreadyCheckedIn = await db.CheckIns
                .AnyAsync(ch => ch.EventId == @event.EventId && ch.UserId == userId);

            if (alreadyCheckedIn)
            {
                context.ModelState.AddModelError("User", $"User has already checked in.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // sprawdź uczestników

            await db.Entry(@event).Collection(e => e.Participants).LoadAsync();

            for (int i = 0; i < @event.Participants.Count; i++)
            {
                if (userId == @event.Participants[i].Id)
                {
                    await next();   // jest uczestnikiem
                }
            }

            // nie jest uczestnikiem

            context.ModelState.AddModelError("Event", $"User is not participating in event '{@event.EventId}'.");
            var participationProblem = new ValidationProblemDetails(context.ModelState)
            {
                Status = StatusCodes.Status400BadRequest
            };
            context.Result = new BadRequestObjectResult(participationProblem);

            return;
        }
    }
}
