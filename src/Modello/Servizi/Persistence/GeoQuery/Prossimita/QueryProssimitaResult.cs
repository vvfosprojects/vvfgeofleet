using Modello.Classi;
using System;

namespace Modello.Servizi.Persistence.GeoQuery.Prossimita
{
    public class QueryProssimitaResult
    {
        public DateTime IstanteQuery { get; set; }
        public Localizzazione Punto { get; set; }
        public float DistanzaMaxMt { get; set; }
        public int NumeroMezzi { get; set; }
        public long DurataQuery_msec { get; set; }
        public ProssimitaMezzo[] Risultati { get; set; }
    }
}
