import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Opzioni } from '../shared/model/opzioni.model';
import { Subscription } from 'rxjs';

import { VoceFiltro } from "../filtri/voce-filtro.model";

import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { Mezzo } from '../shared/model/mezzo.model';

import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';
import { FlottaDispatcherService } from '../service-dispatcher/flotta-dispatcher.service';

import * as moment from 'moment';
import { isNgTemplate } from '@angular/compiler';


@Component({
  selector: 'app-pannello-opzioni',
  templateUrl: './pannello-opzioni.component.html',
  styleUrls: ['./pannello-opzioni.component.css']
})

//export class PannelloOpzioniComponent implements OnInit, OnChanges {
export class PannelloOpzioniComponent  {

  public opzioni: Opzioni;

  //@Input() elencoMezzi: PosizioneMezzo[] = [];
  //@Input() seguiMezziSelezionati: PosizioneMezzo[] = [];
  @Output() selezioneMezzi: EventEmitter<Object[]> = new EventEmitter();

  //private elencoMezzi: PosizioneMezzo[] = [];
  private elencoMezzi: Mezzo[] = [];

  //private elencoPosizioni: PosizioneMezzo[] = [];
  private elencoMezziSelezionati: Mezzo[] = [];

  public titoloFiltroMezziSelezionati: string = "Mezzi selezionati";
  public vociFiltroMezziSelezionati: VoceFiltro[] = [];
  
  subscription = new Subscription();
     
  constructor(
    private gestioneOpzioniService: GestioneOpzioniService,
    private flottaDispatcherService: FlottaDispatcherService
  ) { 
      this.opzioni = new Opzioni();

      this.subscription.add(
        this.gestioneOpzioniService.getOpzioni()
        .subscribe( opt => { this.opzioni.set(opt); 
          //console.log("this.opzioni",this.opzioni);
        })
      );   

      /*
      this.subscription.add(
        this.flottaDispatcherService.getMezziSelezionati()
        .subscribe( elenco => { this.elencoMezziSelezionati = 
          JSON.parse(JSON.stringify(elenco));
          this.aggiornaMezziSelezionati(elenco);

        //console.log(moment().toDate(), "PannelloOpzioniComponent.getMezziSelezionati() - this.elencoPosizioni",  this.elencoPosizioni);
        
        })
      );   
      */

      this.subscription.add(
        this.flottaDispatcherService.getNuovoMezzoSelezionato()
        .subscribe( mezzo => { 
          this.aggiornaSelezioneMezzo(mezzo, true); 
  
        //console.log(moment().toDate(), "PannelloOpzioniComponent.getNuovoMezzoSelezionato() - mezzo",  mezzo);
        
        })
      );   

      this.subscription.add(
        this.flottaDispatcherService.getRimuoviMezzoSelezionato()
        .subscribe( mezzo => { 
          this.aggiornaSelezioneMezzo(mezzo, false); 

        //console.log(moment().toDate(), "PannelloOpzioniComponent.getNuovoMezzoSelezionato() - mezzo",  mezzo);
        
        })
      );   

      this.subscription.add(
        this.flottaDispatcherService.getNuoviMezzi()
        .subscribe( elenco => {
            //(posizioni.length > 0)?console.log(moment().toDate(),"ElencoPosizioniFlottaComponent, getNuovePosizioniFlotta - posizioni:", posizioni):null;
            this.aggiornaElencoMezzi(elenco);
          })
        );   
        
    }

  aggiornaSelezioneMezzo(mezzo: Mezzo, selezione: boolean) {

    var v = this.vociFiltroMezziSelezionati.findIndex( ii => 
      ii.codice.toString() === mezzo.codiceMezzo);
    //console.log(moment().toDate(),'PannelloOpzioniComponent.aggiornaMezziSelezionati(): item, v', item, v);
    if (v != -1) {
      console.log(moment().toDate(),'PannelloOpzioniComponent.aggiornaSelezioneMezzo() - modifica: item, v, this.vociFiltroMezziSelezionati[v]',mezzo,selezione,v,this.vociFiltroMezziSelezionati[v]);
      this.vociFiltroMezziSelezionati[v].selezionato = selezione;
    }
    else
    {
      console.log(moment().toDate(),'PannelloOpzioniComponent.aggiornaSelezioneMezzo() - aggiungi: item, v, this.vociFiltroMezziSelezionati[v]',mezzo,selezione,v,this.vociFiltroMezziSelezionati[v]);
      var voceFiltro = new VoceFiltro( mezzo.codiceMezzo, mezzo.descrizione, 0, 
        selezione, "", "badge-info", "");
      this.vociFiltroMezziSelezionati = this.vociFiltroMezziSelezionati.concat(voceFiltro);        
    }
  }

  /*
  aggiornaMezziSelezionati(mezzi: Mezzo[]) {
    //console.log(moment().toDate(),'PannelloOpzioniComponent.aggiornaMezziSelezionati() - mezzi, this.vociFiltroMezziSelezionati',mezzi, this.vociFiltroMezziSelezionati);
    var ele = this.vociFiltroMezziSelezionati.filter( item => item.selezionato === true);
    ele.forEach( ii => { 
        var k = this.vociFiltroMezziSelezionati.findIndex(item => item.codice.toString() === ii.codice.toString());
        this.vociFiltroMezziSelezionati[k].selezionato = false;
        }
      );

    mezzi.forEach( item => {
        var v = this.vociFiltroMezziSelezionati.findIndex( ii => 
          ii.codice.toString() === item.codiceMezzo.toString());
          //console.log(moment().toDate(),'PannelloOpzioniComponent.aggiornaMezziSelezionati(): item, v', item, v);
          if (v != -1) {
            //console.log(moment().toDate(),'aggiornaMezziSelezionati() - modifica: item, v, this.vociFiltroMezziSelezionati[v]',item,v,this.vociFiltroMezziSelezionati[v]);
            this.vociFiltroMezziSelezionati[v].selezionato = true;
          }
          else
          {
            //console.log(moment().toDate(),'aggiornaMezziSelezionati() - aggiunge: item, v, this.vociFiltroMezziSelezionati[v]',item,v,this.vociFiltroMezziSelezionati[v]);
            var voceFiltro = new VoceFiltro( item.codiceMezzo, item.descrizione, 0, 
              true, "", "badge-info", "");
            this.vociFiltroMezziSelezionati = this.vociFiltroMezziSelezionati.concat(voceFiltro);        
          }
        }
      );
  }
  */

  aggiornaElencoMezzi(mezzi: Mezzo[]) {

    this.elencoMezzi = this.elencoMezzi.concat( mezzi );
    /*
    this.vociFiltroMezziSelezionati = [];
    this.vociFiltroMezziSelezionati = this.elencoMezzi.map( 
      item => {
        var selezionato: boolean = this.elencoMezzi.find( 
          itemSelezionato => item.codiceMezzo === itemSelezionato.codiceMezzo )?true:false;

        var voceFiltro = new VoceFiltro( item.codiceMezzo, item.descrizione, 0, 
          selezionato, "", "badge-info", "");
        return voceFiltro;              
      });
    */

    var nuoveVoci = mezzi.map( item => {
      var voceFiltro = new VoceFiltro( item.codiceMezzo, item.descrizione, 0, 
        false, "", "badge-info", "");
      return voceFiltro;              
    
    });

    //console.log(moment().toDate(),'aggiornaElencoMezzi() - mezzi, nuoveVoci',mezzi, nuoveVoci);
    this.vociFiltroMezziSelezionati = this.vociFiltroMezziSelezionati.concat(nuoveVoci);
    
    // riordina l'array vociFiltroMezziSelezionati per Descrizione ascendente
    this.vociFiltroMezziSelezionati = this.vociFiltroMezziSelezionati.sort( 
      function(a,b) 
      { return a.descrizione>b.descrizione ? 1 : a.descrizione<b.descrizione ? -1 : 0;
      });
    
    
    //console.log("PannelloOpzioniComponent.aggiornaElencoMezzi(), elencoPosizioni, vociFiltroMezziSelezionati (solo selezionati)", this.elencoPosizioni, this.vociFiltroMezziSelezionati.filter( item => item.selezionato));

  }
  //changeOptOnlyMap(e) {
  changeOptOnlyMap() {
    //console.log('changeOptOnlyMap - prima',this.opzioni);
    //if (!this.opzioni.getOnlyMap()) && e != '-') 
    if (!this.opzioni.getOnlyMap()) 
      {this.gestioneOpzioniService.setOnlyMap(true);}
    else
      {this.gestioneOpzioniService.setOnlyMap(false);}
    //console.log('changeOptOnlyMap - dopo',this.opzioni);
  }

  changeOptOnlySelected() {
    if (!this.opzioni.getOnlySelected()) 
      {this.gestioneOpzioniService.setOnlySelected(true);}
    else
      {this.gestioneOpzioniService.setOnlySelected(false);}
  }

  changeCenterOnLast() {
    if (!this.opzioni.getCenterOnLast()) 
      this.gestioneOpzioniService.setCenterOnLast(true)
    else 
      this.gestioneOpzioniService.setCenterOnLast(false)    
  }  

  changeCenterOnSelected() {
    if (!this.opzioni.getCenterOnSelected()) 
      this.gestioneOpzioniService.setCenterOnSelected(true)
    else 
      this.gestioneOpzioniService.setCenterOnSelected(false)    
  } 

  nuovaSelezioneMezziSelezionati(event) {
    //console.log('event: ', event);
    this.selezioneMezzi.emit(event);
  } 

  fineSelezioneGgMaxPos(e) {    
    //this.nuovaSelezioneGgMaxPos.emit(this.ggMaxPos);
    this.gestioneOpzioniService.setGgMaxPos(this.opzioni.getGgMaxPos());
  
  }


    
}
