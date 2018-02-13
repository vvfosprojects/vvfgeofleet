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
using Modello.Servizi.Persistence;

namespace VVFGeoFleet.Controllers
{
    public class ClassiMezzoController : ApiController
    {
        private readonly IGetClassiMezzo getClassiMezzo;

        public ClassiMezzoController(IGetClassiMezzo getClassiMezzo)
        {
            this.getClassiMezzo = getClassiMezzo;
        }

        public IEnumerable<object> Get()
        {
            const int defaultMessageExpiration = 86400; //seconds in a day
            return this.Get(defaultMessageExpiration);
        }

        public IEnumerable<object> Get(int attiviEntroSecondi)
        {
            var resultDict = this.getClassiMezzo.Get(attiviEntroSecondi);
            foreach (var key in resultDict.Keys)
                yield return new { classeMezzo = key, count = resultDict[key] };
        }
    }
}
