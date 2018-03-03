//-----------------------------------------------------------------------
// <copyright file="ProssimitaController.cs" company="CNVVF">
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
using Modello.Classi;
using Modello.Configurazione;
using Modello.Servizi.Persistence.GeoQuery.Prossimita;

namespace VVFGeoFleet.Controllers
{
    public class ProssimitaController : ApiController
    {
        private readonly IGetMezziInProssimita getmezziInProssimita;
        private readonly IAppConfig appConfig;

        public ProssimitaController(IGetMezziInProssimita getmezziInProssimita, IAppConfig appConfig)
        {
            this.getmezziInProssimita = getmezziInProssimita;
            this.appConfig = appConfig;
        }

        /// <summary>
        ///   Restituisce i mezzi attivi presenti in prossimità di un punto dato ed una massima distanza.
        /// </summary>
        /// <param name="lat">La latitudine del punto</param>
        /// <param name="lon">La longitudine del punto</param>
        /// <param name="distanzaMaxMt">Filtro sulla massima distanza</param>
        /// <param name="classiMezzo">Filtro sulle classi mezzo</param>
        /// <returns>
        ///   L'elenco dei mezzi in prossimità, ordinato per distanza crescente dal punto.
        /// </returns>
        public QueryProssimitaResult Get(float lat, float lon, float distanzaMaxMt, [FromUri] string[] classiMezzo)
        {
            var attSec = this.appConfig.OrizzonteTemporale_sec;

            return this.Get(lat, lon, distanzaMaxMt, classiMezzo, attSec);
        }

        /// <summary>
        ///   Restituisce i mezzi attivi presenti in prossimità di un punto dato ed una massima distanza.
        /// </summary>
        /// <param name="lat">La latitudine del punto</param>
        /// <param name="lon">La longitudine del punto</param>
        /// <param name="distanzaMaxMt">Filtro sulla massima distanza</param>
        /// <param name="classiMezzo">Filtro sulle classi mezzo</param>
        /// <param name="attSec">
        ///   I secondi entro cui deve essere stato inviato l'ultimo messaggio di posizione perché il
        ///   mezzo sia considerato attivo
        /// </param>
        /// <returns>
        ///   L'elenco dei mezzi in prossimità, ordinato per distanza crescente dal punto.
        /// </returns>
        public QueryProssimitaResult Get(float lat, float lon, float distanzaMaxMt, [FromUri] string[] classiMezzo, int attSec)
        {
            return this.getmezziInProssimita.Get(new Localizzazione { Lat = lat, Lon = lon }, distanzaMaxMt, classiMezzo, attSec);
        }
    }
}
