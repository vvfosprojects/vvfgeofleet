using System;
using System.Linq;
using System.Web;
using IpTools;
using Modello.Classi;
using Modello.Servizi.Persistence;

namespace VVFGeoFleet.Authorization.IpBased
{
    public class IpAuthChecker : IStoreMessaggioPosizione
    {
        private readonly IStoreMessaggioPosizione decorated;
        private readonly IpNetworkChecker checker;

        public IpAuthChecker(IStoreMessaggioPosizione decorated,
            IpNetworkChecker checker)
        {
            this.decorated = decorated ?? throw new ArgumentNullException(nameof(decorated));
            this.checker = checker ?? throw new ArgumentNullException(nameof(checker));
        }

        /// <summary>
        ///   Injected field.
        /// </summary>
        public string[] AllowedSources { get; set; }

        public void Store(MessaggioPosizione messaggio)
        {
            var sourceIp = HttpContext.Current.Request.UserHostAddress;

            if (this.AllowedSources.All(allowed => !checker.Check(sourceIp, allowed)))
                throw new UnauthorizedAccessException("Client not authorized by the current configuration policies.");

            this.decorated.Store(messaggio);
        }
    }
}
