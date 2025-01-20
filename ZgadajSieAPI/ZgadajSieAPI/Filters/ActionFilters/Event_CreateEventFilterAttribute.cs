using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_CreateEventFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_CreateEventFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // nieistniejace tagi

            var model = context.ActionArguments["model"] as EventCreateDTO;

            List<Tag> tags = new List<Tag>();

            for (int i = 0; i < model.TagIds.Count; i++)
            {
                tags.Add(await db.Tags.FindAsync(model.TagIds[i]));

                if (tags[i] == null)
                {
                    context.ModelState.AddModelError("Tag", $"No tag with id '{model.TagIds[i]}'.");
                    var problemDetails = new ValidationProblemDetails(context.ModelState)
                    {
                        Status = StatusCodes.Status400BadRequest
                    };
                    context.Result = new BadRequestObjectResult(problemDetails);

                    return;
                }    
            }

            // dodaj tagi do httpcontexu

            context.HttpContext.Items["tags"] = tags;

            await next();
        }
    }
}
