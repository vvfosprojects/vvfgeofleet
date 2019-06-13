import { Component, OnInit } from '@angular/core';
import { Opzioni } from '../shared/model/opzioni.model';
import { Subscription } from 'rxjs';

import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';

@Component({
  selector: 'app-pannello-opzioni',
  templateUrl: './pannello-opzioni.component.html',
  styleUrls: ['./pannello-opzioni.component.css']
})
export class PannelloOpzioniComponent implements OnInit {

  public opzioni: Opzioni;
  
  subscription = new Subscription();
     
  constructor(
    private gestioneOpzioniService: GestioneOpzioniService
  ) { 
    this.opzioni = new Opzioni();
    
    this.subscription.add(
      this.gestioneOpzioniService.getOpzioni()
      //.debounceTime(3000)
      .subscribe( opt => { this.opzioni = opt; })
      );   
    
  }

  ngOnInit() {
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

  changeCenterOnLast() {
    if (!this.opzioni.getCenterOnMezzo()) 
      this.gestioneOpzioniService.setCenterOnLast(true)
    else 
      this.gestioneOpzioniService.setCenterOnLast(false)    
  }  

  changeOptSeguiMezzo() {
    if (!this.opzioni.getCenterOnMezzo()) 
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
