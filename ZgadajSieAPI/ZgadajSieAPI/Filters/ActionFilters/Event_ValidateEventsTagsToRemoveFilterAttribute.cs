using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateEventsTagsToRemoveFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateEventsTagsToRemoveFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var tagsToRemove = context.HttpContext.Items["Tags"] as List<Tag>;

            var @event = context.HttpContext.Items["Event"] as Event;

            var tags = @event.Tags;

            // wykluczenie tagów

            for (int i = 0; i < tags.Count; i++)
            {
                for (int j = 0; j < tagsToRemove.Count; j++)
                {
                    if (tags[i].Id != tagsToRemove[j].Id)
                    {
                        tags.Remove(tags[i]);
                    }
                }
            }

            // nic nie zostało 

            if (tags.Count == 0)
            {
                context.ModelState.AddModelError("Tag", $"None of given tags is attached to the event.");
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
