using Modello.Classi;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;
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
                this.MapClasses();

                var client = new MongoClient();
                database = client.GetDatabase("VVFGeoFleet");

                this.CreateIndexes();
            }
        }

        private void CreateIndexes()
        {
            var indexDefinition = Builders<MessaggioPosizione>.IndexKeys
                .Descending(_ => _.IstanteAcquisizione)
                .Ascending(_ => _.CodiceMezzo);
            this.MessaggiPosizioneCollection.Indexes.CreateOne(indexDefinition);
        }

        private void MapClasses()
        {
            BsonClassMap.RegisterClassMap<MessaggioPosizione>(cm =>
            {
                cm.AutoMap();
                cm.MapIdMember(c => c.Id)
                    .SetIdGenerator(StringObjectIdGenerator.Instance);
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
