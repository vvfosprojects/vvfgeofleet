using AutoMapper;
using Modello.Classi;
using Persistence.MongoDB.DTOs;

namespace Persistence.MongoDB
{
    internal static class AutomapperConfiguration
    {
        public static void Configure()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Modello.Classi.MessaggioPosizione, DTOs.MessaggioPosizione_DTO>()
                    .ForMember(dto => dto.Localizzazione, opt => opt.MapFrom(src => new Localizzazione_DTO(src.Localizzazione)));

                cfg.CreateMap<DTOs.MessaggioPosizione_DTO, Modello.Classi.MessaggioPosizione>()
                    .ForMember(dto => dto.Localizzazione, opt => opt.MapFrom(
                        src => new Localizzazione()
                        {
                            Lat = src.Localizzazione.Coordinates[0],
                            Lon = src.Localizzazione.Coordinates[1]
                        }));
            });

            Mapper.AssertConfigurationIsValid();
        }
    }
}
