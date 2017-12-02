using Modello.Classi;

namespace Modello.Servizi.Persistence
{
    /// <summary>
    ///   Restituisce il messaggio posizione più aggiornato, o affidabile, per il mezzo avente codice specificato.
    /// </summary>
    public interface IGetPosizioneByCodiceMezzo
    {
        /// <summary>
        ///   Restituisce il messaggio posizione più aggiornato, o affidabile, per il mezzo avente
        ///   codice specificato.
        /// </summary>
        /// <param name="codiceMezzo">Il codice del mezzo</param>
        /// <returns>Il messaggio di posizione più aggiornato o affidabile.</returns>
        MessaggioPosizione Get(string codiceMezzo);
    }
}
