//-----------------------------------------------------------------------
// <copyright file="MessaggiPosizioneController.cs" company="CNVVF">
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
using Modello.Classi;
using Modello.Servizi.Persistence;
using System;
using System.Web.Http;

namespace VVFGeoFleet.Controllers
{
    public class MessaggiPosizioneController : ApiController
    {
        private readonly IMessaggioPosizioneRepository messaggioPosizioneRepository;

        public MessaggiPosizioneController(IMessaggioPosizioneRepository messaggioPosizioneRepository)
        {
            this.messaggioPosizioneRepository = messaggioPosizioneRepository;
        }

        /// <summary>
        ///   Restituisce un messaggio posizione per id
        /// </summary>
        /// <param name="id">L'id del messaggio</param>
        /// <returns>Il messaggio</returns>
        public MessaggioPosizione Get(string id)
        {
            return this.messaggioPosizioneRepository.GetById(id);
        }

        /// <summary>
        ///   Memorizza un nuovo messaggio posizione
        /// </summary>
        /// <param name="messaggio">Il messaggio</param>
        /// <returns>L'oggetto inserito con la sua location</returns>
        public IHttpActionResult Post([FromBody]MessaggioPosizione messaggio)
        {
            messaggio.IstanteArchiviazione = DateTime.Now;
            this.messaggioPosizioneRepository.Store(messaggio);

            return CreatedAtRoute("DefaultApi", new { id = messaggio.Id }, messaggio);
        }
    }
}
