using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Modello.Classi;
using Modello.Servizi.Persistence;

namespace VVFGeoFleet.Controllers
{
    /// <summary>
    ///   Restituisce tutti i messaggi di posizione relativi ad un mezzo in un intervallo temporale.
    /// </summary>
    public class PercorsoController : ApiController
    {
        private readonly IGetPercorso getPercorso;

        public PercorsoController(IGetPercorso getPercorso)
        {
            this.getPercorso = getPercorso ?? throw new ArgumentNullException(nameof(getPercorso));
        }

        // GET: api/Percorso
        public IEnumerable<MessaggioPosizione> Get(string id, DateTime from, DateTime to)
        {
            return this.getPercorso.Get(id, from, to);
        }
    }
}
