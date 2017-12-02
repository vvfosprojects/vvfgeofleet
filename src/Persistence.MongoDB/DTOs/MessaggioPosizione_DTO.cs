using AutoMapper;
using Modello.Classi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.MongoDB.DTOs
{
    internal class MessaggioPosizione_DTO
    {
        public string Id { get; internal set; }

        public string CodiceMezzo { get; set; }
        public string[] ClassiMezzo { get; set; }
        public Localizzazione_DTO Localizzazione { get; set; }
        public DateTime IstanteAcquisizione { get; set; }
        public Fonte_DTO Fonte { get; set; }
        public InfoFonte_DTO InfoFonte { get; set; }
        public InfoSO115_DTO InfoSO115 { get; set; }

        public DateTime IstanteArchiviazione { get; set; }

        public static MessaggioPosizione_DTO CreateFromDomain(MessaggioPosizione messaggioPosizione)
        {
            return Mapper.Map<MessaggioPosizione_DTO>(messaggioPosizione);
        }

        public MessaggioPosizione ConvertToDomain()
        {
            return Mapper.Map<MessaggioPosizione>(this);
        }
    }
}
