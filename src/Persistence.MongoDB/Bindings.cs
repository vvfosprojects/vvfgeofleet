//-----------------------------------------------------------------------
// <copyright file="Bindings.cs" company="CNVVF">
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
using SimpleInjector;
using SimpleInjector.Packaging;

namespace Persistence.MongoDB
{
    public class Bindings : IPackage
    {
        public void RegisterServices(Container container)
        {
            container.Register<DbContext>(() =>
            {
                return new DbContext(container.GetInstance<Modello.Configurazione.IAppConfig>().ConnectionString);
            }, Lifestyle.Singleton);

            container.Register<global::MongoDB.Driver.IMongoCollection<DTOs.MessaggioPosizione_DTO>>(() =>
            {
                return container.GetInstance<DbContext>().MessaggiPosizioneCollection;
            }, Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IMessaggioPosizioneRepository,
                Servizi.MessaggioPosizioneRepository_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IGetPosizioneByCodiceMezzo,
                Servizi.GetPosizioneByCodiceMezzo_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IGetPosizioneFlotta,
                Servizi.GetPosizioneFlotta_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.GeoQuery.Prossimita.IGetMezziInProssimita,
                Servizi.GetMezziInProssimita_DB>(Lifestyle.Scoped);
        }
    }
}
