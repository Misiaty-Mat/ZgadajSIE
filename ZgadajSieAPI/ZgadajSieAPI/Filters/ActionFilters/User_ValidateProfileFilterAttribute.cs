using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class User_ValidateProfileFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public User_ValidateProfileFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var user = context.HttpContext.Items["User"] as User;

            // nie pobrano profilu użytkownika

            var profile = await db.Profiles.FindAsync(user.Id);

            if (profile == null)
            {
                context.ModelState.AddModelError("Profile", $"Profile with id '{user.Id}' not found.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status404NotFound
                };
                context.Result = new NotFoundObjectResult(problemDetails);

                return;
            }

            // dodaj usera do httpcontext

            user.Profile = profile;

            context.HttpContext.Items["User"] = user;

            await next();
        }
    }
}
