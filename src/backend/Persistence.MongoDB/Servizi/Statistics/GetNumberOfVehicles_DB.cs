using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi;
using Modello.Servizi.Statistics;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi.Statistics
{
    internal class GetNumberOfVehicles_DB : IGetNumberOfVehicles
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetNumberOfVehicles_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
        }

        public long Get()
        {
            return this.GetAsync().Result;
        }

        public long GetActive(int withinSeconds)
        {
            return this.GetActiveAsync(withinSeconds).Result;
        }

        public Task<long> GetActiveAsync(int withinSeconds)
        {
            return this.messaggiPosizioneCollection.CountAsync(m =>
                m.Ultimo &&
                m.IstanteAcquisizione >= DateTime.UtcNow.AddSeconds(-withinSeconds));
        }

        public Task<long> GetAsync()
        {
            return this.messaggiPosizioneCollection.CountAsync(m => m.Ultimo);
        }
    }
}
