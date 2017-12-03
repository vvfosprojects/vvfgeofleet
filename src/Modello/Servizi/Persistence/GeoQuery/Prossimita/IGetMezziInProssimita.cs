using Modello.Classi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.Persistence.GeoQuery.Prossimita
{
    public interface IGetMezziInProssimita
    {
        QueryProssimitaResult Get(Localizzazione punto, float distanzaMaxMt, string[] classiMezzo);
    }
}
