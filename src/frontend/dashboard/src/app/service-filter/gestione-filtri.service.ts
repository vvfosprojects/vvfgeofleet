import { Injectable } from '@angular/core';
import { Observable, Subject, of } from "rxjs";

import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { VoceFiltro } from "../filtri/voce-filtro.model";

// i Filtri vengono condivisi in tutta l'applicazione
@Injectable({
  providedIn: 'root'
})

export class GestioneFiltriService {


  /*
  public titoloFiltroStatiMezzo: string = "Stati Mezzo";
  public vociFiltroStatiMezzo: VoceFiltro[] = [
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
      "5", "Fuori per motivi di Istituto", 0, false, "", "badge-info", "assets/images/mm_20_yellow.png"
    ),
    new VoceFiltro(
      "0", "Stato operativo Sconosciuto", 0, false, "", "badge-info", "assets/images/mm_20_black.png"
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
      "4", "Mezzi rientrati dall'intervento", 0, false, "", "badge-info", "assets/images/mm_20_gray.png"
    )
    ];

    //vociFiltroStatiMezzoDefault: VoceFiltro[];  
    public filtriStatiMezzo: string[] = [];
    public filtriStatiMezzoObj: Object;
*/

  private titoloFiltroStatiMezzo: string = "Stati Mezzo";
  private vociFiltroStatiMezzo: VoceFiltro[] = [
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
      "5", "Fuori per motivi di Istituto", 0, false, "", "badge-info", "assets/images/mm_20_yellow.png"
    ),
    new VoceFiltro(
      "0", "Stato operativo Sconosciuto", 0, false, "", "badge-info", "assets/images/mm_20_black.png"
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
      "4", "Mezzi rientrati dall'intervento", 0, false, "", "badge-info", "assets/images/mm_20_gray.png"
    )
    ];

    //vociFiltroStatiMezzoDefault: VoceFiltro[];  
    private filtriStatiMezzo: string[] = [];
    private filtriStatiMezzoObj: Object;

    private titoloFiltroSedi: string = "Sedi";
    private vociFiltroSedi: VoceFiltro[] = [];
    private vociFiltroSediALL: VoceFiltro[] = [
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
      new VoceFiltro("VI", "VENETO - Vicenza", 0, true, "", "badge-info", ""),
      new VoceFiltro("..", "sconosciuta", 0, true, "", "badge-info", "")
    ];
    private filtriSedi: string[] = [];
    private filtriSediObj: Object;

    private titoloFiltroGeneriMezzo: string = "Generi Mezzo";
    private vociFiltroGeneriMezzo: VoceFiltro[] = [];
    private vociFiltroGeneriMezzoALL: VoceFiltro[] = [
      new VoceFiltro("", "sconosciuto", 0, true, "", "badge-info", ""),
      new VoceFiltro("*****", "non definito", 0, true, "", "badge-info", ""),
      new VoceFiltro("ATOM", "ATOMIZZATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AB", "AUTOBOTTE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AB/CAR", "AUTOBOTTE CARBURANTE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AB/GPL", "AUTOBOTTE PER TRASPORTO GPL", 0, true, "", "badge-info", ""),
      new VoceFiltro("ABP", "AUTOBOTTEPOMPA", 0, true, "", "badge-info", ""),
      new VoceFiltro("ABP/SC", "AUTOBOTTEPOMPA ATTREZZATA SCARRABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ABP/AER", "AUTOBOTTEPOMPA SERVIZIO AEROPORTUALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("A/BUS", "AUTOBUS", 0, true, "", "badge-info", ""),
      new VoceFiltro("BUS G", "AUTOBUS GRANDE  (OLTRE 20 POSTI)", 0, true, "", "badge-info", ""),
      new VoceFiltro("BUS M", "AUTOBUS MEDIO (FINO A 20 POSTI)", 0, true, "", "badge-info", ""),
      new VoceFiltro("BUS P", "AUTOBUS PICCOLO (FINO A 9 POSTI)", 0, true, "", "badge-info", ""),
      new VoceFiltro("BUS/AL", "AUTOBUS TRASFORMATO IN AUTOLETTIGA", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/RIB", "AUTOCARRO CASSONE RIBALTABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/TRI", "AUTOCARRO CASSONE TRIRIBALTABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/CO2", "AUTOCARRO CON APPARECCHIATURA CO2", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/SCH-CO2", "AUTOCARRO CON SCHIUMOGENO CO2", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/CC", "AUTOCARRO CROLLI", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/NBCR", "AUTOCARRO DECON. NUCL.BATTER.CHIM.RAD.", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/NUC", "AUTOCARRO EMERGENZA NUCLEARE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/FURG.SC", "AUTOCARRO FURGANATO SCARRABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/GRU", "AUTOCARRO GRU", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/ILL MG", "AUTOCARRO ILLUM. MAGAZZINO GENERATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/ILL", "AUTOCARRO ILLUMINAZIONE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/ILL TF", "AUTOCARRO ILLUMINAZIONE TORRE FARI", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/BOSC", "AUTOCARRO INCENDI BOSCHIVI", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/LU", "AUTOCARRO LUCE - GRUPPO ELETTROGENO", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/NBC", "AUTOCARRO PER DECON. NUCL. BATTER. CHIM.", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/SMM", "AUTOCARRO SATELLITARE MOBILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/SC", "AUTOCARRO SCARRABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/EL", "AUTOCARRO SERVIZI ELETTRICI", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/IDR", "AUTOCARRO SERVIZI IDRICI", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/IG", "AUTOCARRO SERVIZI IGIENICI", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/ATTR", "AUTOCARRO SERVIZI ISTITUTO", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/MEN", "AUTOCARRO SERVIZI MENSA", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/OP", "AUTOCARRO SEZIONE OPERATIVA", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/TEN", "AUTOCARRO TENDE E CASERMAGGIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT", "AUTOCARRO TRASPORTO", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/RU", "AUTOCARRO TRASPORTO RU", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/UFF", "AUTOCARRO UFFICIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/CC", "AUTOFURGONE CARRO COMANDO COL. MOB.", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF", "AUTOFURGONE CARROZ. CHIUSA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/CO", "AUTOFURGONE COMANDO", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/COMBI", "AUTOFURGONE COMBI", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/C", "AUTOFURGONE COMBINATO", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/NBCR", "AUTOFURGONE DECON. NUCL.BATTER.CHIM.RAD.", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/BOSC", "AUTOFURGONE INCENDI BOSCHIVI", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/NUC", "AUTOFURGONE LABORATORIO NUCLEARE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/MEN", "AUTOFURGONE MENSA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/OFF", "AUTOFURGONE OFFICINA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/OP", "AUTOFURGONE OPERATIVO COL. MOB.", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/NBC", "AUTOFURGONE PER DECON. NUCL.BATTER.CHIM.", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/NR", "AUTOFURGONE PER NUCLEO RADIOATTIVITA'", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/SOMM", "AUTOFURGONE PER NUCLEO SOMMOZZATORI", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/SMZT", "AUTOFURGONE PER NUCLEO SOMMOZZATORI", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/TV", "AUTOFURGONE PER RIPRESE TV", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/POL", "AUTOFURGONE POLISOCCORSO", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/P.RAD", "AUTOFURGONE PONTE RADIO MOBILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/RAD", "AUTOFURGONE RADIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/RIS", "AUTOFURGONE RISTORO COL. MOB.", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/SC", "AUTOFURGONE SCORTA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/EL", "AUTOFURGONE SERVIZI ELETTRICI", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/IDR", "AUTOFURGONE SERVIZI IDRICI COL. MOB.", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/SAR", "AUTOFURGONE SOCCORSO ACCESSIBILITA' RID.", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/AER", "AUTOFURGONE SOCCORSO AEREOPORTUALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/SAF", "AUTOFURGONE SPELEO ALPINO FLUVIALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/TRID", "AUTOFURGONE TRIDIMENSIONALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AF/UCL", "AUTOFURGONE UNITA' CRISI LOCALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AG", "AUTOGRU", 0, true, "", "badge-info", ""),
      new VoceFiltro("AIS", "AUTOIDROSCHIUMA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AIS/PB", "AUTOIDROSCHIUMA PELINI BARIBBI", 0, true, "", "badge-info", ""),
      new VoceFiltro("AISP", "AUTOIDROSCHIUMA POLVERE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AL", "AUTOLETTIGA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AA", "AUTOMEZZO ANFIBIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("ARI", "AUTOMEZZO RAPIDO INTERV. AEROPORTUALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ACT/INC", "AUTOMEZZO RECUPERO VEICOLI INCIDENTATI", 0, true, "", "badge-info", ""),
      new VoceFiltro("A/AER", "AUTOMEZZO SOCCORSO AEROPORTUALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ASA", "AUTOMEZZO SOCCORSO AEROPORTUALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("A/SP", "AUTOMEZZO SPAZZATRICE", 0, true, "", "badge-info", ""),
      new VoceFiltro("A/TT", "AUTOMEZZO TRATTRICE PER SEMIRIMORCHIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("A/TRID", "AUTOMEZZO TRIDIMENSIONALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("APL", "AUTOPOMPA LAGUNARE", 0, true, "", "badge-info", ""),
      new VoceFiltro("APL/G", "AUTOPOMPA LAGUNARE GRANDE", 0, true, "", "badge-info", ""),
      new VoceFiltro("APL/M", "AUTOPOMPA LAGUNARE MEDIA", 0, true, "", "badge-info", ""),
      new VoceFiltro("APL/P", "AUTOPOMPA LAGUNARE PICCOLA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AP/S.I.EL", "AUTOPOMPA SENZA SERB SERV IDR.", 0, true, "", "badge-info", ""),
      new VoceFiltro("AP", "AUTOPOMPA SENZA SERBATOIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("APS/SR", "AUTOPOMPA SERB. STRADA ROTAIA (BIMODALE)", 0, true, "", "badge-info", ""),
      new VoceFiltro("APS", "AUTOPOMPA SERBATOIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("APS/P", "AUTOPOMPA SERBATOIO PICCOLA", 0, true, "", "badge-info", ""),
      new VoceFiltro("APS/TRID", "AUTOPOMPA SERBATOIO TRIDIMENSIONALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("APS/3P", "AUTOPOMPA SERBATOIO 3 POSTI", 0, true, "", "badge-info", ""),
      new VoceFiltro("AS", "AUTOSCALA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AS/M", "AUTOSCALA CON VOLATA MANUALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("AV", "AUTOVETTURA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AV/AFF. ALVAR", "AUTOVETTURA AFFITATA ARVAL", 0, true, "", "badge-info", ""),
      new VoceFiltro("AV/9", "AUTOVETTURA CON 9 POSTI", 0, true, "", "badge-info", ""),
      new VoceFiltro("AV/FS", "AUTOVETTURA FUORISTRADA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AV/NOLEGGIO", "AUTOVETTURA NOLEGGIATA", 0, true, "", "badge-info", ""),
      new VoceFiltro("AVP", "AUTOVETTURA POMPA", 0, true, "", "badge-info", ""),
      new VoceFiltro("BA", "BARCA", 0, true, "", "badge-info", ""),
      new VoceFiltro("BA/JET", "BARCA CON MOTORE IDROJET", 0, true, "", "badge-info", ""),
      new VoceFiltro("BP", "BATTELLO PNEUMATICO", 0, true, "", "badge-info", ""),
      new VoceFiltro("BP/EB", "BATTELLO PNEUMATICO ENTRO BORDO", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA", "CAMPAGNOLA", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/FO", "CAMPAGNOLA  CON FOTOELETTRICA", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/NUC", "CAMPAGNOLA ATTREZZATA NUCLEARE", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/GRU", "CAMPAGNOLA CON GRUETTA", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/ESK", "CAMPAGNOLA CON MODULO ESK", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/ESK 400", "CAMPAGNOLA CON MODULO ESK 400", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/ESK 600", "CAMPAGNOLA CON MODULO ESK 600", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/MONTES", "CAMPAGNOLA FUORISTRADA (9 POSTI)", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/SMZT", "CAMPAGNOLA PER NUCLEO SOMMOZZATORI", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/PU", "CAMPAGNOLA PICK-UP", 0, true, "", "badge-info", ""),
      new VoceFiltro("CA/RIA", "CAMPAGNOLA RAPIDO INTERV. AEROPORTUALE", 0, true, "", "badge-info", ""),
      new VoceFiltro("C/NBCR", "CARRELLO CON IDROPULITRICE", 0, true, "", "badge-info", ""),
      new VoceFiltro("CE", "CARRELLO ELEVATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("CEL", "CARRELLO ELEVATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("CEI", "CESOIE IDRAULICHE", 0, true, "", "badge-info", ""),
      new VoceFiltro("CC/CARB", "CISTERNA TRASPORTO CARBURANTI", 0, true, "", "badge-info", ""),
      new VoceFiltro("SHELTER", "CONTAINER SHELTER", 0, true, "", "badge-info", ""),
      new VoceFiltro("DEC", "DECESPUGLIATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ELI", "ELICOTTERO", 0, true, "", "badge-info", ""),
      new VoceFiltro("ESC", "ESCAVATORE CINGOLATO", 0, true, "", "badge-info", ""),
      new VoceFiltro("ESG", "ESCAVATORE GOMMATO", 0, true, "", "badge-info", ""),
      new VoceFiltro("FE", "FOTOELETTRICA", 0, true, "", "badge-info", ""),
      new VoceFiltro("FRS/NEVE", "FRESA DA NEVE", 0, true, "", "badge-info", ""),
      new VoceFiltro("FS", "FS", 0, true, "", "badge-info", ""),
      new VoceFiltro("FB", "FUORIBORDO", 0, true, "", "badge-info", ""),
      new VoceFiltro("GE", "GRUPPO ELETTROGENO", 0, true, "", "badge-info", ""),
      new VoceFiltro("GE/B", "GRUPPO ELETTROGENO BARELLABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("GF/B", "GRUPPO FARI BARELLABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("GID/B", "GRUPPO IDRAULICO BARELLABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("HOVERCRAFT", "HOVERCRAFT", 0, true, "", "badge-info", ""),
      new VoceFiltro("IDRO", "IDROPULITRICE GENERICA", 0, true, "", "badge-info", ""),
      new VoceFiltro("IDRO/RIS", "IDROPULITRICE RISCALDATA", 0, true, "", "badge-info", ""),
      new VoceFiltro("IAL", "IMBARCAZIONE ALLUVIONALE LEGGERA", 0, true, "", "badge-info", ""),
      new VoceFiltro("ES/MINI", "MINI ESCAVATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("MES", "MINIESCAVATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("MPC", "MINIPALA CINGOLATA", 0, true, "", "badge-info", ""),
      new VoceFiltro("MPG", "MINIPALA GOMMATA", 0, true, "", "badge-info", ""),
      new VoceFiltro("MOD/BOSC SC", "MODULO INCENDI BOSCHIVI SCARRABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("MOS", "MOS MACCHINA OPERATRICE SEMOVENTE", 0, true, "", "badge-info", ""),
      new VoceFiltro("MDA", "MOTO D'ACQUA", 0, true, "", "badge-info", ""),
      new VoceFiltro("MD", "MOTO DISCO", 0, true, "", "badge-info", ""),
      new VoceFiltro("MBP/G", "MOTOBARCA POMPA GRANDE", 0, true, "", "badge-info", ""),
      new VoceFiltro("MBP/M", "MOTOBARCA POMPA MEDIA", 0, true, "", "badge-info", ""),
      new VoceFiltro("MBP/P", "MOTOBARCA POMPA PICCOLA", 0, true, "", "badge-info", ""),
      new VoceFiltro("MBP/RAFF", "MOTOBARCA POMPA RAFF", 0, true, "", "badge-info", ""),
      new VoceFiltro("MTC", "MOTOCARRELLO", 0, true, "", "badge-info", ""),
      new VoceFiltro("MO", "MOTOCICLETTA", 0, true, "", "badge-info", ""),
      new VoceFiltro("MDEM", "MOTODEMOLITORI", 0, true, "", "badge-info", ""),
      new VoceFiltro("MD/B", "MOTODIVARICATORE BARELLABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("MF", "MOTOFARO", 0, true, "", "badge-info", ""),
      new VoceFiltro("MNP", "MOTONAVE POMPA", 0, true, "", "badge-info", ""),
      new VoceFiltro("P/B-ESA", "MOTOPOMPA BARELLABILE DA ESAURIMENTO", 0, true, "", "badge-info", ""),
      new VoceFiltro("MP/B-INC", "MOTOPOMPA BARELLABILE DA INCENDIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("MP/ESA-RI", "MOTOPOMPA ESAURIMENTO SU RIMORCHIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("MP/RI", "MOTOPOMPA INCENDIO SU RIMORCHIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("MS", "MOTOSCAFO", 0, true, "", "badge-info", ""),
      new VoceFiltro("MSG", "MOTOSEGA", 0, true, "", "badge-info", ""),
      new VoceFiltro("MTS", "MOTOSLITTA", 0, true, "", "badge-info", ""),
      new VoceFiltro("MTT", "MOTOTRONCATRICE", 0, true, "", "badge-info", ""),
      new VoceFiltro("MV/B", "MOTOVENTILATORE BARELLABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("MV/RIS", "MOTOVENTILATORE RISCALDATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("MT", "MOVIMENTATORE TELESCOPICO", 0, true, "", "badge-info", ""),
      new VoceFiltro("MUL", "MULETTO - CARRELLO ELEVATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("PTTF", "PIATTAFORMA", 0, true, "", "badge-info", ""),
      new VoceFiltro("PTR", "PIATTAFORMA TELESCOPICA RAGNO", 0, true, "", "badge-info", ""),
      new VoceFiltro("POM/IMM", "POMPA AD IMMERSIONE", 0, true, "", "badge-info", ""),
      new VoceFiltro("QUAD", "QUADRICICLO", 0, true, "", "badge-info", ""),
      new VoceFiltro("QUA", "QUADRICICLO", 0, true, "", "badge-info", ""),
      new VoceFiltro("RAS", "RASAERBA", 0, true, "", "badge-info", ""),
      new VoceFiltro("RIB/E", "RIGID INFLATABLE BOAT EQUIVALENTE", 0, true, "", "badge-info", ""),
      new VoceFiltro("RIB/G", "RIGID INFLATABLE BOAT GRANDE", 0, true, "", "badge-info", ""),
      new VoceFiltro("RIB/P", "RIGID INFLATABLE BOAT PICCOLO", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/ELI", "RIMORCHIO BIGA PER ELICOTTERI", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/ESK", "RIMORCHIO CON MODULO ESK", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/ESK 400", "RIMORCHIO CON MODULO ESK 400", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/ESK 600", "RIMORCHIO CON MODULO ESK 600", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/MCP", "RIMORCHIO CON MOTOCOMPRESSORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/CONT.CU", "RIMORCHIO CONTAINERS CUCINA", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/CONT.IG", "RIMORCHIO CONTAINERS SERVIZI IGIENICI", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/CU", "RIMORCHIO CU", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/CU G", "RIMORCHIO CUCINA GRANDE (800 RAZIONI)", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/CU M", "RIMORCHIO CUCINA MEDIA (300 RAZIONI)", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/CU P", "RIMORCHIO CUCINA PICCOLA (200 RAZIONI)", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/NBCR", "RIMORCHIO DECON. NUCL.BATTER.CHIM.RAD.", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/CING", "RIMORCHIO GIRINO PER CINGOLATI", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/BA", "RIMORCHIO PER BARCA", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/BP", "RIMORCHIO PER BP", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/CANN", "RIMORCHIO PER CANNONE LANCIA", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/FO", "RIMORCHIO PER FOTOELETTRICA", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/GR.E", "RIMORCHIO PER GRUPPO ELETTROGENO", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/FSN", "RIMORCHIO PER MEZZI DA NEVE", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/MO.ACQ.", "RIMORCHIO PER MOTO D'ACQUA", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/MP", "RIMORCHIO PER MOTOPOMPA", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/MTS", "RIMORCHIO PER MOTOSLITTA", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/SCH", "RIMORCHIO PER SCHIUMOGENO", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/FS", "RIMORCHIO PER TERRENI INNEVATI", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/MDA", "RIMORCHIO PER TRASPORTO MOTO D'ACQUA", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI", "RIMORCHIO PER USI VARI", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/TO.FA.", "RIMORCHIO TORRE FARI", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/MA.O", "RIMORCHIO TRASPORTO MACC. OPER.", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/PR", "RIMORCHIO TRASPORTO PONTE RADIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/QUAD", "RIMORCHIO TRASPORTO QUADRICICLO", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/VEIC", "RIMORCHIO TRASPORTO VEICOLI", 0, true, "", "badge-info", ""),
      new VoceFiltro("ROUL", "ROULOTTE", 0, true, "", "badge-info", ""),
      new VoceFiltro("RI/S", "SCALA AEREA RIMORCHIABILE", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/CIS", "SEMIRIMORCHIO CISTERNATO", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/CU P", "SEMIRIMORCHIO CUCINA DA CAMPO 150 PASTI", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/CU G", "SEMIRIMORCHIO CUCINA DA CAMPO 250 PASTI", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/FUR", "SEMIRIMORCHIO FURGONATO", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/REV", "SEMIRIMORCHIO REVISIONE VEICOLI", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/MA.O", "SEMIRIMORCHIO TRASP. MACC. OPER.", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/TC", "SEMIRIMORCHIO TRASP. TRATT. CARIC. CING.", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/TCG", "SEMIRIMORCHIO TRASP. TRATT. CARIC. GOM.", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/CP", "SEMIRIMORCHIO TRASPORTO CASETTE PIEGH.", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/CON", "SEMIRIMORCHIO TRASPORTO CONTAINERS", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR/ES", "SEMIRIMORCHIO TRASPORTO ESCAVATORE", 0, true, "", "badge-info", ""),
      new VoceFiltro("SBVAD", "SERBATOIO BENZINA VERDE ATT. DIDATTICA", 0, true, "", "badge-info", ""),
      new VoceFiltro("SGAD", "SERBATOIO GASOLIO ATT. DIDATTICA", 0, true, "", "badge-info", ""),
      new VoceFiltro("LUF", "SISTEMA MOBILE DI SUPPORTO ANTINCENDIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("SOFF", "SOFFIATORI PER RISCALDAMENTO NELLE TENDE", 0, true, "", "badge-info", ""),
      new VoceFiltro("SPAZZ", "SPAZZATRICE", 0, true, "", "badge-info", ""),
      new VoceFiltro("SR", "SR", 0, true, "", "badge-info", ""),
      new VoceFiltro("TS", "TAGLIASIEPI", 0, true, "", "badge-info", ""),
      new VoceFiltro("TNKADB", "TANICA ADBLUE", 0, true, "", "badge-info", ""),
      new VoceFiltro("TNKJ", "TANICA AVIO", 0, true, "", "badge-info", ""),
      new VoceFiltro("TNKV", "TANICA BENZINA VERDE", 0, true, "", "badge-info", ""),
      new VoceFiltro("TNKDA", "TANICA DIESEL AUTOTRAZIONE", 0, true, "", "badge-info", ""),
      new VoceFiltro("TNKDN", "TANICA DIESEL NAUTICO", 0, true, "", "badge-info", ""),
      new VoceFiltro("TNKK", "TANICA KEROSENE", 0, true, "", "badge-info", ""),
      new VoceFiltro("TNKM", "TANICA MISCELA", 0, true, "", "badge-info", ""),
      new VoceFiltro("TER", "TERNA", 0, true, "", "badge-info", ""),
      new VoceFiltro("TCE/G", "TERNA CARICATORE ESCAVATORE GOMMATO", 0, true, "", "badge-info", ""),
      new VoceFiltro("TA", "TRATTORE APRIPISTA", 0, true, "", "badge-info", ""),
      new VoceFiltro("TCC", "TRATTORE CARICATORE CINGOLATO", 0, true, "", "badge-info", ""),
      new VoceFiltro("TCG", "TRATTORE CARICATORE GOMMATO", 0, true, "", "badge-info", ""),
      new VoceFiltro("TT/AGR", "TRATTRICE AGRICOLA", 0, true, "", "badge-info", ""),
      new VoceFiltro("VAL/2P", "VEICOLO ANTINCEDIO LEGGERO - 2 POSTI", 0, true, "", "badge-info", ""),
      new VoceFiltro("FS/NEVE", "YETI E PRINOTH PER ZONE INNEVATE", 0, true, "", "badge-info", ""),
      new VoceFiltro("ZA", "ZATTERA", 0, true, "", "badge-info", "")
    ];
    private filtriGeneriMezzo: string[] = [];
    private filtriGeneriMezzoObj: Object;

    private titoloFiltroDestinazioneUso: string = "Destinazione d'uso";
    private vociFiltroDestinazioneUso: VoceFiltro[] = [];
    private vociFiltroDestinazioneUsoALL: VoceFiltro[] = [
     new VoceFiltro("..", "sconosciuta", 0, true, "", "badge-info", ""),
     new VoceFiltro("CORP", "Comando", 0, true, "", "badge-info", ""),
     new VoceFiltro("CMOB", "Colonna Mobile", 0, true, "", "badge-info", ""),
     new VoceFiltro("GOS", "Gruppo Operativo Speciale", 0, true, "", "badge-info", "")
    ];
    private filtriDestinazioneUso: string[] = [];
    private filtriDestinazioneUsoObj: Object;

    private subjectFiltriStatiMezzo$ = new Subject<VoceFiltro[]>();
    private subjectFiltriSedi$ = new Subject<VoceFiltro[]>();
    private subjectFiltriGeneriMezzo$ = new Subject<VoceFiltro[]>();
    private subjectFiltriDestinazioneUso$ = new Subject<VoceFiltro[]>();
    
  constructor() {     
      // scatena l'invio dei subject a chi è in ascolto
      var elencoPosizioni : PosizioneMezzo[] = [];
      this.setupFiltri(elencoPosizioni);
  }

  private setupFiltriStatiMezzo(elencoPosizioni : PosizioneMezzo[]): void {
    // elabora solo le posizioni su cui sono disponibili le info di SO115
    elencoPosizioni = elencoPosizioni.filter(r => r.infoSO115 != null);
  
    // calcola la cardinalità per tutti gli Stati del Mezzo, se non sono presenti nell'elenco Posizioni, sarà 0
    this.vociFiltroStatiMezzo.find(v => v.codice === "0").cardinalita = 
      elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("0") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "1").cardinalita = 
      elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("1") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "2").cardinalita = 
      elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("2") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "3").cardinalita = 
      elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("3") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "4").cardinalita = 
      elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("4") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "5").cardinalita = 
      elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("5") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "6").cardinalita = 
      elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("6") === 0).length;
    this.vociFiltroStatiMezzo.find(v => v.codice === "7").cardinalita = 
      elencoPosizioni.filter(r =>  r.infoSO115.stato.localeCompare("7") === 0).length;

    this.subjectFiltriStatiMezzo$.next(this.vociFiltroStatiMezzo);
  }

  private setupFiltriSedi(elencoPosizioni : PosizioneMezzo[]): void {

    // filtra solo le Sedi presenti nell'elenco Posizioni

    this.vociFiltroSedi = this.vociFiltroSediALL.filter( i =>
      elencoPosizioni.some( iii => 
        ( iii.sedeMezzo === i.codice ) 
      ));

    this.subjectFiltriSedi$.next(this.vociFiltroSedi);
  }
  
  private setupFiltriGeneriMezzo(elencoPosizioni : PosizioneMezzo[]): void {

    // filtra solo i Generi Mezzo presenti nell'elenco Posizioni
    this.vociFiltroGeneriMezzo = this.vociFiltroGeneriMezzoALL.filter( i =>
      elencoPosizioni.some( iii => 
        ( iii.classiMezzo.some( cm  => cm === i.codice)) 
      ));

    // aggiungo sempre il genere Mezzo "sconosciuto"
    if (!this.vociFiltroGeneriMezzo.find(i => i.descrizione == "sconosciuto"))
    {
      this.vociFiltroGeneriMezzo = this.vociFiltroGeneriMezzo.concat(
        new VoceFiltro("", "sconosciuto", 0, true, "", "badge-info", "") );
    }

    // aggiungo sempre il genere Mezzo "non definito"
    if (!this.vociFiltroGeneriMezzo.find(i => i.descrizione == "non definito"))
    {
      this.vociFiltroGeneriMezzo = this.vociFiltroGeneriMezzo.concat(
        new VoceFiltro("*****", "non definito", 0, true, "", "badge-info", "") );
    }

    this.subjectFiltriGeneriMezzo$.next(this.vociFiltroGeneriMezzo);
  }
  
  private setupFiltriDestinazioneUso(elencoPosizioni : PosizioneMezzo[]): void {

    // filtra solo le Destinazioni d'uso presenti nell'elenco Posizioni
    this.vociFiltroDestinazioneUso = this.vociFiltroDestinazioneUsoALL.filter( i =>
      elencoPosizioni.find( iii => 
        {if ( iii.destinazioneUso === i.codice)
          return true; 
          else 
          return false;
        } 
      ));
             

    this.subjectFiltriDestinazioneUso$.next(this.vociFiltroDestinazioneUso);

  }
  
  public setVisibleStatiMezzo(vociFiltroSelezionate : String[]): void {
    /*
    this.filtriStatiMezzoObj = undefined;  
    this.filtriStatiMezzoObj = new Object();  
    this.filtriStatiMezzo = this.vociFiltroStatiMezzo
    .filter(v => v.selezionato)
    .map(v => (v.codice).toString())
    ;
    this.filtriStatiMezzo.forEach( item => { this.filtriStatiMezzoObj[item] = item; } ); 
    */
    vociFiltroSelezionate.forEach( ii => { 
      this.vociFiltroStatiMezzo.find( item => item.codice == ii).selezionato = true;
      });

    this.subjectFiltriStatiMezzo$.next(this.vociFiltroStatiMezzo);
      
  }

  public setVisibleSedi(vociFiltroSelezionate : String[]): void {
    /*
    this.filtriSediObj = undefined;  
    this.filtriSediObj = new Object();  
    this.filtriSedi = this.vociFiltroSedi
    .filter(v => v.selezionato)
    .map(v => (v.codice).toString())
    ;
    this.filtriSedi.forEach( item => { this.filtriSediObj[item] = item; } );    
    */
    vociFiltroSelezionate.forEach( ii => { 
      this.vociFiltroSedi.find( item => item.codice == ii).selezionato = true;
      });
    
    this.subjectFiltriSedi$.next(this.vociFiltroSedi);
        
  }

  public setVisibleGeneriMezzo(vociFiltroSelezionate : String[]): void {
    /*
    this.filtriGeneriMezzoObj = undefined;
    this.filtriGeneriMezzoObj = new Object();
    this.filtriGeneriMezzo = this.vociFiltroGeneriMezzo
    .filter(v => v.selezionato)
    .map(v => (v.codice).toString())
    ;
    this.filtriGeneriMezzo.forEach( item => { this.filtriGeneriMezzoObj[item]=item; } );
    */
   
    vociFiltroSelezionate.forEach( ii => { 
      this.vociFiltroGeneriMezzo.find( item => item.codice == ii).selezionato = true;
      });

    this.subjectFiltriGeneriMezzo$.next(this.vociFiltroGeneriMezzo);
      
  }

  public setVisibleDestinazioneUso(vociFiltroSelezionate : String[]): void {
    /*
    this.filtriDestinazioneUsoObj = undefined;      
    this.filtriDestinazioneUsoObj = new Object();  
    this.filtriDestinazioneUso = this.vociFiltroDestinazioneUso
    .filter(v => v.selezionato)
    .map(v => (v.codice).toString())
    ;
    this.filtriDestinazioneUso.forEach( item => { this.filtriDestinazioneUsoObj[item]=item; } );      
    */
    vociFiltroSelezionate.forEach( ii => { 
      this.vociFiltroDestinazioneUso.find( item => item.codice == ii).selezionato = true;
      });

    this.subjectFiltriDestinazioneUso$.next(this.vociFiltroDestinazioneUso);
      
  }

  public getFiltriStatiMezzo(): Observable<VoceFiltro[]> {
    return this.subjectFiltriStatiMezzo$.asObservable();
  }

  public getFiltriSedi(): Observable<VoceFiltro[]> {
    return this.subjectFiltriSedi$.asObservable();
  }

  public getFiltriGeneriMezzo(): Observable<VoceFiltro[]> {
    return this.subjectFiltriGeneriMezzo$.asObservable();
  }
  
  public getFiltriDestinazioneUso(): Observable<VoceFiltro[]> {
    return this.subjectFiltriDestinazioneUso$.asObservable();
  }


  public setupFiltri(elencoPosizioni : PosizioneMezzo[]): void {
    
    this.setupFiltriStatiMezzo(elencoPosizioni);
    this.setupFiltriSedi(elencoPosizioni);
    this.setupFiltriGeneriMezzo(elencoPosizioni);
    this.setupFiltriDestinazioneUso(elencoPosizioni);

   
    /*
    var statiMezzo : string[] = [ "0", "1", "2", "3", "4", "5", "6"];

    this.vociFiltroStatiMezzo = Object.keys(statiMezzo).map(desc => new VoceFiltro(desc, desc, statiMezzo[desc]));
    */


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

    //this.mezzoSelezionato = this.elencoPosizioni[0];

    //if (this.vociFiltroStatiMezzo.length > 0) {
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
      il metodo forEach() è anch'essa troppo lenta su un elevato numero 
      di elementi

      this.elencoPosizioniMezzoFiltrate.forEach( pos => 
        pos.selezionata = this.vociFiltroStatiMezzoDefault.
        some(filtro => filtro.codice.toString() === pos.infoSO115.stato));
      //console.log(this.elencoPosizioniMezzoFiltrate);
      
     */
      // soluzione utilizzando una funzione valutata durante l'aggiornamento della view




    //}

  }
  
  

}
