import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PosizioneMezzo } from '../posizione-mezzo/posizione-mezzo.model';
import * as moment from 'moment';
import { VoceFiltro } from "../filtri/voce-filtro.model";

//import { UiSwitchModule } from 'angular2-ui-switch';
import { UiSwitchModule } from 'ngx-ui-switch';

import {AccordionModule} from 'primeng/accordion';

@Component({
  selector: 'app-elenco-posizioni-flotta',
  templateUrl: './elenco-posizioni-flotta.component.html',
  styleUrls: ['./elenco-posizioni-flotta.component.css']
})
export class ElencoPosizioniFlottaComponent implements OnInit {

  @Input() elencoUltimePosizioni : PosizioneMezzo[] = [];
  @Input() istanteUltimoAggiornamento: Date;
  @Input() maxIstanteAcquisizione: Date ;
  
  private maxIstanteAcquisizionePrecedente: Date = new Date("01/01/1900 00:00:00");

  public elencoPosizioni : PosizioneMezzo[] = [];
 // public elencoPosizioniDaElaborare: PosizioneMezzo[] = [];
  public mezzoSelezionato: PosizioneMezzo;

  startLat: number = 41.889777;
  startLon: number = 12.490689;
  startZoom: number = 6;


  centerOnLast: boolean = true;

   titoloFiltroStatiMezzo: string = "Stati Mezzo";
   vociFiltroStatiMezzo: VoceFiltro[] = [
    new VoceFiltro(
      "1", "In viaggio verso l'intervento ", 0, true, "", "badge-info", 
      "assets/images/mm_20_red.png"
    ),
    new VoceFiltro(
      "2", "Arrivato sull'intervento", 0, true, "", "badge-info", 
      "assets/images/mm_20_blue.png"
    ),
    new VoceFiltro(
      "3", "In rientro dall'intervento", 0, true, "", "badge-info", 
      "assets/images/mm_20_green.png"
    ),
    new VoceFiltro(
      "4", "Mezzi rientrati dall'intervento", 0, false, "", "badge-info", "assets/images/mm_20_gray.png"
    ),
    new VoceFiltro(
      "5", "Fuori per motivi di Istituto", 0, false, "", "badge-info", "assets/images/mm_20_yellow.png"
    ),
    // posizione inviata da una radio non associata a nessun Mezzo
    new VoceFiltro(
      "6", "Posizioni Radio senza Mezzo", 0, false, "", "badge-info", "assets/images/mm_20_orange.png"
    ),
    // posizione inviata da un Mezzo fuori servizio  
    new VoceFiltro(
      "7", "Mezzi fuori servizio", 0, false, "","badge-info", "assets/images/mm_20_cyan.png"
    ),
    new VoceFiltro(
      "0", "Stato operativo Sconosciuto", 0, false, "", "badge-info", "assets/images/mm_20_black.png"
    )
    ];

    //vociFiltroStatiMezzoDefault: VoceFiltro[];  
    filtriStatiMezzo: string[] = [];

    titoloFiltroSedi: string = "Sedi";
    /*
      new VoceFiltro("FR", "LAZIO - Frosinone", 0, true, "", "badge-info", ""),
      new VoceFiltro("LT", "LAZIO - Latina", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI", "LAZIO - Rieti", 0, true, "", "badge-info", ""),
      new VoceFiltro("RM", "LAZIO - Roma", 0, true, "", "badge-info", ""),
      new VoceFiltro("VT", "LAZIO - Viterbo", 0, true, "", "badge-info", ""),
      new VoceFiltro("BA", "PUGLIA - Bari", 0, true, "", "badge-info", ""),
      new VoceFiltro("BR", "PUGLIA - Brindisi", 0, true, "", "badge-info", ""),
      new VoceFiltro("FG", "PUGLIA - Foggia", 0, true, "", "badge-info", ""),
      new VoceFiltro("LE", "PUGLIA - Lecce", 0, true, "", "badge-info", ""),
      new VoceFiltro("TA", "PUGLIA - Taranto", 0, true, "", "badge-info", "")
    */    
    
    vociFiltroSedi: VoceFiltro[] = [
      new VoceFiltro("CH", "ABRUZZO - Chieti", 0, true, "", "badge-info", ""),
      new VoceFiltro("AQ", "ABRUZZO - L'Aquila", 0, true, "", "badge-info", ""),
      new VoceFiltro("PE", "ABRUZZO - Pescara", 0, true, "", "badge-info", ""),
      new VoceFiltro("TE", "ABRUZZO - Teramo", 0, true, "", "badge-info", ""),
      new VoceFiltro("MT", "BASILICATA - Matera", 0, true, "", "badge-info", ""),
      new VoceFiltro("PZ", "BASILICATA - Potenza", 0, true, "", "badge-info", ""),
      new VoceFiltro("CZ", "CALABRIA - Catanzaro", 0, true, "", "badge-info", ""),
      new VoceFiltro("CS", "CALABRIA - Cosenza", 0, true, "", "badge-info", ""),
      new VoceFiltro("KR", "CALABRIA - Crotone", 0, true, "", "badge-info", ""),
      new VoceFiltro("RC", "CALABRIA - Reggio Calabria", 0, true, "", "badge-info", ""),
      new VoceFiltro("VV", "CALABRIA - Vibo valentia", 0, true, "", "badge-info", ""),
      new VoceFiltro("AV", "CAMPANIA - Avellino", 0, true, "", "badge-info", ""),
      new VoceFiltro("BN", "CAMPANIA - Benevento", 0, true, "", "badge-info", ""),
      new VoceFiltro("CE", "CAMPANIA - Caserta", 0, true, "", "badge-info", ""),
      new VoceFiltro("NA", "CAMPANIA - Napoli", 0, true, "", "badge-info", ""),
      new VoceFiltro("SA", "CAMPANIA - Salerno", 0, true, "", "badge-info", ""),
      new VoceFiltro("BO", "EMILIA-ROMAGNA - Bologna", 0, true, "", "badge-info", ""),
      new VoceFiltro("FE", "EMILIA-ROMAGNA - Ferrara", 0, true, "", "badge-info", ""),
      new VoceFiltro("FO", "EMILIA-ROMAGNA - Forli' Cesena", 0, true, "", "badge-info", ""),
      new VoceFiltro("MO", "EMILIA-ROMAGNA - Modena", 0, true, "", "badge-info", ""),
      new VoceFiltro("PR", "EMILIA-ROMAGNA - Parma", 0, true, "", "badge-info", ""),
      new VoceFiltro("PC", "EMILIA-ROMAGNA - Piacenza", 0, true, "", "badge-info", ""),
      new VoceFiltro("RA", "EMILIA-ROMAGNA - Ravenna", 0, true, "", "badge-info", ""),
      new VoceFiltro("RE", "EMILIA-ROMAGNA - Reggio Emilia", 0, true, "", "badge-info", ""),
      new VoceFiltro("RN", "EMILIA-ROMAGNA - Rimini", 0, true, "", "badge-info", ""),
      new VoceFiltro("GO", "FRIULI-VENEZIA GIULIA - Gorizia", 0, true, "", "badge-info", ""),
      new VoceFiltro("PN", "FRIULI-VENEZIA GIULIA - Pordenone", 0, true, "", "badge-info", ""),
      new VoceFiltro("TS", "FRIULI-VENEZIA GIULIA - Trieste", 0, true, "", "badge-info", ""),
      new VoceFiltro("UD", "FRIULI-VENEZIA GIULIA - Udine", 0, true, "", "badge-info", ""),
      new VoceFiltro("FR", "LAZIO - Frosinone", 0, true, "", "badge-info", ""),
      new VoceFiltro("LT", "LAZIO - Latina", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI", "LAZIO - Rieti", 0, true, "", "badge-info", ""),
      new VoceFiltro("RM", "LAZIO - Roma", 0, true, "", "badge-info", ""),
      new VoceFiltro("VT", "LAZIO - Viterbo", 0, true, "", "badge-info", ""),
      new VoceFiltro("GE", "LIGURIA - Genova", 0, true, "", "badge-info", ""),
      new VoceFiltro("IM", "LIGURIA - Imperia", 0, true, "", "badge-info", ""),
      new VoceFiltro("SP", "LIGURIA - La Spezia", 0, true, "", "badge-info", ""),
      new VoceFiltro("SV", "LIGURIA - Savona", 0, true, "", "badge-info", ""),
      new VoceFiltro("BG", "LOMBARDIA - Bergamo", 0, true, "", "badge-info", ""),
      new VoceFiltro("BS", "LOMBARDIA - Brescia", 0, true, "", "badge-info", ""),
      new VoceFiltro("CO", "LOMBARDIA - Como", 0, true, "", "badge-info", ""),
      new VoceFiltro("CR", "LOMBARDIA - Cremona", 0, true, "", "badge-info", ""),
      new VoceFiltro("LC", "LOMBARDIA - Lecco", 0, true, "", "badge-info", ""),
      new VoceFiltro("LO", "LOMBARDIA - Lodi", 0, true, "", "badge-info", ""),
      new VoceFiltro("MN", "LOMBARDIA - Mantova", 0, true, "", "badge-info", ""),
      new VoceFiltro("MI", "LOMBARDIA - Milano", 0, true, "", "badge-info", ""),
      new VoceFiltro("PV", "LOMBARDIA - Pavia", 0, true, "", "badge-info", ""),
      new VoceFiltro("SO", "LOMBARDIA - Sondrio", 0, true, "", "badge-info", ""),
      new VoceFiltro("VA", "LOMBARDIA - Varese", 0, true, "", "badge-info", ""),
      new VoceFiltro("AN", "MARCHE - Ancona", 0, true, "", "badge-info", ""),
      new VoceFiltro("AP", "MARCHE - Ascoli Piceno", 0, true, "", "badge-info", ""),
      new VoceFiltro("MC", "MARCHE - Macerata", 0, true, "", "badge-info", ""),
      new VoceFiltro("PS", "MARCHE - Pesaro e Urbino", 0, true, "", "badge-info", ""),
      new VoceFiltro("CB", "MOLISE - Campobasso", 0, true, "", "badge-info", ""),
      new VoceFiltro("IS", "MOLISE - Isernia", 0, true, "", "badge-info", ""),
      new VoceFiltro("AL", "PIEMONTE - Alessandria", 0, true, "", "badge-info", ""),
      new VoceFiltro("AT", "PIEMONTE - Asti", 0, true, "", "badge-info", ""),
      new VoceFiltro("BI", "PIEMONTE - Biella", 0, true, "", "badge-info", ""),
      new VoceFiltro("CN", "PIEMONTE - Cuneo", 0, true, "", "badge-info", ""),
      new VoceFiltro("NO", "PIEMONTE - Novara", 0, true, "", "badge-info", ""),
      new VoceFiltro("TO", "PIEMONTE - Torino", 0, true, "", "badge-info", ""),
      new VoceFiltro("VB", "PIEMONTE - Verbano Cusio Ossola", 0, true, "", "badge-info", ""),
      new VoceFiltro("VC", "PIEMONTE - Vercelli", 0, true, "", "badge-info", ""),
      new VoceFiltro("BA", "PUGLIA - Bari", 0, true, "", "badge-info", ""),
      new VoceFiltro("BR", "PUGLIA - Brindisi", 0, true, "", "badge-info", ""),
      new VoceFiltro("FG", "PUGLIA - Foggia", 0, true, "", "badge-info", ""),
      new VoceFiltro("LE", "PUGLIA - Lecce", 0, true, "", "badge-info", ""),
      new VoceFiltro("TA", "PUGLIA - Taranto", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA", "SARDEGNA - Cagliari", 0, true, "", "badge-info", ""),
      new VoceFiltro("NU", "SARDEGNA - Nuoro", 0, true, "", "badge-info", ""),
      new VoceFiltro("OR", "SARDEGNA - Oristano", 0, true, "", "badge-info", ""),
      new VoceFiltro("SS", "SARDEGNA - Sassari", 0, true, "", "badge-info", ""),
      new VoceFiltro("AG", "SICILIA - Agrigento", 0, true, "", "badge-info", ""),
      new VoceFiltro("CL", "SICILIA - Caltanissetta", 0, true, "", "badge-info", ""),
      new VoceFiltro("CT", "SICILIA - Catania", 0, true, "", "badge-info", ""),
      new VoceFiltro("EN", "SICILIA - Enna", 0, true, "", "badge-info", ""),
      new VoceFiltro("ME", "SICILIA - Messina", 0, true, "", "badge-info", ""),
      new VoceFiltro("PA", "SICILIA - Palermo", 0, true, "", "badge-info", ""),
      new VoceFiltro("RG", "SICILIA - Ragusa", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR", "SICILIA - Siracusa", 0, true, "", "badge-info", ""),
      new VoceFiltro("TP", "SICILIA - Trapani", 0, true, "", "badge-info", ""),
      new VoceFiltro("AR", "TOSCANA - Arezzo", 0, true, "", "badge-info", ""),
      new VoceFiltro("FI", "TOSCANA - Firenze", 0, true, "", "badge-info", ""),
      new VoceFiltro("GR", "TOSCANA - Grosseto", 0, true, "", "badge-info", ""),
      new VoceFiltro("LI", "TOSCANA - Livorno", 0, true, "", "badge-info", ""),
      new VoceFiltro("LU", "TOSCANA - Lucca", 0, true, "", "badge-info", ""),
      new VoceFiltro("MS", "TOSCANA - Massa Carrara", 0, true, "", "badge-info", ""),
      new VoceFiltro("PI", "TOSCANA - Pisa", 0, true, "", "badge-info", ""),
      new VoceFiltro("PT", "TOSCANA - Pistoia", 0, true, "", "badge-info", ""),
      new VoceFiltro("PO", "TOSCANA - Prato", 0, true, "", "badge-info", ""),
      new VoceFiltro("SI", "TOSCANA - Siena", 0, true, "", "badge-info", ""),
      new VoceFiltro("PG", "UMBRIA - Perugia", 0, true, "", "badge-info", ""),
      new VoceFiltro("TR", "UMBRIA - Terni", 0, true, "", "badge-info", ""),
      new VoceFiltro("BL", "VENETO - Belluno", 0, true, "", "badge-info", ""),
      new VoceFiltro("PD", "VENETO - Padova", 0, true, "", "badge-info", ""),
      new VoceFiltro("RO", "VENETO - Rovigo", 0, true, "", "badge-info", ""),
      new VoceFiltro("TV", "VENETO - Treviso", 0, true, "", "badge-info", ""),
      new VoceFiltro("VE", "VENETO - Venezia", 0, true, "", "badge-info", ""),
      new VoceFiltro("VR", "VENETO - Verona", 0, true, "", "badge-info", ""),
      new VoceFiltro("VI", "VENETO - Vicenza", 0, true, "", "badge-info", "")            
    ];
    filtriSedi: string[] = [];

  constructor() { }

  ngOnInit() {

    this.inizializzaFiltri();  
  }

  ngOnChanges(changes: any) {
  
    this.inizializzaFiltri();  
  }

  inizializzaFiltri() {

    if (this.elencoPosizioni.length == 0 ) 
      { this.elencoPosizioni = this.elencoUltimePosizioni; }
    else
      {

        // filtra solo le posizioni su cui sono disponibili le info di SO115
        this.elencoUltimePosizioni = this.elencoUltimePosizioni.filter(r => r.infoSO115 != null);

        // individua le posizioni non ancora elaborate
        var elencoPosizioniNuove: PosizioneMezzo[] = this.elencoUltimePosizioni.
          filter( (item) => {
            var v = this.elencoPosizioni.find( x => item.codiceMezzo == x.codiceMezzo );
            if ( v == null) {
              return item}
            else {return null}  }
          );
          
        // aggiunge le posizioni non ancora elaborate
        this.elencoPosizioni = this.elencoPosizioni.concat(elencoPosizioniNuove);

        // rimuove dalle posizioni da elaborare quelle Nuove
        elencoPosizioniNuove.forEach( v => { 
            var k = this.elencoUltimePosizioni.indexOf( v );
            if (k != -1) { this.elencoUltimePosizioni.splice(k,1); 
                  }
          });

        // modifica nelle posizioni Mostrate quelle con variazioni
        this.elencoUltimePosizioni.forEach( item => { 
          var v = this.elencoPosizioni.findIndex( x => item.codiceMezzo === x.codiceMezzo );
          if ( v != null) {  
            if (item.infoSO115.stato != "0")
              { this.elencoPosizioni[v] = item; }
            else
              { this.elencoPosizioni[v].fonte = item.fonte;
                this.elencoPosizioni[v].classiMezzo = item.classiMezzo;
                this.elencoPosizioni[v].istanteAcquisizione = item.istanteAcquisizione;
                this.elencoPosizioni[v].istanteArchiviazione = item.istanteArchiviazione;
                this.elencoPosizioni[v].istanteInvio = item.istanteInvio;
                this.elencoPosizioni[v].localizzazione = item.localizzazione;
              }
          }    
        } )

        // riordina l'array
        this.elencoPosizioni = this.elencoPosizioni.sort( 
          function(a,b) 
          { var bb : Date = new Date(b.istanteAcquisizione);
            var aa : Date  = new Date(a.istanteAcquisizione);
            return aa>bb ? -1 : aa<bb ? 1 : 0;
          });
      }
    /*
    var statiMezzo : string[] = [ "0", "1", "2", "3", "4", "5", "6"];

    this.vociFiltroStatiMezzo = Object.keys(statiMezzo).map(desc => new VoceFiltro(desc, desc, statiMezzo[desc]));
    */

    // elabora solo le posizioni su cui sono disponibili le info di SO115
    this.elencoPosizioni = this.elencoPosizioni.filter(r => r.infoSO115 != null);
    // elabora solo le posizioni su cui sono NON disponibili le info di SO115
    //this.elencoPosizioni = this.elencoPosizioni.filter(r => r.infoSO115 === null);
    
    this.vociFiltroStatiMezzo.find(v => v.codice === "0").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("0") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "1").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("1") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "2").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("2") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "3").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("3") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "4").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("4") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "5").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("5") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "6").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("6") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "7").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("7") === 0).length;

    /*
    // assegnna alle posizioni da elaborare quelle archiviate successivamente 
    //all'istante di elborazione precedente
    this.elencoPosizioniDaElaborare = this.elencoPosizioni.
      filter(r => (new Date(r.istanteAcquisizione) > this.maxIstanteAcquisizionePrecedente ) );
      //filter(r => (new Date(r.istanteAcquisizione) > this.maxIstanteAcquisizionePrecedente ) );
    */
    this.maxIstanteAcquisizionePrecedente = this.maxIstanteAcquisizione;

    /*
    l'ipotesi di creare un altro vettore aggiungendo la proprietà "visible" 
    per tutti gli elementi, e di impostarla in base allo stato dei filtri selezionato 
    (true/false) si è rivelata una soluzione molto lenta e quindi abbandonata

    //this.elencoPosizioniMezzoFiltrate = this.elencoPosizioni;


        import { PosizioneMezzo } from '../posizione-mezzo/posizione-mezzo.model';

        export class PosizioneMezzoFiltrata {
            constructor (
                public posizioneMezzo:PosizioneMezzo,       
                public visible:boolean
            ) {}
            
            }


    this.elencoPosizioniMezzoFiltrate = this.elencoPosizioni.map( 
      (posizioneMezzo) => 
        { return Object.assign({}, {posizioneMezzo, "visible": true }) });
    */
    
    if (this.vociFiltroStatiMezzo.length > 0) {
    /*
      l'ipotesi di creare un altro vettore con i soli elementi filtrari 
      è anch'essa troppo lenta su un elevato numero di elementi


      this.vociFiltroStatiMezzoDefault = this.vociFiltroStatiMezzo.
      filter( v => v.selezionato === true);

      this.elencoPosizioniMezzoFiltrate = this.elencoPosizioniMezzoFiltrate.
        filter(r => this.vociFiltroStatiMezzoDefault.
        some(filtro => filtro.codice.toString() === r.infoSO115.stato));
      
    */
    /*
      l'ipotesi di applicare un filtro sullo stesso vettore utilizzando 
      il metodo forEach() è anch'essa troppo lenta su un elevato numero di elementi

      this.elencoPosizioniMezzoFiltrate.forEach( pos => 
        pos.selezionata = this.vociFiltroStatiMezzoDefault.
        some(filtro => filtro.codice.toString() === pos.infoSO115.stato));
      //console.log(this.elencoPosizioniMezzoFiltrate);
      
     */

     // soluzione utilizzando una funzione valutata durante l'aggiornamento della view
      this.filtriStatiMezzo = this.vociFiltroStatiMezzo
      .filter(v => v.selezionato)
      .map(v => (v.codice).toString())
      ;

      this.filtriSedi = this.vociFiltroSedi
      .filter(v => v.selezionato)
      .map(v => (v.codice).toString())
      ;

      if (this.mezzoSelezionato == null || this.centerOnLast) {
        this.mezzoSelezionato = this.elencoPosizioni[0];
      }


    }

  }
  
  nuovaSelezioneStatiMezzo(event) {
    //console.log('event: ', event);
    this.filtriStatiMezzo = event;

  } 
  
  nuovaSelezioneSedi(event) {
    console.log('event: ', event);
    this.filtriSedi = event;

  }
  
  centraSuMappa(evento) {
    var tipoevento: string = evento[1];
    if (tipoevento == "click") {
      this.mezzoSelezionato = evento[0];
      this.startLat = Number(this.mezzoSelezionato.localizzazione.lat);
      this.startLon = Number(this.mezzoSelezionato.localizzazione.lon);
      this.startZoom = 12;
    }
    //console.log("centraSuMappa", this.mezzoSelezionato);
  }

  evidenziaSuMappa(evento) {
    var tipoevento: string = evento[1];
    if (tipoevento == "mouseover") {
      this.mezzoSelezionato = evento[0];
    }
    //console.log("centraSuMappa", this.mezzoSelezionato);
  }

}
