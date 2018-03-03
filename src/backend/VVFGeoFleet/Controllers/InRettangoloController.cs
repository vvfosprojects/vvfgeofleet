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
using Modello.Configurazione;
using Modello.Servizi.Persistence.GeoQuery.InRettangolo;

namespace VVFGeoFleet.Controllers
{
    public class InRettangoloController : ApiController
    {
        public readonly IGetMezziInRettangolo getMezziInRettangolo;
        private readonly IAppConfig appConfig;

        public InRettangoloController(IGetMezziInRettangolo getMezziInRettangolo, IAppConfig appConfig)
        {
            this.getMezziInRettangolo = getMezziInRettangolo;
            this.appConfig = appConfig;
        }

        /// <summary>
        ///   Restituisce i mezzi attivi entro un rettangolo dato.
        /// </summary>
        /// <param name="lat1">Latitudine del vertice superiore sinistro</param>
        /// <param name="lon1">Longitudine del vertice superiore sinistro</param>
        /// <param name="lat2">Latitudine del vertice inferiore sinistro</param>
        /// <param name="lon2">Longitudine del vertice inferiore sinistro</param>
        /// <param name="classiMezzo">Filtro sulle classi mezzo</param>
        /// <returns>I mezzi attivi nel rettangolo dato</returns>
        public QueryInRettangoloResult Get(
        double lat1,
        double lon1,
        double lat2,
        double lon2,
        [FromUri] string[] classiMezzo)
        {
            var attSec = this.appConfig.OrizzonteTemporale_sec;

            return this.Get(lat1, lon1, lat2, lon2, classiMezzo, attSec);
        }

        /// <summary>
        ///   Restituisce i mezzi attivi entro un rettangolo dato.
        /// </summary>
        /// <param name="lat1">Latitudine del vertice superiore sinistro</param>
        /// <param name="lon1">Longitudine del vertice superiore sinistro</param>
        /// <param name="lat2">Latitudine del vertice inferiore sinistro</param>
        /// <param name="lon2">Longitudine del vertice inferiore sinistro</param>
        /// <param name="classiMezzo">Filtro sulle classi mezzo</param>
        /// <param name="attSec">
        ///   I secondi entro cui deve essere stato inviato l'ultimo messaggio di posizione perché il
        ///   mezzo sia considerato attivo
        /// </param>
        /// <returns>I mezzi attivi nel rettangolo dato</returns>
        public QueryInRettangoloResult Get(
        double lat1,
        double lon1,
        double lat2,
        double lon2,
        [FromUri] string[] classiMezzo,
        int attSec)
        {
            var rettangolo = new Rettangolo();
            rettangolo.TopLeft.Lat = lat1;
            rettangolo.TopLeft.Lon = lon1;
            rettangolo.BottomRight.Lat = lat2;
            rettangolo.BottomRight.Lon = lon2;

            return this.getMezziInRettangolo.Get(rettangolo, classiMezzo, attSec);
        }
    }
}
