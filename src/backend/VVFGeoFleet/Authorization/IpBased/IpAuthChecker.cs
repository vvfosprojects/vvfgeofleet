//-----------------------------------------------------------------------
// <copyright file="IpAuthChecker.cs" company="CNVVF">
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
