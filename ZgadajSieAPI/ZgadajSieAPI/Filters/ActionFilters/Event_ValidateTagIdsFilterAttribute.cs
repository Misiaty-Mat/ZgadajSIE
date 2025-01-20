using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateTagIdsFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateTagIdsFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // nieistniejace tagi

            var tagIds = context.ActionArguments["request"] as List<Guid>;

            if (tagIds == null)
            {
                context.ModelState.AddModelError("Tag", $"No tag id sent.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            List<Tag> tags = new List<Tag>();

            for (int i = 0; i < tagIds.Count; i++)
            {
                tags.Add(await db.Tags.FindAsync(tagIds[i]));

                if (tags[i] == null)
                {
                    context.ModelState.AddModelError("Tag", $"No tag with id '{tagIds[i]}'.");
                    var problemDetails = new ValidationProblemDetails(context.ModelState)
                    {
                        Status = StatusCodes.Status404NotFound
                    };
                    context.Result = new NotFoundObjectResult(problemDetails);

                    return;
                }
            }

            // dodaj tagi do httpcontexu

            context.HttpContext.Items["Tags"] = tags;

            await next();
        }
    }
}
