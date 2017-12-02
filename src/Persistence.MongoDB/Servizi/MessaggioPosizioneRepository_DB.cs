using AutoMapper;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;
using Persistence.MongoDB.DTOs;
using System;
using System.Linq;

namespace Persistence.MongoDB.Servizi
{
    internal class MessaggioPosizioneRepository_DB : IMessaggioPosizioneRepository
    {
        private readonly IMongoCollection<MessaggioPosizione_DTO> messaggiPosizioneCollection;

        public MessaggioPosizioneRepository_DB(DbContext dbContext)
        {
            this.messaggiPosizioneCollection = dbContext.MessaggiPosizioneCollection;
        }

        public MessaggioPosizione GetById(string id)
        {
            var dto = this.messaggiPosizioneCollection
                .Find(m => m.Id == id)
                .Single();

            return dto.ConvertToDomain();
        }

        public void Store(MessaggioPosizione messaggioPosizione)
        {
            if (!string.IsNullOrWhiteSpace(messaggioPosizione.Id))
                throw new ArgumentException("Non può essere null", nameof(MessaggioPosizione.Id));

            messaggioPosizione.IstanteArchiviazione = DateTime.Now;
            var dto = Mapper.Map<MessaggioPosizione_DTO>(messaggioPosizione);
            this.messaggiPosizioneCollection.InsertOne(dto);
            messaggioPosizione.Id = dto.Id;
        }
    }
}
