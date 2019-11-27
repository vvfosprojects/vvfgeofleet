using CQRS.Queries;
using DomainModel.Services.Persistence.GeoQuery;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetMezziInProssimita
{
    public class GetMezziInProssimitaQueryHandler : IQueryHandler<GetMezziInProssimitaQuery, GetMezziInProssimitaQueryResult>
    {
        private readonly IGetMezziInProssimità getMezziInProssimità;
        public GetMezziInProssimitaQueryHandler(IGetMezziInProssimità getMezziInProssimità)
        {
            this.getMezziInProssimità = getMezziInProssimità;
        }

        public GetMezziInProssimitaQueryResult Handle(GetMezziInProssimitaQuery query)
        {
            return new GetMezziInProssimitaQueryResult()
            { 
                Rettangolo = getMezziInProssimità.Get(query).Rettangolo,
                ClassiMezzo = getMezziInProssimità.Get(query).ClassiMezzo,
                DurataQuery_msec = getMezziInProssimità.Get(query).DurataQuery_msec,
                IstanteQuery = getMezziInProssimità.Get(query).IstanteQuery,
                NumeroMezzi = getMezziInProssimità.Get(query).NumeroMezzi,
                Risultati = getMezziInProssimità.Get(query).Risultati
            };
        }
    }
}
