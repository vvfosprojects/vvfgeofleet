using Modello.Classi;
using Modello.Servizi.Persistence;
using System;
using System.Web.Http;

namespace VVFGeoFleet.Controllers
{
    public class MessaggiPosizioneController : ApiController
    {
        private readonly IMessaggioPosizioneRepository messaggioPosizioneRepository;

        public MessaggiPosizioneController(IMessaggioPosizioneRepository messaggioPosizioneRepository)
        {
            this.messaggioPosizioneRepository = messaggioPosizioneRepository;
        }

        /// <summary>
        ///   Restituisce un messaggio posizione per id
        /// </summary>
        /// <param name="id">L'id del messaggio</param>
        /// <returns>Il messaggio</returns>
        public MessaggioPosizione Get(string id)
        {
            return this.messaggioPosizioneRepository.GetById(id);
        }

        /// <summary>
        ///   Memorizza un nuovo messaggio posizione
        /// </summary>
        /// <param name="messaggio">Il messaggio</param>
        /// <returns>L'oggetto inserito con la sua location</returns>
        public IHttpActionResult Post([FromBody]MessaggioPosizione messaggio)
        {
            messaggio.IstanteArchiviazione = DateTime.Now;
            this.messaggioPosizioneRepository.Store(messaggio);

            return CreatedAtRoute("DefaultApi", new { id = messaggio.Id }, messaggio);
        }
    }
}
