using Modello;
using MongoDB.Driver;
using Persistence.MongoDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace VVFGeoFleet.Controllers
{
    public class PosizioneByCodiceMezzoController : ApiController
    {
        public MessaggioPosizione Get(string id)
        {
            var dbContext = new DbContext();
            var localizzazione = dbContext.MessaggiPosizione.Find(m => m.CodiceMezzo == id)
                .SortByDescending(m => m.IstanteAcquisizione)
                .Limit(1)
                .SingleOrDefault();

            return localizzazione;
        }
    }
}