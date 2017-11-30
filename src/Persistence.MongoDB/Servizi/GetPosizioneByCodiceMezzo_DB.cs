using Modello.Servizi.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class GetPosizioneByCodiceMezzo_DB : IGetPosizioneByCodiceMezzo
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetPosizioneByCodiceMezzo_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public MessaggioPosizione Get(string codiceMezzo)
        {
            return this.messaggiPosizioneCollection.Find(m => m.CodiceMezzo == codiceMezzo)
               .SortByDescending(m => m.IstanteAcquisizione)
                .Limit(1)
                .Single();
        }
    }
}
