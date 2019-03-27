using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using Modello.Classi;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

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
                    JsonConvert.SerializeObject(messaggio, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                        ,
                        ContractResolver = new DefaultContractResolver() { NamingStrategy = new CamelCaseNamingStrategy() }
                    })

                    );
            }
            catch
            {

            }


        }
    }
}