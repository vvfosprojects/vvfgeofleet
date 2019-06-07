import { Component, OnInit } from '@angular/core';
import { VoceFiltro } from "../filtri/voce-filtro.model";
import { GestioneFiltriService } from '../service-filter/gestione-filtri.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pannello-filtri',
  templateUrl: './pannello-filtri.component.html',
  styleUrls: ['./pannello-filtri.component.css']
})
export class PannelloFiltriComponent implements OnInit {

  
  public titoloFiltroStatiMezzo: string = "Stati Mezzo";
  public vociFiltroStatiMezzo: VoceFiltro[] = [];
  public titoloFiltroSedi: string = "Sedi";
  public vociFiltroSedi: VoceFiltro[] = [];
  public titoloFiltroGeneriMezzo: string = "Generi Mezzo";
  public vociFiltroGeneriMezzo: VoceFiltro[] = [];
  public titoloFiltroDestinazioneUso: string = "Destinazione d'uso";
  public vociFiltroDestinazioneUso: VoceFiltro[] = [];

  subscription = new Subscription();
     
  constructor( private gestioneFiltriService: GestioneFiltriService
  ) {


    this.subscription.add(
      this.gestioneFiltriService.getFiltriStatiMezzo()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          //console.log("ElencoPosizioniFlottaComponent, getFiltriStatiMezzo:", vocifiltro);
          this.vociFiltroStatiMezzo = vocifiltro;
        })
      );   
    
    this.subscription.add(
      this.gestioneFiltriService.getFiltriSedi()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          //console.log("ElencoPosizioniFlottaComponent, getFiltriSedi:", vocifiltro);
          this.vociFiltroSedi = vocifiltro;
        })
      );   

    this.subscription.add(
      this.gestioneFiltriService.getFiltriGeneriMezzo()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          //console.log("ElencoPosizioniFlottaComponent, getFiltriGeneriMezzo:", vocifiltro);
          this.vociFiltroGeneriMezzo = vocifiltro;
        })
      );   

    this.subscription.add(
      this.gestioneFiltriService.getFiltriDestinazioneUso()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          //console.log("ElencoPosizioniFlottaComponent, getFiltriDestinazioneUso:", vocifiltro);
          this.vociFiltroDestinazioneUso = vocifiltro;
        })
      );   
    
   }

  ngOnInit() {
  }

  nuovaSelezioneStatiMezzo(event) {
    //console.log('event: ', event);
    //this.filtriStatiMezzo = event;
    this.gestioneFiltriService.setVisibleStatiMezzo(event);    
  } 
  
  nuovaSelezioneSedi(event) {
    //console.log('event: ', event);
    //this.filtriSedi = event;
    this.gestioneFiltriService.setVisibleSedi(event);

  }

  nuovaSelezioneGeneriMezzo(event) {
    //console.log('event: ', event);
    //this.filtriGeneriMezzo = event;
    this.gestioneFiltriService.setVisibleGeneriMezzo(event);
  }
  
  nuovaSelezioneDestinazioneUso(event) {
    //console.log('event: ', event);
    //this.filtriDestinazioneUso = event;
    this.gestioneFiltriService.setVisibleDestinazioneUso(event);
  }
  
}
