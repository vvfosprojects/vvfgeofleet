using SimpleInjector.Packaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimpleInjector;
using MongoDB.Driver;
using Modello.Classi;

namespace Persistence.MongoDB
{
    public class Bindings : IPackage
    {
        public void RegisterServices(Container container)
        {
            container.Register<DbContext>(Lifestyle.Singleton);

            container.Register<IMongoCollection<MessaggioPosizione>>(() =>
            {
                return container.GetInstance<DbContext>().MessaggiPosizioneCollection;
            }, Lifestyle.Singleton);

            container.Register<Modello.Servizi.Persistence.IMessaggioPosizioneRepository,
                Servizi.MessaggioPosizioneRepository_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IGetPosizioneByCodiceMezzo,
                Servizi.GetPosizioneByCodiceMezzo_DB>(Lifestyle.Scoped);
        }
    }
}
