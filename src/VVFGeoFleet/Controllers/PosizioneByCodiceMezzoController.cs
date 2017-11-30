using Modello.Classi;
using Modello.Servizi.Persistence;
using System.Linq;
using System.Web.Http;

namespace VVFGeoFleet.Controllers
{
    public class PosizioneByCodiceMezzoController : ApiController
    {
        private readonly IGetPosizioneByCodiceMezzo getPosizioneByCodiceMezzo;

        public PosizioneByCodiceMezzoController(IGetPosizioneByCodiceMezzo getPosizioneByCodiceMezzo)
        {
            this.getPosizioneByCodiceMezzo = getPosizioneByCodiceMezzo;
        }

        public MessaggioPosizione Get(string id)
        {
            return this.getPosizioneByCodiceMezzo.Get(id);
        }
    }
}
