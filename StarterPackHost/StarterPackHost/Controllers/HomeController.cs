using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarterPackHost.Models;
using Microsoft.Extensions.Configuration;
using StarterPackHost.Utilities;
using StarterPackHost.ViewModels;

namespace StarterPackHost.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> MainView([FromServices] IConfiguration configuration)
        {
                var helper = new AzureResourceManagementCredentialsHelper(configuration, this.HttpContext.User);
                var armBearerToken = await helper.GetArmBearerToken();
                var viewModel = new MainViewModel
                {
                    AzureResourceManagementBearerToken = armBearerToken
                };

                return View(viewModel);
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Demonstration application to host views outside Azure Portal.";
            
            return View();
        }
    }
}
