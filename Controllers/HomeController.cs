using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApp.Models;

namespace TestApp.Controllers
{
    public class HomeController : Controller
    {
        VirtualServerContext context; 

        public HomeController(VirtualServerContext db)
        {
            context = db;
        }

        public IActionResult Index()
        {
            var collection = context.VirtualServers.ToList();
            return View(collection);
        }

        public IActionResult AddNewServer()
        {
            var serverInfo = new VirtualServerInfo();
            context.VirtualServers.Add(serverInfo);
            context.SaveChanges();

            return Ok(serverInfo);
        }

        [HttpPost]
        public IActionResult RemoveServers(int[] serverIds, string removeDateTime)
        {
            if(serverIds.Length > 0)
            {
                // выбираем из базы данных серверы, VirtualServeId которых 
                // совпадает с одним из ключей массива serverIds
                var serversToRemove = 
                    from id in serverIds 
                    join server in context.VirtualServers 
                        on id equals server.VirtualServerId 
                    select server;
                var removeDate = DateTime.Parse(removeDateTime);

                foreach(var server in serversToRemove)
                {
                    server.SelectedForRemove = true;
                    server.RemoveDateTime = removeDate;
                    context.Entry(server).State = EntityState.Modified;
                }

                context.SaveChanges();

                // возвращаем дату удаления серверов для 
                return Ok();
            }

            return NotFound();
        }
    }
}