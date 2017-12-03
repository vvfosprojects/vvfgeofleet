using Modello.Classi;
using Modello.Servizi.Persistence.GeoQuery.Prossimita;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Persistence.MongoDB.DTOs;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.MongoDB.Servizi
{
    internal class GetMezziInProssimita_DB : IGetMezziInProssimita
    {
        private readonly IMongoCollection<MessaggioPosizione_DTO> messaggiPosizioneCollection;

        public GetMezziInProssimita_DB(IMongoCollection<MessaggioPosizione_DTO> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public QueryProssimitaResult Get(Localizzazione punto, float distanzaMaxMt, string[] classiMezzo)
        {
            BsonDocument query;

            if ((classiMezzo != null) && (classiMezzo.Length > 0))
                query = new BsonDocument {
                { "query", new BsonDocument {
                    { "istanteAcquisizione", new BsonDocument {
                        {
                            "$gt", DateTime.Now.AddHours(-24).ToUniversalTime()
                        }
                    } },
                    { "classiMezzo", new BsonDocument {
                        {
                            "$in", new BsonArray(classiMezzo)
                        }
                    } }
                }
                } };
            else
                query = new BsonDocument {
                { "query", new BsonDocument {
                    { "istanteAcquisizione", new BsonDocument {
                        {
                            "$gt", DateTime.Now.AddHours(-24).ToUniversalTime()
                        }
                    } }
                }
                }
            };

            var geoNearOptions = new BsonDocument {
                { "near", new BsonDocument {
                    { "type", "Point" },
                    { "coordinates", new BsonArray { punto.Lat, punto.Lon } },
                } },
                { "distanceField", "distanza" },
                { "maxDistance", distanzaMaxMt },
                query,
                { "spherical" , true },
            };

            var pipeline = new[] {
                new BsonDocument { { "$geoNear", geoNearOptions } },
            };

            var sw = new Stopwatch();
            sw.Start();
            var prossimitaMezzo = this.messaggiPosizioneCollection.Aggregate<BsonDocument>(pipeline)
                .ToEnumerable()
                .Select(d => new ProssimitaMezzo()
                {
                    MessaggioPosizione = BsonSerializer.Deserialize<MessaggioPosizione_DTO>(d).ConvertToDomain(),
                    DistanzaMt = (float)d["distanza"].AsDouble
                });

            var arrayProssimitaMezzo = prossimitaMezzo.ToArray();
            sw.Stop();

            return new QueryProssimitaResult()
            {
                IstanteQuery = DateTime.Now.ToUniversalTime(),
                NumeroMezzi = arrayProssimitaMezzo.Length,
                DistanzaMaxMt = distanzaMaxMt,
                Punto = punto,
                DurataQuery_msec = sw.ElapsedMilliseconds,
                Risultati = arrayProssimitaMezzo
            };
        }
    }
}
