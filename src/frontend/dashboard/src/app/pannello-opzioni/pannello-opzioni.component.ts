import { Component, OnInit } from '@angular/core';
import { Opzioni } from '../shared/model/opzioni.model';
import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';
import { Subscription } from 'rxjs';

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

  changeOptOnlyMap(e) {
    if (!this.opzioni.onlyMap && e != '-') 
      //this.nuovaSelezioneAreaPos.emit(e)
      this.gestioneOpzioniService.setOnlyMap(true)      ;
      //this.aggiornaArea(e)
    else
      //this.nuovaSelezioneGgMaxPos.emit(this.ggMaxPos);
      this.gestioneOpzioniService.setOnlyMap(false)      ;
      //this.aggiornaAttSec(this.opzioni.ggMaxPos);
  }

  changeCenterOnLast() {
    if (!this.opzioni.centerOnMezzo) 
      this.gestioneOpzioniService.setCenterOnLast(true)
    else 
      this.gestioneOpzioniService.setCenterOnLast(false)    
  }  

  changeOptSeguiMezzo() {
    if (!this.opzioni.centerOnMezzo) 
      this.gestioneOpzioniService.setIsSeguiMezzo(true)
      //this.seguiMezziSelezionati[0] = this.elencoPosizioni [0];}
    else 
      this.gestioneOpzioniService.setIsSeguiMezzo(false)
      //this.seguiMezziSelezionati = []; 
  }

  fineSelezioneGgMaxPos(e) {    
    //this.nuovaSelezioneGgMaxPos.emit(this.ggMaxPos);
    this.gestioneOpzioniService.setGgMaxPos(this.opzioni.ggMaxPos);
  }

}
