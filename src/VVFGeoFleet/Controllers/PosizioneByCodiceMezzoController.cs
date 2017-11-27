using Modello.Classi;
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
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public PosizioneByCodiceMezzoController(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public MessaggioPosizione Get(string id)
        {
            var localizzazione = this.messaggiPosizioneCollection.Find(m => m.CodiceMezzo == id)
                .SortByDescending(m => m.IstanteAcquisizione)
                .Limit(1)
                .SingleOrDefault();

            return localizzazione;
        }
    }
}