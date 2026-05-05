import { Injectable, signal } from '@angular/core';
import { ImmoData } from '../models/immoData';

@Injectable({
  providedIn: 'root',
})
export class CalcDataService {
  public immoDataSignal = signal<ImmoData>({
    eigenkapital: null,
    kaufpreis: null,
    wohnflaeche: null,
    mieteProQm: null,
    zinssatz: null,
    tilgung: null,
    grunderwerbsteuer: null,
    notarUndGrundbuch: null,
    maklerprovision: null,
    instandhaltungProQw: null,
    instandhaltungPauschal: null,
    instandhaltungisPauschal: false,
  });

  public updateValue(key: keyof ImmoData, newValue: number | null | boolean) {
    this.immoDataSignal.update((actualValue) => {
      return {
        ...actualValue,
        [key]: newValue,
      };
    });
  }
}
