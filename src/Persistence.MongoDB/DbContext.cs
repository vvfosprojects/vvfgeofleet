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
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;
using Persistence.MongoDB.DTOs;

namespace Persistence.MongoDB
{
    internal class DbContext
    {
        private static IMongoDatabase database;

        public DbContext()
        {
            if (database == null)
            {
                AutomapperConfiguration.Configure();

                var pack = new ConventionPack();
                pack.Add(new CamelCaseElementNameConvention());
                ConventionRegistry.Register("camel case", pack, t => true);

                this.MapClasses();

                var client = new MongoClient();
                database = client.GetDatabase("VVFGeoFleet");

                this.CreateIndexes();
            }
        }

        private void CreateIndexes()
        {
            {
                var indexDefinition = Builders<MessaggioPosizione_DTO>.IndexKeys
                    .Ascending(_ => _.CodiceMezzo)
                    .Descending(_ => _.IstanteAcquisizione);
                this.MessaggiPosizioneCollection.Indexes.CreateOne(indexDefinition);
            }

            {
                var indexDefinition = Builders<MessaggioPosizione_DTO>.IndexKeys
                    .Geo2DSphere(_ => _.Localizzazione)
                    .Descending(_ => _.IstanteAcquisizione)
                    .Ascending(_ => _.ClassiMezzo);
                this.MessaggiPosizioneCollection.Indexes.CreateOne(indexDefinition);
            }
        }

        private void MapClasses()
        {
            BsonClassMap.RegisterClassMap<MessaggioPosizione_DTO>(cm =>
            {
                cm.AutoMap();
                cm.MapIdMember(c => c.Id)
                    .SetIdGenerator(StringObjectIdGenerator.Instance);
            });
        }

        public IMongoCollection<MessaggioPosizione_DTO> MessaggiPosizioneCollection
        {
            get
            {
                return database.GetCollection<MessaggioPosizione_DTO>("messaggiPosizione");
            }
        }
    }
}
