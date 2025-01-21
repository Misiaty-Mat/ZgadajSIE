using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateSentTagIdsFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateSentTagIdsFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // pusty obiekt

            var dto = context.ActionArguments["tagIds"] as TagIdsDTO;

            if (dto == null)
            {
                context.ModelState.AddModelError("Tag", $"No tag id sent.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // brak tagów

            var tagIds = dto.TagIds;

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
