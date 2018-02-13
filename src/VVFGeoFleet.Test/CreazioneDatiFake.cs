//-----------------------------------------------------------------------
// <copyright file="CreazioneDatiFake.cs" company="CNVVF">
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
using System.Linq;
using Bogus;
using Modello.Classi;
using NUnit.Framework;
using Persistence.MongoDB;

namespace VVFGeoFleet.Test
{
    [TestFixture]
    public class CreazioneDatiFake
    {
        [Test]
        //[Ignore("Serve a riempire il database con dati fake")]
        public void Popola_database_con_dati_fake()
        {
            var dbContext = new DbContext("mongodb://localhost:27017/vvfgeofleet");
            var fakerFonte = new Faker<Fonte>()
                .StrictMode(true)
                .RuleFor(l => l.CodiceFonte, f => f.Random.Replace("?##"))
                .RuleFor(l => l.ClasseFonte, f => f.Random.ArrayElement<string>(new[] { "C1", "C2", "C3" }));
            var fakerInfoSo115 = new Faker<InfoSO115>()
                .StrictMode(true)
                .RuleFor(i => i.Stato, f => f.Random.ArrayElement<string>(new[] { "InSede", "InViaggio", "SulPosto", "InRientro" }))
                .RuleFor(i => i.CodiceIntervento, f => f.Random.Replace("##???"))
                .RuleFor(i => i.DataIntervento, f => f.Date.Past());
            var faker = new Faker<MessaggioPosizione>()
                .StrictMode(true)
                .Ignore(m => m.Id)
                .RuleFor(m => m.CodiceMezzo, f => "M." + f.Random.Int(1000, 2000))
                .RuleFor(m => m.ClassiMezzo, f =>
                {
                    //prima categoria classe: tipo mezzo
                    var classiMezzo = new List<string> { f.Random.WeightedRandom(new[] { "APS", "AV", "AS" }, new[] { .3f, .5f, .05f }) };

                    //seconda categoria classe: alimentazione
                    classiMezzo.Add(f.Random.WeightedRandom(new[] { "benzina", "diesel", "GPL" }, new[] { .4f, .4f, .2f }));

                    //terza categoria classe: colore mezzo
                    classiMezzo.Add(f.Random.WeightedRandom(new[] { "giallo", "verde", "blu", "nero", "amaranto" }, new[] { .24f, .24f, .24f, .24f, .04f }));
                    if (f.Random.Bool(.1f))
                        classiMezzo.Add("metallizzato");

                    return classiMezzo.Distinct().ToArray();
                })
                .RuleFor(m => m.Localizzazione, f => new Localizzazione() { Lat = f.Address.Latitude(), Lon = f.Address.Longitude() })
                .RuleFor(m => m.IstanteAcquisizione, f => f.Date.Past())
                .RuleFor(m => m.Fonte, f => fakerFonte.Generate())
                .Ignore(m => m.InfoFonte)
                .RuleFor(m => m.InfoSO115, f => fakerInfoSo115.Generate())
                .RuleFor(m => m.IstanteArchiviazione, f => f.Date.Past());

            var messaggiPosizione = faker.Generate(100000);
            dbContext.MessaggiPosizioneCollection.InsertMany(messaggiPosizione);
        }
    }
}
