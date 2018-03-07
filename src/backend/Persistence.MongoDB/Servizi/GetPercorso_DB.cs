using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class GetPercorso_DB : IGetPercorso
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetPercorso_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
        }

        public IEnumerable<MessaggioPosizione> Get(string codiceMezzo, DateTime from, DateTime to)
        {
            return this.messaggiPosizioneCollection.Find(m =>
                m.CodiceMezzo == codiceMezzo &&
                m.IstanteAcquisizione >= from &&
                m.IstanteAcquisizione <= to)
                .SortBy(m => m.IstanteAcquisizione)
                .ToEnumerable();
        }
    }
}
