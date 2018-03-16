using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using log4net;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class StoreMessaggioPosizione_LogTooHighVelocities_Decorator : IStoreMessaggioPosizione
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private readonly IStoreMessaggioPosizione decorated;
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public StoreMessaggioPosizione_LogTooHighVelocities_Decorator(
            IStoreMessaggioPosizione decorated,
            IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection
            )
        {
            this.decorated = decorated ?? throw new ArgumentNullException(nameof(decorated));
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
            this.VelocityThreshold_Kmh = 500;
        }

        /// <summary>
        ///   Threshold beyond which velocities are logged
        /// </summary>
        public float VelocityThreshold_Kmh { get; set; }

        public void Store(MessaggioPosizione newMessage)
        {
            this.decorated.Store(newMessage);

            var lastTwoMessages = this.messaggiPosizioneCollection.Find(m => m.CodiceMezzo == newMessage.CodiceMezzo)
                .SortByDescending(m => m.IstanteAcquisizione)
                .Limit(2)
                .ToList();

            if (lastTwoMessages.Count == 2)
            {
                var mostRecentMsg = lastTwoMessages[0];
                var lessRecentMsg = lastTwoMessages[1];
                var distance_km = mostRecentMsg.Localizzazione.GetDistanceTo(lessRecentMsg.Localizzazione) / 1e3;
                var hours = mostRecentMsg.IstanteAcquisizione.Subtract(lessRecentMsg.IstanteAcquisizione).TotalHours;
                var velocity_Kmh = distance_km / hours;

                if (velocity_Kmh >= this.VelocityThreshold_Kmh)
                    log.Warn($"Too high velocity for vehicle { mostRecentMsg.CodiceMezzo }: { (int)velocity_Kmh }Km/h registered at { mostRecentMsg.IstanteAcquisizione.ToString("yyyyMMddHHmmss") }. Message ids: { mostRecentMsg.Id }, { lessRecentMsg.Id }");
            }
        }
    }
}
