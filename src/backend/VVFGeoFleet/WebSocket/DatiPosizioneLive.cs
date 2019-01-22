using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Modello.Classi;

namespace VVFGeoFleet
{
    public class DatiPosizioneLive : PersistentConnection
    {
        protected override Task OnConnected(IRequest request, string connectionId)
        {
            return Connection.Send(connectionId, "Connesso!");
        }

        protected override Task OnReceived(IRequest request, string connectionId, string data)
        {
            return Connection.Broadcast(data);
        }

        public static void InviaPosLive(MessaggioPosizione messaggio)
        {
            try
            {
                GlobalHost.ConnectionManager.GetConnectionContext<DatiPosizioneLive>().Connection.Broadcast(
                      Newtonsoft.Json.JsonConvert.SerializeObject(messaggio, Newtonsoft.Json.Formatting.None, new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore })
                     );
            }
            catch
            {
            }
        }
    }
}
