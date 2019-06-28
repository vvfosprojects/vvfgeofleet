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
  
  constructor() { 
  }

  ngOnInit() {

  }
  
  private toggleClicked () {

  }

  public selezione(event, codice) {
    //console.log('event: ' + event);

    this.vociFiltro.find(vf => vf.codice === codice).selezionato = event.target.checked;
    // restituisce le sole voci selezionate
    this.nuovaSelezione.emit(
      this.vociFiltro
        .filter(v => v.selezionato)
        .map(v => v.codice)
    );
    

  
  }

}
