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
    public class ReadController : ApiController
    {
        public object Get(string id)
        {
            var dbContext = new DbContext();
            var codiceMezzo = "M.12345";
            var localizzazione = dbContext.MessaggiPosizione.Find(m => m.CodiceMezzo == codiceMezzo)
                .Project(m => m.Localizzazione)
                .SortByDescending(m => m.IstanteAcquisizione)
                .Limit(1)
                .SingleOrDefault();

            return new
            {
                codiceMezzo = id,
                localizzazione = localizzazione
            };
        }
    }
}