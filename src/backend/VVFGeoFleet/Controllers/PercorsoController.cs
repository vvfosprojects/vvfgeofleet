//-----------------------------------------------------------------------
// <copyright file="PercorsoController.cs" company="CNVVF">
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
using System.Web.Http;
using Modello.Classi;
using Modello.Servizi.Persistence;

namespace VVFGeoFleet.Controllers
{
    /// <summary>
    ///   Restituisce tutti i messaggi di posizione relativi ad un mezzo in un intervallo temporale.
    /// </summary>
    public class PercorsoController : ApiController
    {
        private readonly IGetPercorso getPercorso;

        public PercorsoController(IGetPercorso getPercorso)
        {
            this.getPercorso = getPercorso ?? throw new ArgumentNullException(nameof(getPercorso));
        }

        // GET: api/Percorso
        public IEnumerable<MessaggioPosizione> Get(string id, DateTime from, DateTime to)
        {
            return this.getPercorso.Get(id, from, to);
        }
    }
}
