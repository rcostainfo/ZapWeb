using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ZapWeb.Models;

namespace ZapWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Cadastro()
        {
            return View();
        }
        public ActionResult Conversacao()
        {
            return View();
        }
    }
}
