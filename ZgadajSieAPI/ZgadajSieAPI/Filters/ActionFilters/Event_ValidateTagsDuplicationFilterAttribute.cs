using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateTagsDuplicationFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateTagsDuplicationFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var @event = context.HttpContext.Items["Event"] as Event;

            var tags = context.HttpContext.Items["Tags"] as List<Tag>;

            // wyrzuć powrótki

            var attachedTags = await db.Events
            .Where(e => e.EventId == @event.EventId)
            .SelectMany(e => e.Tags)
            .ToListAsync();

            for (int i = 0; i < tags.Count; i++)
            {
                for (int j = 0; j < attachedTags.Count; j++)
                {
                    if (tags[i].Id == attachedTags[j].Id)
                    {
                        tags.Remove(tags[i]);
                    }
                }
            }

            // nic nie zostało 

            if (tags.Count == 0)
            {
                context.ModelState.AddModelError("Tag", $"Given tags are already attached to the event.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // dodaj tagi do httpcontexu

            context.HttpContext.Items["Tags"] = tags;

            await next();
        }
    }
}
