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

## GET /api/posizioneFlotta?attSec={secondi}
Restituisce la posizione dell'intera flotta.
Vengono restituite solo le posizioni dei mezzi aggiornate negli ultimi `attSec` secondi (opzionale - default nel web.config).

## GET /api/posizioneFlotta/perClassi?classiMezzo={classe1}&classiMezzo={classe2}&classiMezzo={classe3}&attSec={secondi}
Restituisce la posizione dell'intera flotta, limitatamente ai mezzi delle classi specificate come parametro d'ingresso.
Vengono restituite solo le posizioni dei mezzi aggiornate negli ultimi `attSec` secondi (opzionale - default nel web.config).

## GET /api/prossimita?lat={lat}&lon={lon}&distanzaMaxMt={distMt}&classiMezzo={classe1}&classiMezzo={classe2}&attSec={secondi}
Restituisce i mezzi in prossimità del punto specificato, entro un raggio massimo specificato. E' opzionalmente possibile specificare un array di classi mezzo con cui filtrare i risultati dell'interrogazione.
Vengono restituite solo le posizioni dei mezzi aggiornate negli ultimi `attSec` secondi (opzionale - default nel web.config).

Il risultato è nella forma

```json
{
	"istanteQuery": "2018-03-04T20:29:03.686917Z",
	"punto": {
		"type": "Point",
		"lat": -44.630001068115234,
		"lon": 3.4300000667572021
	},
	"distanzaMaxMt": 300000.0,
	"numeroMezzi": 2,
	"durataQuery_msec": 5,
	"risultati": [{
			"messaggioPosizione": {
				"id": "5a9c24f74eb6d93300a3e2a0",
				"codiceMezzo": "M.1101",
				"classiMezzo": ["AV", "diesel", "nero", "metallizzato"],
				"localizzazione": {
					"type": "Point",
					"lat": -44.7388,
					"lon": 3.2939
				},
				"istanteAcquisizione": "2018-03-04T01:23:46.336Z",
				"fonte": {
					"codiceFonte": "J55",
					"classeFonte": "C2"
				},
				"infoFonte": null,
				"infoSO115": {
					"stato": "InViaggio",
					"codiceIntervento": "11KXS",
					"dataIntervento": "2017-10-24T11:33:16.974Z"
				},
				"istanteArchiviazione": "2018-03-04T16:55:19.424Z",
				"ultimo": true
			},
			"distanzaMt": 16208.5889
		}, {
			"messaggioPosizione": {
				"id": "5a9c24ff4eb6d93300a3e822",
				"codiceMezzo": "M.1236",
				"classiMezzo": ["AV", "diesel", "amaranto"],
				"localizzazione": {
					"type": "Point",
					"lat": -47.0248,
					"lon": 1.6938
				},
				"istanteAcquisizione": "2018-03-04T14:12:18.937Z",
				"fonte": {
					"codiceFonte": "A09",
					"classeFonte": "C1"
				},
				"infoFonte": null,
				"infoSO115": {
					"stato": "SulPosto",
					"codiceIntervento": "79WDW",
					"dataIntervento": "2017-07-27T21:44:36.896Z"
				},
				"istanteArchiviazione": "2018-03-04T16:55:27.099Z",
				"ultimo": true
			},
			"distanzaMt": 298653.844
		}
	]
}
```

## GET /api/inRettangolo?lat1={lat1}&lon1={lon1}&lat2={lat2}&lon2={lon2}&classiMezzo={classe1}&classiMezzo={classe2}&attSec={secondi}
Restituisce i mezzi all'interno del box specificato. E' opzionalmente possibile specificare un array di classi mezzo con cui filtrare i risultati dell'interrogazione.
Vengono restituite solo le posizioni dei mezzi aggiornate negli ultimi `attSec` secondi (opzionale - default nel web.config).

## GET /api/MezziSilenti?daSecondi={daSecondi}
Restituisce la posizione dei mezzi ai quali da troppo tempo non è associato alcun messaggio di posizione. Per es. se il parametro `daSecondi` vale 86400, viene restituita la posizione dei mezzi che non hanno aggiornamenti di posizione da almeno un giorno.

## GET /api/MezziSilenti?daSecondi={daSecondi}&classiMezzo={classe1}&classiMezzo={classe2}
Restituisce la posizione dei mezzi ai quali da troppo tempo non è associato alcun messaggio di posizione. La ricerca è limitata alle classi specificate.

## GET /api/classiMezzo?attSec={secondi}
Restituisce la lista di tutti i valori classiMezzo relativi a messaggi posizione giunti negli ultimi `attSec` specificati (opzionale - default nel web.config), con la relativa occorrenza, in ordine decrescente di occorrenza. I risultati sono restituiti nella seguente forma:

```json
[
  {
    "class": "AV",
    "count": 517
  },
  {
    "class": "APS",
    "count": 322
  }
  ...
]
```

# Descrizione dell'architettura
L'applicazione è sviluppata in linguaggio C# con Visual Studio 2017 Community Edition. L'architettura è una WebApi, basata su servizi REST, con uno strato di persistenza basato su MongoDB.

# Librerie utilizzate

- *MongoDB.Driver*: driver C# per l'integrazione con MongoDB;
- *SimpleInjector*: libreria per la Dependency Injection (DI);
- *log4net*: libreria per il logging applicativo;
- *NUnit v3*: libreria per la stesura degli unit tests;
- *Moq*: libreria per la generazione di classi mock;
- *Bogus*: libreria per la generazione di istanze fake di classi.

# Licenza
Il codice sorgente è rilasciato nei termini della licenza AGPL-3.0.
