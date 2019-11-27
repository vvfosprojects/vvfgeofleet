using DomainModel.CQRS.Queries.GetMezziInRettangolo;

namespace DomainModel.Services.Persistence
{
    public interface IGetMezziInRettangolo
    {
        GetMezziInRettangoloQueryResult Get(GetMezziInRettangoloQuery query);
    }
}
