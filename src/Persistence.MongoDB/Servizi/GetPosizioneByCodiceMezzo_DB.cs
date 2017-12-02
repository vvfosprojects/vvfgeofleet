using Modello.Servizi.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi;
using MongoDB.Driver;
using Persistence.MongoDB.DTOs;

namespace Persistence.MongoDB.Servizi
{
    internal class GetPosizioneByCodiceMezzo_DB : IGetPosizioneByCodiceMezzo
    {
        private readonly IMongoCollection<MessaggioPosizione_DTO> messaggiPosizioneCollection;

        public GetPosizioneByCodiceMezzo_DB(DbContext dbContext)
        {
            this.messaggiPosizioneCollection = dbContext.MessaggiPosizioneCollection;
        }

        public MessaggioPosizione Get(string codiceMezzo)
        {
            var dto = this.messaggiPosizioneCollection.Find(m => m.CodiceMezzo == codiceMezzo)
               .SortByDescending(m => m.IstanteAcquisizione)
                .Limit(1)
                .Single();

            return dto.ConvertToDomain();
        }
    }
}
