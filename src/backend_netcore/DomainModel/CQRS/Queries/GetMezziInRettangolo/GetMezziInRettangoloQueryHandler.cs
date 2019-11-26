using CQRS.Queries;
using DomainModel.Services.Persistence;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetMezziInRettangolo
{
    public class GetMezziInRettangoloQueryHandler : IQueryHandler<GetMezziInRettangoloQuery, GetMezziInRettangoloQueryResult>
    {
        private readonly IGetMezziInRettangolo getMezziInRettangolo;
        public GetMezziInRettangoloQueryHandler(IGetMezziInRettangolo getMezziInRettangolo)
        {
            this.getMezziInRettangolo = getMezziInRettangolo;
        }

        public GetMezziInRettangoloQueryResult Handle(GetMezziInRettangoloQuery query)
        {
            return new GetMezziInRettangoloQueryResult()
            {
                Rettangolo = getMezziInRettangolo.Get(query).Rettangolo,
                ClassiMezzo = getMezziInRettangolo.Get(query).ClassiMezzo,
                DurataQuery_msec = getMezziInRettangolo.Get(query).DurataQuery_msec,
                IstanteQuery = getMezziInRettangolo.Get(query).IstanteQuery,
                NumeroMezzi = getMezziInRettangolo.Get(query).NumeroMezzi,
                Risultati = getMezziInRettangolo.Get(query).Risultati
            };
        }
    }
}
