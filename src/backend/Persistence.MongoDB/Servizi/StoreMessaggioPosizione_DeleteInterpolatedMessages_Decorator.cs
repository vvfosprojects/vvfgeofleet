using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator : IStoreMessaggioPosizione
    {
        private readonly IStoreMessaggioPosizione decorated;
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator(
            IStoreMessaggioPosizione decorated,
            IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection
            )
        {
            this.decorated = decorated ?? throw new ArgumentNullException(nameof(decorated));
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
            this.InterpolationThreshold_mt = 1;
        }

        /// <summary>
        ///   Interpolation works among messages below this threshold.
        /// </summary>
        public float InterpolationThreshold_mt { get; set; }

        public void Store(MessaggioPosizione messaggio)
        {
            var lastTwoMessages = this.messaggiPosizioneCollection.Find(m => m.CodiceMezzo == messaggio.CodiceMezzo)
                .SortByDescending(m => m.IstanteAcquisizione)
                .Limit(2)
                .ToList();

            if (lastTwoMessages.Count == 2)
            {
                var lastThreeMessages = lastTwoMessages.Concat(new[] { messaggio }).ToArray();
                if (this.AllInTheSamePosition(lastThreeMessages))
                {
                    var msgToInterpolate = lastTwoMessages[0];
                    var interpolationData = msgToInterpolate.InterpolationData ?? new InterpolationData(0, 0, null);

                    messaggio.InterpolationData = new InterpolationData(
                        (int)(interpolationData.Length_sec +
                            messaggio.IstanteAcquisizione.Subtract(msgToInterpolate.IstanteAcquisizione).TotalSeconds),
                        interpolationData.Messages + 1,
                        msgToInterpolate.IstanteAcquisizione);

                    this.messaggiPosizioneCollection.DeleteOne(m => m.Id == msgToInterpolate.Id);
                }
            }

            this.decorated.Store(messaggio);
        }

        private bool AllInTheSamePosition(MessaggioPosizione[] messages)
        {
            var first = messages.First();
            var allButFirst = messages.Skip(1);

            return allButFirst.All(m => this.AreCloseEnough(first.Localizzazione, m.Localizzazione));
        }

        private bool AreCloseEnough(Localizzazione loc1, Localizzazione loc2)
        {
            var coord1 = new GeoCoordinate(loc1.Lat, loc1.Lon);
            var coord2 = new GeoCoordinate(loc2.Lat, loc2.Lon);

            var distance = coord1.GetDistanceTo(coord2);
            return distance <= InterpolationThreshold_mt;
        }
    }
}
