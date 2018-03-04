//-----------------------------------------------------------------------
// <copyright file="GetPosizioneFlotta_DB.cs" company="CNVVF">
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
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class GetPosizioneFlotta_DB : IGetPosizioneFlotta
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizione;

        public GetPosizioneFlotta_DB(IMongoCollection<MessaggioPosizione> messaggiPosizione)
        {
            this.messaggiPosizione = messaggiPosizione;
        }

        public IEnumerable<MessaggioPosizione> Get(int attSec)
        {
            return this.Get(null, attSec);
        }

        /// <summary>
        ///   Restituisce la posizione dei mezzi attivi
        /// </summary>
        /// <param name="classiMezzo">Filtro sulle classi dei mezzi</param>
        /// <param name="attSec">
        ///   I secondi entro cui deve essere stato inviato l'ultimo messaggio di posizione perché il
        ///   mezzo sia considerato attivo
        /// </param>
        /// <returns>La posizione della flotta</returns>
        public IEnumerable<MessaggioPosizione> Get(string[] classiMezzo, int attSec)
        {
            var filter = Builders<MessaggioPosizione>.Filter
                .And(
                    Builders<MessaggioPosizione>.Filter.Eq(m => m.Ultimo, true),
                    Builders<MessaggioPosizione>.Filter.Gte(m => m.IstanteAcquisizione, DateTime.UtcNow.AddSeconds(-attSec))
                    );

            if (classiMezzo != null && classiMezzo.Length > 0)
            {
                var classFilter = Builders<MessaggioPosizione>
                    .Filter
                    .AnyIn(m => m.ClassiMezzo, classiMezzo);

                filter &= classFilter;
            }

            return this.messaggiPosizione.Find(filter)
                .SortBy(m => m.CodiceMezzo)
                .ToEnumerable();
        }
    }
}
