using System;

namespace Modello.Classi
{
    public class MessaggioPosizione
    {
        public string Id { get; set; }

        public string CodiceMezzo { get; set; }
        public string[] ClassiMezzo { get; set; }
        public Localizzazione Localizzazione { get; set; }
        public DateTime IstanteAcquisizione { get; set; }
        public Fonte Fonte { get; set; }
        public InfoFonte InfoFonte { get; set; }
        public InfoSO115 InfoSO115 { get; set; }

        public DateTime IstanteArchiviazione { get; set; }
    }
}
