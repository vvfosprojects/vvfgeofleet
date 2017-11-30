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
    internal class MessaggioPosizioneRepository_DB : IMessaggioPosizioneRepository
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public MessaggioPosizioneRepository_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public MessaggioPosizione GetById(string id)
        {
            return this.messaggiPosizioneCollection
                .Find(m => m.Id == id)
                .Single();
        }

        public void Store(MessaggioPosizione messaggioPosizione)
        {
            if (!string.IsNullOrWhiteSpace(messaggioPosizione.Id))
                throw new ArgumentException("Non può essere null", nameof(MessaggioPosizione.Id));

            messaggioPosizione.IstanteArchiviazione = DateTime.Now;
            this.messaggiPosizioneCollection.InsertOne(messaggioPosizione);
        }
    }
}
