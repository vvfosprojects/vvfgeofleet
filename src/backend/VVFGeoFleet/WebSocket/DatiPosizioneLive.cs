 
﻿//-----------------------------------------------------------------------
// <copyright file="DatiPosizioneLive.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of VVFGeoFleet.
// VVFGeoFleet is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web
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

