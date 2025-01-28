using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ZgadajSieAPI.Data;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class ValidateCurrentUserFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public ValidateCurrentUserFilterAttribute(ZgadajsieDbContext db)
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
                var userProblem = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(userProblem);

                return;
            }

            // dodaj usera do httpcontext

            context.HttpContext.Items["User"] = user;

            await next();
        }
    }
}
