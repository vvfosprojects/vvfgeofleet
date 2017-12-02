[assembly: WebActivator.PostApplicationStartMethod(typeof(VVFGeoFleet.App_Start.SimpleInjectorWebApiInitializer), "Initialize")]

namespace VVFGeoFleet.App_Start
{
    using SimpleInjector;
    using SimpleInjector.Integration.WebApi;
    using SimpleInjector.Lifestyles;
    using System.Linq;
    using System.Reflection;
    using System.Web.Compilation;
    using System.Web.Http;

    public static class SimpleInjectorWebApiInitializer
    {
        /// <summary>
        ///   Initialize the container and register it as Web API Dependency Resolver.
        /// </summary>
        public static void Initialize()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new AsyncScopedLifestyle();

            InitializeContainer(container);

            container.RegisterWebApiControllers(GlobalConfiguration.Configuration);

            container.Verify();

            GlobalConfiguration.Configuration.DependencyResolver =
                new SimpleInjectorWebApiDependencyResolver(container);
        }

        private static void InitializeContainer(Container container)
        {
            // Scan all the referenced assemblies for packages containing DI wiring rules
            var assemblies = BuildManager.GetReferencedAssemblies().Cast<Assembly>();
            container.RegisterPackages(assemblies);
        }
    }
}
