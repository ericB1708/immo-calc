export interface ImmoData {
  eigenkapital: number | null;
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
}
