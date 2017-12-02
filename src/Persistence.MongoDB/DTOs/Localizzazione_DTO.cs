using Modello.Classi;

namespace Persistence.MongoDB.DTOs
{
    internal class Localizzazione_DTO
    {
        public Localizzazione_DTO(Localizzazione localizzazione)
        {
            this.Coordinates = new[] { localizzazione.Lat, localizzazione.Lon };
        }

        public string Type { get { return "Point"; } protected set { } }
        public double[] Coordinates { get; protected set; }
    }
}
