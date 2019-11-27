

using DomainModel.CQRS.Queries.GetMezziInProssimita;

namespace DomainModel.Services.Persistence.GeoQuery
{
    public interface IGetMezziInProssimità
    {
        GetMezziInProssimitaQueryResult Get(GetMezziInProssimitaQuery query);
    }
}
