﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Eventing.Reader;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class ParticipantFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public ParticipantFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var @event = context.HttpContext.Items["Event"] as Event;

            // brak uczestnika na liście

            await db.Entry(@event).Collection(e => e.Participants).LoadAsync();

            var participantId = context.ActionArguments["participantId"] as Guid?;

            for (int i = 0; i < @event.Participants.Count; i++)
            {
                if (@event.Participants[i].Id == participantId)
                {
                    break;
                }
                else
                {
                    if (i < @event.Participants.Count - 1)
                    {
                        continue;
                    }
                    else
                    {
                        context.ModelState.AddModelError("Event", $"User with id '{participantId}' not found on participants' list.");
                        var problemDetails = new ValidationProblemDetails(context.ModelState)
                        {
                            Status = StatusCodes.Status404NotFound
                        };
                        context.Result = new NotFoundObjectResult(problemDetails);

                        return;
                    }
                }
            }

            // nie załadowano uczestnika

            var user = await db.Users.FindAsync(participantId);

            if (user == null)
            {
                context.ModelState.AddModelError("User", $"User with id '{participantId}' doesn't exist.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);

                return;
            }

            // dodaj usera do httpcontext

            context.HttpContext.Items["User"] = user;

            await next();
        }
    }
}