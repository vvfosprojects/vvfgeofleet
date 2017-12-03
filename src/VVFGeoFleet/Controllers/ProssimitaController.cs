using Modello.Classi;
using Modello.Servizi.Persistence.GeoQuery.Prossimita;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace VVFGeoFleet.Controllers
{
    public class ProssimitaController : ApiController
    {
        private readonly IGetMezziInProssimita getmezziInProssimita;

        public ProssimitaController(IGetMezziInProssimita getmezziInProssimita)
        {
            this.getmezziInProssimita = getmezziInProssimita;
        }

        public QueryProssimitaResult Get(float lat, float lon, float distanzaMaxMt, [FromUri] string[] classiMezzo)
        {
            return this.getmezziInProssimita.Get(new Localizzazione { Lat = lat, Lon = lon }, distanzaMaxMt, classiMezzo);
        }
    }
}
