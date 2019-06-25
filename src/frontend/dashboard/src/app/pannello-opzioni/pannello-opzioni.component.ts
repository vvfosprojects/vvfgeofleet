import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Opzioni } from '../shared/model/opzioni.model';
import { Subscription } from 'rxjs';

import { VoceFiltro } from "../filtri/voce-filtro.model";

import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';

import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';


@Component({
  selector: 'app-pannello-opzioni',
  templateUrl: './pannello-opzioni.component.html',
  styleUrls: ['./pannello-opzioni.component.css']
})
export class PannelloOpzioniComponent implements OnInit, OnChanges {


  public opzioni: Opzioni;


  @Input() aggiorna: boolean;
  @Input() elencoMezzi: PosizioneMezzo[] = [];
  @Input() seguiMezziSelezionati: PosizioneMezzo[] = [];
  @Output() selezioneMezzi: EventEmitter<Object[]> = new EventEmitter();

  public titoloFiltroMezziSelezionati: string = "Mezzi selezionati";
  public vociFiltroMezziSelezionati: VoceFiltro[] = [];
  
  subscription = new Subscription();
     
  constructor(
    private gestioneOpzioniService: GestioneOpzioniService
  ) { 
    this.opzioni = new Opzioni();

    this.subscription.add(
      this.gestioneOpzioniService.getOpzioni()
      .subscribe( opt => { this.opzioni.set(opt); 
        //console.log("this.opzioni",this.opzioni);
      })
      );   

    }

  nuovaSelezioneMezziSelezionati(event) {
    //console.log('event: ', event);
    this.selezioneMezzi.emit(event);
  } 
    
  ngOnInit() {
    if (this.aggiorna) { this.aggiorna = false;}
    this.aggiornaMezzi();
  }

    
  ngOnChanges() {
    if (this.aggiorna) { this.aggiorna = false;}
    this.aggiornaMezzi();
  }  

  aggiornaMezzi() {

    this.vociFiltroMezziSelezionati = [];
    this.vociFiltroMezziSelezionati = this.elencoMezzi.map( 
      item => {
        var selezionato: boolean = this.seguiMezziSelezionati.find( 
          itemSelezionato => item.codiceMezzo === itemSelezionato.codiceMezzo )?true:false;

        var voceFiltro = new VoceFiltro( item.codiceMezzo, item.descrizionePosizione, 0, 
          selezionato, "", "badge-info", "");
        return voceFiltro;              
      });

    console.log("this.vociFiltroMezziSelezionati", this.elencoMezzi, this.vociFiltroMezziSelezionati);

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
    if (!this.opzioni.getCenterOnMezzo()) 
      this.gestioneOpzioniService.setCenterOnLast(true)
    else 
      this.gestioneOpzioniService.setCenterOnLast(false)    
  }  

  changeOptSeguiMezzo() {
    if (!this.opzioni.getIsSeguiMezzo()) 
      this.gestioneOpzioniService.setIsSeguiMezzo(true)
      //this.seguiMezziSelezionati[0] = this.elencoPosizioni [0];}
    else 
      this.gestioneOpzioniService.setIsSeguiMezzo(false)
      //this.seguiMezziSelezionati = []; 
  }

  fineSelezioneGgMaxPos(e) {    
    //this.nuovaSelezioneGgMaxPos.emit(this.ggMaxPos);
    this.gestioneOpzioniService.setGgMaxPos(this.opzioni.getGgMaxPos());
  
  }


    
}
