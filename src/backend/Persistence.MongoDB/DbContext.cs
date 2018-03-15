//-----------------------------------------------------------------------
// <copyright file="DbContext.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Linq;
using log4net;
using Modello.Classi;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;

namespace Persistence.MongoDB
{
    internal class DbContext
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private static IMongoDatabase database;

        internal DbContext(string connectionString)
        {
            if (database == null)
            {
                var pack = new ConventionPack();
                pack.Add(new CamelCaseElementNameConvention());
                ConventionRegistry.Register("camel case", pack, t => true);

                this.MapClasses();

                var url = MongoUrl.Create(connectionString);
                IEnumerable<MongoCredential> credentials;
                if (!string.IsNullOrWhiteSpace(url.Username))
                    credentials = new[] { MongoCredential.CreateCredential(url.DatabaseName, url.Username, url.Password) };
                else
                    credentials = Enumerable.Empty<MongoCredential>();

                var settings = new MongoClientSettings
                {
                    ClusterConfigurator = cb =>
                    {
                        cb.Subscribe<CommandStartedEvent>(e =>
                        {
                            log.Debug($"{e.CommandName} - {e.Command.ToJson()}");
                        });
                    },
                    Server = url.Server,
                    Credentials = credentials
                };

                var client = new MongoClient(settings);
                database = client.GetDatabase(url.DatabaseName);

                this.CreateIndexes();
            }
        }

        private void CreateIndexes()
        {
            // Gli indici su Ultimo sono partial indexes (vedi:
            // https://docs.mongodb.com/manual/core/index-partial/). Infatti non ha senso cercare
            // documenti con Ultimo == false, ma solo con Ultimo == true.

            {
                var indexDefinition = Builders<MessaggioPosizione>.IndexKeys
                    .Ascending(_ => _.Ultimo)
                    .Descending(_ => _.IstanteAcquisizione);

                var indexOptions = new CreateIndexOptions<MessaggioPosizione>
                {
                    PartialFilterExpression = Builders<MessaggioPosizione>.Filter.Eq(m => m.Ultimo, true),
                    Background = true
                };

                this.MessaggiPosizioneCollection.Indexes.CreateOne(indexDefinition, indexOptions);
            }

            {
                var indexDefinition = Builders<MessaggioPosizione>.IndexKeys
                    .Ascending(_ => _.Ultimo)
                    .Geo2DSphere(_ => _.Localizzazione)
                    .Descending(_ => _.IstanteAcquisizione);

                var indexOptions = new CreateIndexOptions<MessaggioPosizione>
                {
                    PartialFilterExpression = Builders<MessaggioPosizione>.Filter.Eq(m => m.Ultimo, true),
                    Background = true
                };

                this.MessaggiPosizioneCollection.Indexes.CreateOne(indexDefinition, indexOptions);
            }

            //This index is useful on message store to check whether the upcoming message
            //is more recent than the last one. Thanks to this index, information about message time and _id
            //is fetched directly from index, with no nooed to access data at all.
            {
                var indexDefinition = Builders<MessaggioPosizione>.IndexKeys
                    .Ascending(_ => _.Ultimo)
                    .Ascending(_ => _.CodiceMezzo)
                    .Ascending(_ => _.IstanteAcquisizione)
                    .Ascending(_ => _.Id);

                var indexOptions = new CreateIndexOptions<MessaggioPosizione>
                {
                    PartialFilterExpression = Builders<MessaggioPosizione>.Filter.Eq(m => m.Ultimo, true),
                    Background = true
                };

                this.MessaggiPosizioneCollection.Indexes.CreateOne(indexDefinition, indexOptions);
            }

            //Indice utile a supportare le query sul percorso di un mezzo in un intervallo temporale dato.
            {
                var indexDefinition = Builders<MessaggioPosizione>.IndexKeys
                    .Ascending(_ => _.CodiceMezzo)
                    .Descending(_ => _.IstanteAcquisizione);

                var indexOptions = new CreateIndexOptions<MessaggioPosizione>
                {
                    Background = true
                };

                this.MessaggiPosizioneCollection.Indexes.CreateOne(indexDefinition, indexOptions);
            }
        }

        private void MapClasses()
        {
            BsonClassMap.RegisterClassMap<MessaggioPosizione>(cm =>
            {
                cm.AutoMap();
                cm.MapIdMember(c => c.Id)
                    .SetIdGenerator(StringObjectIdGenerator.Instance);
                cm.SetIgnoreExtraElements(true);
            });

            BsonClassMap.RegisterClassMap<Localizzazione>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(c => c.Lat);
                cm.UnmapProperty(c => c.Lon);
                cm.MapField("coordinates");
            });
        }

        public IMongoCollection<MessaggioPosizione> MessaggiPosizioneCollection
        {
            get
            {
                return database.GetCollection<MessaggioPosizione>("messaggiPosizione");
            }
        }
    }
}
