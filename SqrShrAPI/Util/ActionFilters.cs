using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using SqrShrAPI.Data.Interfaces;

namespace SqrShrAPI.Util
{
    public class UpdateUserLastActivityDate : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            var claim = resultContext.HttpContext.User.FindFirst(ClaimTypes.Name);

            if (claim != null)
            {
                var repo = resultContext.HttpContext.RequestServices.GetService<ISqrShrRepository>();
                var user = await repo.GetUser(claim.Value);
                user.DateLastActive = DateTime.UtcNow;
                await repo.SaveAll();
            }
            
        }
    }
}