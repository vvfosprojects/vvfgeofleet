using SimpleInjector;
using SimpleInjector.Packaging;

namespace Persistence.MongoDB
{
    public class Bindings : IPackage
    {
        public void RegisterServices(Container container)
        {
            container.Register<DbContext>(Lifestyle.Singleton);

            container.Register<Modello.Servizi.Persistence.IMessaggioPosizioneRepository,
                Servizi.MessaggioPosizioneRepository_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IGetPosizioneByCodiceMezzo,
                Servizi.GetPosizioneByCodiceMezzo_DB>(Lifestyle.Scoped);
        }
    }
}
