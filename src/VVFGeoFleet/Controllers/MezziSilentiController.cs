//-----------------------------------------------------------------------
// <copyright file="MezziSilentiController.cs" company="CNVVF">
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
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Modello.Classi;
using Modello.Servizi.Persistence;

namespace VVFGeoFleet.Controllers
{
    public class MezziSilentiController : ApiController
    {
        private readonly IGetMezziSilenti getMezziSilenti;

        public MezziSilentiController(IGetMezziSilenti getMezziSilenti)
        {
            this.getMezziSilenti = getMezziSilenti;
        }

        [Route("api/MezziSilenti/")]
        public IEnumerable<MessaggioPosizione> Get([FromUri] int daSecondi)
        {
            return getMezziSilenti.Get(daSecondi);
        }

        [Route("api/MezziSilenti/PerClassi")]
        public IEnumerable<MessaggioPosizione> Get([FromUri] int daSecondi, [FromUri] string[] perClassi)
        {
            return getMezziSilenti.Get(daSecondi, perClassi);
        }
    }
}
