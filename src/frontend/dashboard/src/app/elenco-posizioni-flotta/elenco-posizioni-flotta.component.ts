import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PosizioneMezzo } from '../posizione-mezzo/posizione-mezzo.model';

import * as moment from 'moment';
import { VoceFiltro } from "../filtri/voce-filtro.model";


@Component({
  selector: 'app-elenco-posizioni-flotta',
  templateUrl: './elenco-posizioni-flotta.component.html',
  styleUrls: ['./elenco-posizioni-flotta.component.css']
})
export class ElencoPosizioniFlottaComponent implements OnInit {

  @Input() elencoPosizioni : PosizioneMezzo[] = [];


  //private elencoPosizioniMezzoFiltrate: PosizioneMezzo[] = [];
  private elencoPosizioniDaElaborare: PosizioneMezzo[] = [];
 
  private istanteUltimoAggiornamento: Date;
  private maxIstanteAcquisizionePrecedente: Date = new Date("01/01/1900 00:00:00");

  
  vociFiltroStatiMezzo: VoceFiltro[] = [
      new VoceFiltro(
        "1", "In viaggio verso l'intervento ", 0, true
      ),
      new VoceFiltro(
        "2", "Arrivato sull'intervento", 0, true
      ),
      new VoceFiltro(
        "3", "In rientro dall'intervento", 0, true
      ),
      new VoceFiltro(
        "4", "Mezzi rientrati dall'intervento", 0, false
      ),
      new VoceFiltro(
        "5", "Fuori per motivi di Istituto", 0, true
      ),
      // posizione inviata da una radio non associata a nessun Mezzo
      new VoceFiltro(
        "6", "Posizioni Radio senza Mezzo", 0, false
      ),
      // posizione inviata da un Mezzo prima dell'attivazione di GeoFleet,
      // di cui non è rilevabile lo stato
      new VoceFiltro(
        "7", "Ultima posizione storica Mezzi", 0, false
      ),
      new VoceFiltro(
        "0", "Stato operativo Sconosciuto", 0, false
      )
    ];

    vociFiltroStatiMezzoDefault: VoceFiltro[];
  
    titoloFiltroStatiMezzo: string = "Stati Mezzo";
    filtriStatiMezzo: string[] = [];
    
  constructor() { }

  ngOnInit() {

    this.inizializzaFiltri();  
  }

  ngOnChanges(changes: any) {
  
    this.inizializzaFiltri();  
  }

  inizializzaFiltri() {


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

     // elabora solo le posizioni arrivate nell'ultimo arco temporale
    this.elencoPosizioniDaElaborare = this.elencoPosizioni.
      filter(r => (new Date(r.istanteAcquisizione) > this.maxIstanteAcquisizionePrecedente ) );

    this.istanteUltimoAggiornamento = moment().toDate();      

    if (this.elencoPosizioniDaElaborare.length > 0) {
      this.maxIstanteAcquisizionePrecedente = new Date(this.elencoPosizioni.
        reduce( function (a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? a : b ;
        }).istanteAcquisizione);
    }      
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


    }
        


  }

  
  nuovaSelezioneStatiMezzo(event) {

    //console.log('event: ' + event);
    this.filtriStatiMezzo = event;


  }
  




}
