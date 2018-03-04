//-----------------------------------------------------------------------
// <copyright file="GetMezziInProssimita_DB.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of VVFGeoFleet.
// VVFGeoFleet is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using System;
using System.Diagnostics;
using System.Linq;
using Modello.Classi;
using Modello.Servizi.Persistence.GeoQuery.Prossimita;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class GetMezziInProssimita_DB : IGetMezziInProssimita
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetMezziInProssimita_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public QueryProssimitaResult Get(Localizzazione punto, float distanzaMaxMt, string[] classiMezzo, int attSec)
        {
            var lastMessageFilter = Builders<MessaggioPosizione>.Filter
                .Eq(m => m.Ultimo, true);

            var recentMessagesFilter = Builders<MessaggioPosizione>.Filter
                .Gte(m => m.IstanteAcquisizione, DateTime.UtcNow.AddSeconds(-attSec));

            var filter = lastMessageFilter & recentMessagesFilter;

            if ((classiMezzo != null) && (classiMezzo.Length > 0))
            {
                var classFilter = Builders<MessaggioPosizione>.Filter
                    .AnyIn(m => m.ClassiMezzo, classiMezzo);

                filter &= classFilter;
            }

            var serializerRegistry = BsonSerializer.SerializerRegistry;
            var documentSerializer = serializerRegistry.GetSerializer<MessaggioPosizione>();
            var bsonFilter = filter.Render(documentSerializer, serializerRegistry);

            var geoNearOptions = new BsonDocument {
                { "near", new BsonDocument {
                    { "type", "Point" },
                    { "coordinates", new BsonArray { punto.Lon, punto.Lat } },
                } },
                { "distanceField", "distanza" },
                { "maxDistance", distanzaMaxMt },
                { "query", bsonFilter },
                { "spherical" , true },
            };

            var pipeline = new[] {
                new BsonDocument { { "$geoNear", geoNearOptions } },
                new BsonDocument { { "$sort", new BsonDocument { { "codiceMezzo", 1 } } } },
            };

            var sw = new Stopwatch();
            sw.Start();
            var prossimitaMezzo = this.messaggiPosizioneCollection.Aggregate<BsonDocument>(pipeline)
                .ToEnumerable()
                .Select(d => new ProssimitaMezzo()
                {
                    MessaggioPosizione = BsonSerializer.Deserialize<MessaggioPosizione>(d),
                    DistanzaMt = (float)d["distanza"].AsDouble
                })
                .ToArray();

            var arrayProssimitaMezzo = prossimitaMezzo.ToArray();
            sw.Stop();

            return new QueryProssimitaResult()
            {
                IstanteQuery = DateTime.UtcNow,
                NumeroMezzi = arrayProssimitaMezzo.Length,
                DistanzaMaxMt = distanzaMaxMt,
                Punto = punto,
                DurataQuery_msec = sw.ElapsedMilliseconds,
                Risultati = arrayProssimitaMezzo
            };
        }
    }
}
