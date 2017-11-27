using Modello;
using Persistence.MongoDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace VVFGeoFleet.Controllers
{
    public class StoreController : ApiController
    {
        public void Post([FromBody]MessaggioPosizione messaggio)
        {
            var dbContext = new DbContext();
            var collezione = dbContext.MessaggiPosizione;

            messaggio.IstanteArchiviazione = DateTime.Now;
            collezione.InsertOne(messaggio);
        }
    }
}