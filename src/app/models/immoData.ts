export interface ImmoData {
  objektTyp: 'haus' | 'wohnung';
  eigenkapital: number | null;
  eigenkapitalMitKaufnebenkostenDecken: boolean;
  kaufpreis: number | null;
  wohnflaeche: number | null;
  mieteProQm: number | null;
  zinssatz: number | null;
  tilgung: number | null;
  grunderwerbsteuer: number | null;
  notarUndGrundbuch: number | null;
  maklerprovision: number | null;
  instandhaltungProQw: number | null;
  instandhaltungPauschal: number | null;
  instandhaltungisPauschal: boolean;
  dataSet: boolean;
  hausgeld: number | null;
  hausgeldNichtUmlagefaehigProzentaneil: number | null;
  hausGeldNichtUmlagefaehigEingabe: number | null;
  hausgeldNichtUmlagefaehigisEingabe: boolean;
}

export interface resultImmoData {
  darlehensbetrag: number | null;
  kaltmiete: number | null;
  quadratmeterpreis: number | null;
  instandhaltungsruecklageQw: number | null;
  instandhaltungsruecklagePauschal: number | null;
  bankrateProJahr: number | null;
  bankrateProMonat: number | null;
  grunderwerbsteuerKosten: number | null;
  notarUndGrundbuchKosten: number | null;
  maklerKosten: number | null;
  faktorCheck: number | null;
  bierdeckelrechnungErgebnisOhneInstandhaltung: number | null;
  bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter: number | null;
  bierdeckelrechnungErgebnisMitInstandhaltungPauschal: number | null;
  direktKosten: number | null;
  darlehensbetragResultInfo: boolean;
  darlehensbetragResultInfoText: number | null;
  hausGeldNichtUmlagefaehig: number | null;
  hausGeldNichtUmlagefaehigWarning: boolean;
}

export interface PinnedData {
  acronym: string;
  subtext: string;
  value: number | null;
  unit: string;
  showPlus: boolean;
  circleColor: 'green' | 'yellow' | 'red' | '';
  showCircle: boolean;
}
