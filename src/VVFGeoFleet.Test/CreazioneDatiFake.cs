using Bogus;
using NUnit.Framework;
using Persistence.MongoDB;
using Persistence.MongoDB.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VVFGeoFleet.Test
{
    [TestFixture]
    public class CreazioneDatiFake
    {
        [Test]
<<<<<<< HEAD
        [Ignore("Serve a riempire il database con dati fake")]
=======
>>>>>>> 5dd16291d7b50ea87e038ff3a523e317b91d0d19
        public void Popola_database_con_dati_fake()
        {
            var dbContext = new DbContext("mongodb://localhost:27017/vvfgeofleet");
            var fakerFonte = new Faker<Fonte_DTO>()
                .StrictMode(true)
                .RuleFor(l => l.CodiceFonte, f => f.Random.Replace("?##"))
                .RuleFor(l => l.ClasseFonte, f => f.Random.ArrayElement<string>(new[] { "C1", "C2", "C3" }));
            var fakerInfoSo115 = new Faker<InfoSO115_DTO>()
                .StrictMode(true)
                .RuleFor(i => i.Stato, f => f.Random.ArrayElement<string>(new[] { "InSede", "InViaggio", "SulPosto", "InRientro" }))
                .RuleFor(i => i.CodiceIntervento, f => f.Random.Replace("##???"))
                .RuleFor(i => i.DataIntervento, f => f.Date.Past());
            var faker = new Faker<MessaggioPosizione_DTO>()
                .StrictMode(true)
                .Ignore(m => m.Id)
                .RuleFor(m => m.CodiceMezzo, f => "M." + f.Random.Int(1000, 2000))
                .RuleFor(m => m.ClassiMezzo, f => new[] { f.Random.WeightedRandom(new[] { "APS", "AV", "AS" }, new[] { .3f, .5f, .05f }) })
                .RuleFor(m => m.Localizzazione, f => new Localizzazione_DTO(new Modello.Classi.Localizzazione() { Lat = f.Address.Latitude(), Lon = f.Address.Longitude() }))
                .RuleFor(m => m.IstanteAcquisizione, f => f.Date.Past())
                .RuleFor(m => m.Fonte, f => fakerFonte.Generate())
                .Ignore(m => m.InfoFonte)
                .RuleFor(m => m.InfoSO115, f => fakerInfoSo115.Generate())
                .RuleFor(m => m.IstanteArchiviazione, f => f.Date.Past());

<<<<<<< HEAD
            var messaggiPosizione = faker.Generate(10000);
=======
            var messaggiPosizione = faker.Generate(100000);
>>>>>>> 5dd16291d7b50ea87e038ff3a523e317b91d0d19
            dbContext.MessaggiPosizioneCollection.InsertMany(messaggiPosizione);
        }
    }
}
