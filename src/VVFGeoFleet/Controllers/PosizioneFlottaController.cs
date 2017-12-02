using Modello.Classi;
using Modello.Servizi.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace VVFGeoFleet.Controllers
{
    public class PosizioneFlottaController : ApiController
    {
        private readonly IGetPosizioneFlotta getPosizioneFlotta;

        public PosizioneFlottaController(IGetPosizioneFlotta getPosizioneFlotta)
        {
            this.getPosizioneFlotta = getPosizioneFlotta;
        }

        [Route("api/PosizioneFlotta/")]
        public IEnumerable<MessaggioPosizione> Get()
        {
            return this.getPosizioneFlotta.Get();
        }

        [Route("api/PosizioneFlotta/PerClassi")]
        public IEnumerable<MessaggioPosizione> Get([FromUri] string[] classiMezzo)
        {
            return this.getPosizioneFlotta.Get(classiMezzo);
        }
    }
}
