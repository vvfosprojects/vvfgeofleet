using Modello.Servizi.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi;
using Persistence.MongoDB.DTOs;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace Persistence.MongoDB.Servizi
{
    internal class GetPosizioneFlotta_DB : IGetPosizioneFlotta
    {
        private readonly IMongoCollection<MessaggioPosizione_DTO> messaggiPosizione;

        public GetPosizioneFlotta_DB(IMongoCollection<MessaggioPosizione_DTO> messaggiPosizione)
        {
            this.messaggiPosizione = messaggiPosizione;
        }

        public IEnumerable<MessaggioPosizione> Get()
        {
            return this.Get(null);
        }

        /// <summary>
        ///   Restituisce la posizione dei mezzi per i quali c'è un messaggio di posizione giunto
        ///   nelle ultime 24 ore.
        /// </summary>
        /// <param name="classiMezzo"></param>
        /// <returns></returns>
        public IEnumerable<MessaggioPosizione> Get(string[] classiMezzo)
        {
            IAggregateFluent<MessaggioPosizione_DTO> query = this.messaggiPosizione.Aggregate<MessaggioPosizione_DTO>()
                .SortBy(m => m.CodiceMezzo)
                .ThenByDescending(m => m.IstanteAcquisizione);

            if (classiMezzo != null && classiMezzo.Length > 0)
            {
                var filter = Builders<MessaggioPosizione_DTO>
                    .Filter
                    .AnyIn(m => m.ClassiMezzo, classiMezzo);

                query = query
                    .Match(filter);
            }

            var query2 = query
                .Match(m => m.IstanteAcquisizione > DateTime.Now.AddHours(-24))
                .Group(BsonDocument.Parse(@"{ _id: '$codiceMezzo', messaggio: { $first: '$$ROOT' } }"))
                .Project(BsonDocument.Parse(@"{ _id: 0, messaggio: 1 }"));

            var resultSet = query2
                .ToEnumerable()
                .Select(d => BsonSerializer.Deserialize<MessaggioPosizione_DTO>(d["messaggio"].AsBsonDocument))
                .Select(dto => dto.ConvertToDomain());

            return resultSet;
        }
    }
}
