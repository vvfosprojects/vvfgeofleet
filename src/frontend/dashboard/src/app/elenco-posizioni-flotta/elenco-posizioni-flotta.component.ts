import { Component, OnInit, Input } from '@angular/core';
import { PosizioneMezzo } from '../posizione-mezzo/posizione-mezzo.model';
import * as moment from 'moment';
import { VoceFiltro } from "../filtri/voce-filtro.model";

@Component({
  selector: 'app-elenco-posizioni-flotta',
  templateUrl: './elenco-posizioni-flotta.component.html',
  styleUrls: ['./elenco-posizioni-flotta.component.css']
})
export class ElencoPosizioniFlottaComponent implements OnInit {

  @Input() elencoPosizioni : PosizioneMezzo[];

  private elencoPosizioniMezzoFiltrate: PosizioneMezzo[] = [];
 
  private istanteUltimoAggiornamento: Date;
  
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
        "5", "Fuori per motivi di Istituto", 0, true
      ),
      // posizione inviata da una radio non associata a nessun Mezzo
      new VoceFiltro(
        "6", "Posizioni Radio senza Mezzo", 0, false
      ),
      new VoceFiltro(
        "7", "Ultima posizione Mezzi in Sede", 0, false
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
    this.istanteUltimoAggiornamento = moment().toDate();      
    this.elencoPosizioni = this.elencoPosizioni.filter(r => r.infoSO115 != null);

    this.elencoPosizioniMezzoFiltrate = this.elencoPosizioni;

    this.inizializzaFiltri();  
  }

  ngOnChanges(changes: any) {
    this.istanteUltimoAggiornamento = moment().toDate();      
    
    this.elencoPosizioni = this.elencoPosizioni.filter(r => r.infoSO115 != null);
    
    this.elencoPosizioniMezzoFiltrate = this.elencoPosizioni;
        
    this.inizializzaFiltri();  
  }

  inizializzaFiltri() {
    /*
    var statiMezzo : string[] = [ "0", "1", "2", "3", "4", "5", "6"];

    this.vociFiltroStatiMezzo = Object.keys(statiMezzo).map(desc => new VoceFiltro(desc, desc, statiMezzo[desc]));
    */
    

    /*
    //this.vociFiltroStatiMezzo.find(v => v.codice === "0").cardinalita = this.elencoPosizioni.filter(r => r.infoSO115 === null).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "1").cardinalita = this.elencoPosizioni.filter(r => r.infoSO115 != null && r.infoSO115.stato.localeCompare("1") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "2").cardinalita = this.elencoPosizioni.filter(r => r.infoSO115 != null && r.infoSO115.stato.localeCompare("2") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "3").cardinalita = this.elencoPosizioni.filter(r => r.infoSO115 != null && r.infoSO115.stato.localeCompare("3") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "5").cardinalita = this.elencoPosizioni.filter(r => r.infoSO115 != null && r.infoSO115.stato.localeCompare("5") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "6").cardinalita = this.elencoPosizioni.filter(r => r.infoSO115 != null && r.infoSO115.stato.localeCompare("6") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "7").cardinalita = this.elencoPosizioni.filter(r => r.infoSO115 != null && r.infoSO115.stato.localeCompare("7") === 0).length;
    */
    
    this.vociFiltroStatiMezzo.find(v => v.codice === "0").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("0") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "1").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("1") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "2").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("2") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "3").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("3") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "5").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("5") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "6").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("6") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "7").cardinalita = this.elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("7") === 0).length;
    

    this.elencoPosizioniMezzoFiltrate = this.elencoPosizioni;

    //this.elencoPosizioniMezzoFiltrate = this.elencoPosizioni.filter(r => r.infoSO115 === null);
    

    if (this.vociFiltroStatiMezzo.length > 0) {
      this.vociFiltroStatiMezzoDefault = this.vociFiltroStatiMezzo.filter( v => v.selezionato === true);

      //this.elencoPosizioniMezzoFiltrate = this.elencoPosizioniMezzoFiltrate.filter(r => this.filtriStatiMezzo.some(filtro => r.infoSO115 != null && filtro === r.infoSO115.stato));
      this.elencoPosizioniMezzoFiltrate = this.elencoPosizioniMezzoFiltrate.
      filter(r => this.vociFiltroStatiMezzoDefault.
        some(filtro => filtro.codice.toString() === r.infoSO115.stato));
    }
  }

  applicaNuovaSelezione() {
    this.elencoPosizioniMezzoFiltrate = this.elencoPosizioni;

    if (this.filtriStatiMezzo.length > 0) {
      //this.elencoPosizioniMezzoFiltrate = this.elencoPosizioniMezzoFiltrate.filter(r => this.filtriStatiMezzo.some(filtro => r.infoSO115 != null && filtro === r.infoSO115.stato));
      this.elencoPosizioniMezzoFiltrate = this.elencoPosizioniMezzoFiltrate.filter(r => this.filtriStatiMezzo.some(filtro => filtro === r.infoSO115.stato));
    }
  }
  
  nuovaSelezioneStatiMezzo(event) {
    this.filtriStatiMezzo = event;
    this.applicaNuovaSelezione();
  }


}
