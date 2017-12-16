# VVFGeoFleet
Sistema per la localizzazione della flotta mezzi VVF

# Documentazione API

## POST /api/messaggiPosizione
Inserisce un nuovo messaggio di geo-localizzazione in archivio.

Esempio di payload.

```json
{
    "codiceMezzo": "APS.12345",
    "classiMezzo": [ "APS", "benzina" ],
    "localizzazione": {
        "lat": 14.2345,
        "lon": 43.4321
    },
    "istanteAcquisizione": "2017-11-27T10:12:00.1234Z",
    "fonte": {
        "codiceFonte": "AH222",
        "classeFonte": "gpsTracker"
    },
    "infoFonte": {
      
    }
}
```
Restituisce la location del messaggio inserito, ed il messaggio stesso.

## GET /api/messaggiPosizione/{id}
Restituisce il messaggio avente `id` specificato.

## GET /api/posizioneByCodiceMezzo/{codiceMezzo}
Restituisce la posizione per il mezzo avente `codiceMezzo` specificato.

## GET /api/posizioneFlotta
Restituisce la posizione dell'intera flotta.
Vengono restituite solo le posizioni dei mezzi aggiornate nelle ultime 24h.

## GET /api/posizioneFlotta/perClassi?classiMezzo={classe1}&classiMezzo={classe2}&classiMezzo={classe3}
Restituisce la posizione dell'intera flotta, limitatamente ai mezzi delle classi specificate come parametro d'ingresso.
Vengono restituite solo le posizioni dei mezzi aggiornate nelle ultime 24h.

## GET /api/prossimita?lat={lat}&lon={lon}&distanzaMaxMt={distMt}&classiMezzo={classe1}&classiMezzo={classe2}
Restituisce i mezzi in prossimità del punto specificato, entro un raggio massimo specificato. E' opzionalmente possibile specificare un array di classi mezzo con cui filtrare i risultati dell'interrogazione.

## GET /api/MezziSilenti?daSecondi={daSecondi}
Restituisce la posizione dei mezzi ai quali da troppo tempo non è associato alcun messaggio di posizione. Per es. se il parametro `daSecondi` vale 86400, viene restituita la posizione dei mezzi che non hanno aggiornamenti di posizione da almeno un giorno.

## GET /api/MezziSilenti?daSecondi={daSecondi}&classiMezzo={classe1}&classiMezzo={classe2}
Restituisce la posizione dei mezzi ai quali da troppo tempo non è associato alcun messaggio di posizione. La ricerca è limitata alle classi specificate.

# Descrizione dell'architettura
L'applicazione è sviluppata in linguaggio C# con Visual Studio 2017. L'architettura è una WebApi, basata su servizi REST, con uno strato di persistenza basato su MongoDB.

# Librerie utilizzate

- *MongoDB.Driver*: driver C# per l'integrazione con MongoDB;
- *SimpleInjector*: libreria per la Dependency Injection (DI);
- *AutoMapper*: libreria per il mapping convention based tra le classi di dominio e i DTO;
- *log4net*: libreria per il logging applicativo;
- *NUnit v3*: libreria per la stesura degli unit tests;
- *Moq*: libreria per la generazione di classi mock;
- *Bogus*: libreria per la generazione di istanze fake di classi.
