//-----------------------------------------------------------------------
// <copyright file="InRettangoloController.cs" company="CNVVF">
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
using System.Web.Http;
using Modello.Servizi.Persistence.GeoQuery.InRettangolo;

namespace VVFGeoFleet.Controllers
{
    public class InRettangoloController : ApiController
    {
        public readonly IGetMezziInRettangolo getMezziInRettangolo;

        public InRettangoloController(IGetMezziInRettangolo getMezziInRettangolo)
        {
            this.getMezziInRettangolo = getMezziInRettangolo;
        }

        public QueryInRettangoloResult Get(
        double lat1,
        double lon1,
        double lat2,
        double lon2,
        [FromUri] string[] classiMezzo)
        {
            var rettangolo = new Rettangolo();
            rettangolo.TopLeft.Lat = lat1;
            rettangolo.TopLeft.Lon = lon1;
            rettangolo.BottomRight.Lat = lat2;
            rettangolo.BottomRight.Lon = lon2;

            return this.getMezziInRettangolo.Get(rettangolo, classiMezzo);
        }
    }
}
