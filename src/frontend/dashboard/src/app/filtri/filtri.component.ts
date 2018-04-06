import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//import { UiSwitchModule } from 'angular2-ui-switch';
//import { Filtri } from './filtri.model';
import { VoceFiltro } from "./voce-filtro.model";

@Component({
  selector: 'app-filtri',
  templateUrl: './filtri.component.html',
  styleUrls: ['./filtri.component.css']
})
export class FiltriComponent implements OnInit {
  @Input() titolo: string;
  @Input() vociFiltro: VoceFiltro[];
  @Output() nuovaSelezione: EventEmitter<Object[]> = new EventEmitter();
  
  enable: boolean = true;
  
  //filtri : Filtri;

  constructor() { 
  }

  ngOnInit() {
    //this.filtri = new Filtri( true, true, true, true, true, true, true);
  }
  
  private toggleClicked () {
    /*
    console.log('statoMezzo1: ' + this.filtri.statoMezzo1);
    console.log('statoMezzo2: ' + this.filtri.statoMezzo2);
    console.log('statoMezzo3: ' + this.filtri.statoMezzo3);
    console.log('statoMezzo4: ' + this.filtri.statoMezzo4);
    console.log('statoMezzo5: ' + this.filtri.statoMezzo5);
    console.log('statoMezzo6: ' + this.filtri.statoMezzo6);
    */
  }

  public selezione(event, codice) {
    //console.log('event: ' + event);
    /*
    console.log('codice: ' + this.vociFiltro[0].codice);
    console.log('codice: ' + this.vociFiltro[1].codice);
    console.log('codice: ' + this.vociFiltro[2].codice);
    console.log('codice: ' + this.vociFiltro[3].codice);
    console.log('codice: ' + this.vociFiltro[4].codice);
    console.log('codice: ' + this.vociFiltro[5].codice);
    */
    this.vociFiltro.find(vf => vf.codice === codice).selezionato = event.target.checked;
    this.nuovaSelezione.emit(
      this.vociFiltro
        .filter(v => v.selezionato)
        .map(v => v.codice)
    );

  }

}
