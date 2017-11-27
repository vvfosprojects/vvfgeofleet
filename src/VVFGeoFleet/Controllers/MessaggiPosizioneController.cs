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
    public class MessaggiPosizioneController : ApiController
    {
        /// <summary>
        /// Restituisce un messaggio posizione per id
        /// </summary>
        /// <param name="id">L'id del messaggio</param>
        /// <returns>Il messaggio</returns>
        public MessaggioPosizione Get(string id)
        {
            var dbContext = new DbContext();
            var collezione = dbContext.MessaggiPosizione;

            return collezione.Find(m => m.Id == id)
                .Single();
        }

        /// <summary>
        /// Memorizza un nuovo messaggio posizione
        /// </summary>
        /// <param name="messaggio">Il messaggio</param>
        /// <returns>L'oggetto inserito con la sua location</returns>
        public IHttpActionResult Post([FromBody]MessaggioPosizione messaggio)
        {
            var dbContext = new DbContext();
            var collezione = dbContext.MessaggiPosizione;

            messaggio.IstanteArchiviazione = DateTime.Now;
            collezione.InsertOne(messaggio);

            return CreatedAtRoute("DefaultApi", new { id = messaggio.Id }, messaggio);
        }
    }
}