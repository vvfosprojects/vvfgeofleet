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

            container.Register<global::MongoDB.Driver.IMongoCollection<Modello.Classi.MessaggioPosizione>>(() =>
            {
                return container.GetInstance<DbContext>().MessaggiPosizioneCollection;
            }, Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IGetMessaggioPosizioneById,
                Servizi.GetMessaggioPosizioneById_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IStoreMessaggioPosizione,
                Servizi.StoreMessaggioPosizione_DB>(Lifestyle.Scoped);

            container.RegisterDecorator(
                typeof(Modello.Servizi.Persistence.IStoreMessaggioPosizione),
                typeof(Servizi.StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator),
                context => container.GetInstance<Modello.Configurazione.IAppConfig>().InterpolationActive
            );

            container.RegisterInitializer<Servizi.StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator>(sender =>
            {
                sender.InterpolationThreshold_mt = container.GetInstance<Modello.Configurazione.IAppConfig>().InterpolationThreshold_mt;
            });

            container.RegisterDecorator(
                typeof(Modello.Servizi.Persistence.IStoreMessaggioPosizione),
                typeof(Servizi.StoreMessaggioPosizione_LogTooHighVelocities_Decorator),
                context => container.GetInstance<Modello.Configurazione.IAppConfig>().TooHighVelocityLoggingActive
            );

            container.RegisterInitializer<Servizi.StoreMessaggioPosizione_LogTooHighVelocities_Decorator>(sender =>
            {
                sender.VelocityThreshold_Kmh = container.GetInstance<Modello.Configurazione.IAppConfig>().VelocityThreshold_Kmh;
            });

            container.Register<Modello.Servizi.Persistence.IGetPosizioneByCodiceMezzo,
                Servizi.GetPosizioneByCodiceMezzo_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IGetPosizioneFlotta,
                Servizi.GetPosizioneFlotta_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.GeoQuery.Prossimita.IGetMezziInProssimita,
                Servizi.GetMezziInProssimita_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IGetMezziSilenti,
                Servizi.GetMezziSilenti_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.GeoQuery.InRettangolo.IGetMezziInRettangolo,
                Servizi.GetMezziInRettangolo_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IGetClassiMezzo,
                Servizi.GetClassiMezzo_DB>(Lifestyle.Scoped);

            container.Register<Modello.Servizi.Persistence.IGetPercorso,
                Servizi.GetPercorso_DB>(Lifestyle.Scoped);
        }
    }
}
