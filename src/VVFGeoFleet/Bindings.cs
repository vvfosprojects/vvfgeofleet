using SimpleInjector.Packaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SimpleInjector;

namespace VVFGeoFleet
{
    public class Bindings : IPackage
    {
        public void RegisterServices(Container container)
        {
            container.Register<Modello.Configurazione.IAppConfig, Configurazione.AppConfig_FromWebConfig>(Lifestyle.Singleton);
        }
    }
}
