using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;
using Persistence.MongoDB.DTOs;
using System.Linq;

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
