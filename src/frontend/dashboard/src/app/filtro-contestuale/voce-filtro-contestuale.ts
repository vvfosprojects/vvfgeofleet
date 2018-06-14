export class VoceFiltroContestuale {
    constructor(
        public codice: Object,
        public descrizione: string,
        public cardinalita: number,
        public valori: Object[],
        public tooltip: string = "",
        public badgeCardinalita: string = "badge-info",
        public icona: string = ""
    ) {}
}
