//-----------------------------------------------------------------------
// <copyright file="GetMezziInRettangolo_DB.cs" company="CNVVF">
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
using System.Diagnostics;
using System.Linq;
using Modello.Classi;
using Modello.Servizi.Persistence.GeoQuery.InRettangolo;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class GetMezziInRettangolo_DB : IGetMezziInRettangolo
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetMezziInRettangolo_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public QueryInRettangoloResult Get(Rettangolo rettangolo, string[] classiMezzo, int attSec)
        {
            var geoWithinFilter = Builders<MessaggioPosizione>.Filter
                .GeoWithinBox(
                    field: m => m.Localizzazione,
                    lowerLeftX: rettangolo.TopLeft.Lon,
                    lowerLeftY: rettangolo.BottomRight.Lat,
                    upperRightX: rettangolo.BottomRight.Lon,
                    upperRightY: rettangolo.TopLeft.Lat);

            var lastMessageFilter = Builders<MessaggioPosizione>.Filter
                .Eq(m => m.Ultimo, true);

            var recentMessagesFilter = Builders<MessaggioPosizione>.Filter
                .Gte(m => m.IstanteAcquisizione, DateTime.UtcNow.AddSeconds(-attSec));

            var filter = geoWithinFilter & lastMessageFilter & recentMessagesFilter;

            if ((classiMezzo != null) && (classiMezzo.Length > 0))
            {
                var classFilter = Builders<MessaggioPosizione>.Filter
                    .AnyIn(m => m.ClassiMezzo, classiMezzo);

                filter &= classFilter;
            }

            var sw = new Stopwatch();
            sw.Start();

            var messaggiPosizione = this.messaggiPosizioneCollection.Find(filter)
                .SortBy(m => m.CodiceMezzo)
                .ToEnumerable()
                .ToArray();

            sw.Stop();

            return new QueryInRettangoloResult()
            {
                IstanteQuery = DateTime.UtcNow,
                DurataQuery_msec = sw.ElapsedMilliseconds,
                ClassiMezzo = classiMezzo,
                NumeroMezzi = messaggiPosizione.Length,
                Rettangolo = rettangolo,
                Risultati = messaggiPosizione
            };
        }
    }
}
