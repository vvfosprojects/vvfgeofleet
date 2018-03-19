//-----------------------------------------------------------------------
// <copyright file="GetMezziSilenti_DB.cs" company="CNVVF">
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
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class GetMezziSilenti_DB : IGetMezziSilenti
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizione;

        public GetMezziSilenti_DB(IMongoCollection<MessaggioPosizione> messaggiPosizione)
        {
            this.messaggiPosizione = messaggiPosizione;
        }

        /// <summary>
        ///   Restituisce la posizione dei mezzi per i quali non c'è un messaggio sufficientemente recente
        /// </summary>
        /// <param name="daSecondi">Numero di secondi entro i quali non è presente un messaggio</param>
        /// <returns>Messaggi posizione meno recenti</returns>
        public IEnumerable<MessaggioPosizione> Get(int daSecondi)
        {
            return this.Get(daSecondi, classiMezzo: null);
        }

        /// <summary>
        ///   Restituisce la posizione dei mezzi per i quali non c'è un messaggio sufficientemente recente
        /// </summary>
        /// <param name="daSecondi">Numero di secondi entro i quali non è presente un messaggio</param>
        /// <param name="classiMezzo">Le classi mezzo da filtrare</param>
        /// <returns>Messaggi posizione meno recenti</returns>
        public IEnumerable<MessaggioPosizione> Get(int daSecondi, string[] classiMezzo)
        {
            var filter = Builders<MessaggioPosizione>.Filter
                .And(
                    Builders<MessaggioPosizione>.Filter.Eq(m => m.Ultimo, true),
                    Builders<MessaggioPosizione>.Filter.Lt(m => m.IstanteAcquisizione, DateTime.UtcNow.AddSeconds(-daSecondi))
                );

            if (classiMezzo != null && classiMezzo.Length > 0)
            {
                var classFilter = Builders<MessaggioPosizione>.Filter
                    .AnyIn(m => m.ClassiMezzo, classiMezzo);

                filter &= classFilter;
            }

            return this.messaggiPosizione.Find(filter)
                .SortBy(m => m.CodiceMezzo)
                .ToEnumerable();
        }
    }
}
