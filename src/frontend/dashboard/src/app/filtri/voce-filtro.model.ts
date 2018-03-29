export class VoceFiltro {
    constructor(
        public codice: Object,
        public descrizione: string,
        public cardinalita: number,
        public selezionato: boolean = true,
        public tooltip: string = "",
        public badgeCardinalita: string = "badge-info"
    ) {}
}
