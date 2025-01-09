using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Services.Interfaces;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class User_ValidateLoginFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;
        private readonly IPasswordService pw;

        public User_ValidateLoginFilterAttribute(ZgadajsieDbContext db, IPasswordService pw)
        {
            this.db = db;
            this.pw = pw;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // pusty obiekt

            var model = context.ActionArguments["model"] as UserLoginDTO;

            if (model == null)
            {
                context.ModelState.AddModelError("Login", "Model object is null.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);
                
                return;
            }

            // niepoprawne dane

            var user = await db.Users.FirstOrDefaultAsync(x => x.Email == model.Email);

            if (user == null || !pw.Verify(model.Password, user.PasswordHash))
            {
                context.ModelState.AddModelError("Login", "Wrong credentials.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status401Unauthorized
                };
                context.Result = new UnauthorizedObjectResult(problemDetails);

                return;
            }

            // dodaj usera do httpcontext

            context.HttpContext.Items["User"] = new UserWithoutSensitiveDataDTO(user);

            await next();
        }
    }
}
