//-----------------------------------------------------------------------
// <copyright file="ClassiMezzoController.cs" company="CNVVF">
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

using System.Collections.Generic;
using System.Web.Http;
using Modello.Configurazione;
using Modello.Servizi.Persistence;

namespace VVFGeoFleet.Controllers
{
    public class ClassiMezzoController : ApiController
    {
        private readonly IGetClassiMezzo getClassiMezzo;
        private readonly IAppConfig appConfig;

        public ClassiMezzoController(IGetClassiMezzo getClassiMezzo, IAppConfig appConfig)
        {
            this.getClassiMezzo = getClassiMezzo;
            this.appConfig = appConfig;
        }

        /// <summary>
        ///   Restituisce l'elenco delle classi mezzo attive, con la relativa occorrenza
        /// </summary>
        /// <returns>Elenco delle classi mezzo attive</returns>
        public IEnumerable<object> Get()
        {
            var attSec = this.appConfig.OrizzonteTemporale_sec;

            return this.Get(attSec);
        }

        /// <summary>
        ///   Restituisce l'elenco delle classi mezzo attive, con la relativa occorrenza
        /// </summary>
        /// <param name="attSec">
        ///   I secondi entro cui deve essere stato inviato l'ultimo messaggio di posizione perché il
        ///   mezzo sia considerato attivo
        /// </param>
        /// <returns>Elenco delle classi mezzo attive</returns>
        public IEnumerable<object> Get(int attSec)
        {
            var resultDict = this.getClassiMezzo.Get(attSec);
            foreach (var key in resultDict.Keys)
                yield return new { classeMezzo = key, count = resultDict[key] };
        }
    }
}
