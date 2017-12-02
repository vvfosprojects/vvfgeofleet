using Modello.Classi;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;
using Persistence.MongoDB.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
