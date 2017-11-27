# VVFGeoFleet
Sistema per la localizzazione della flotta mezzi VVF

## POST /api/MessaggiPosizione
Inserisce un nuovo messaggio di geo-localizzazione in archivio.

Esempio di payload.

```json
{
    codiceMezzo: "APS.12345",
    classiMezzo: ["APS", "benzina", ],
    localizzazione: {
        lat: 14.2345,
        lon: 43.4321
    },
    istanteAcquisizione: "2017-11-27T10:12:00.1234Z",
    fonte: {
        codiceFonte: "AH222",
        classeFonte: "gpsTracker"
    },
    infoFonte: {
      
    }
}
```
Restituisce la location del messaggio inserito, ed il messaggio stesso.

## GET /api/MessaggiPosizione/{id}
Restituisce il messaggio di `id` specificato.

## GET /api/PosizioneByCodiceMezzo/{codiceMezzo}
Restituisce la posizione più aggiornata disponibile per il mezzo avente `codiceMezzo` specificato.
