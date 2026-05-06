import { Injectable, signal } from '@angular/core';
import { ImmoData, resultImmoData } from '../models/immoData';

@Injectable({
  providedIn: 'root',
})
export class CalcDataService {
  public immoDataSignal = signal<ImmoData>({
    eigenkapital: 100000,
    kaufpreis: 597000,
    wohnflaeche: 284,
    mieteProQm: 8.5,
    zinssatz: 4,
    tilgung: 1.5,
    grunderwerbsteuer: 5,
    notarUndGrundbuch: 2,
    maklerprovision: 4.2,
    instandhaltungProQw: 2.0,
    instandhaltungPauschal: 250,
    instandhaltungisPauschal: false,
    dataSet: false,
  });

  public resultImmoDataSignal = signal<resultImmoData>({
    kaufpreisAbzueglichEigenkapital: null,
    kaltmiete: null,
    quadratmeterpreis: null,
    instandhaltungsruecklageQw: null,
    instandhaltungsruecklagePauschal: null,
    bankrateProJahr: null,
    bankrateProMonat: null,
    grunderwerbsteuerKosten: null,
    notarUndGrundbuchKosten: null,
    maklerKosten: null,
    faktorCheck: null,
    bierdeckelrechnungErgebnisOhneInstandhaltung: null,
    bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter: null,
    bierdeckelrechnungErgebnisMitInstandhaltungPauschal: null,
    direktKosten: null,
  });

  public pinnedItemsSignal = signal<string[]>([]);

  public calcResultValues() {
    this.immoDataSignal.update((currentData) => ({
      ...currentData,
      dataSet: true,
    }));
    this.calcKaufpreisAbzueglichEigenkapital();
    this.calcKaltmiete();
    this.calcQuadratmeterpreis();
    this.calcInstandhaltungsruecklageQw();
    this.calcInstandhaltungsruecklagePauschal();
    this.calcBankrateProJahr();
    this.calcBankrateProMonat();
    this.calcGrunderwerbsteuerKosten();
    this.calcNotarUndGrundbuchKosten();
    this.calcMaklerKosten();
    this.calcFaktorCheck();
    this.calcbierdeckelrechnungErgebnisOhneInstandhaltung();
    this.calcbierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter();
    this.calcbierdeckelrechnungErgebnisMitInstandhaltungPauschal();
    this.calcDirektKosten();
  }

  public togglePin(itemKey: string) {
    const currentPinned = this.pinnedItemsSignal();

    if (currentPinned.includes(itemKey)) {
      this.pinnedItemsSignal.update((items) => items.filter((key) => key !== itemKey));
    } else {
      if (currentPinned.length < 2) {
        this.pinnedItemsSignal.update((items) => [...items, itemKey]);
      }
    }
  }

  private calcKaufpreisAbzueglichEigenkapital() {
    const immoData = this.immoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      kaufpreisAbzueglichEigenkapital:
        immoData.kaufpreis !== null
          ? immoData.eigenkapital !== null
            ? immoData.kaufpreis - immoData.eigenkapital
            : immoData.kaufpreis
          : null,
    }));
  }
  private calcKaltmiete() {
    const immoData = this.immoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      kaltmiete:
        immoData.wohnflaeche !== null && immoData.mieteProQm !== null
          ? Number((immoData.wohnflaeche * immoData.mieteProQm).toFixed(2))
          : null,
    }));
  }
  private calcQuadratmeterpreis() {
    const immoData = this.immoDataSignal();
    let gerundeterPreis: number | null = null;

    if (immoData.wohnflaeche !== null && immoData.wohnflaeche > 0 && immoData.kaufpreis !== null) {
      const roherPreis = immoData.kaufpreis / immoData.wohnflaeche;
      gerundeterPreis = Number(roherPreis.toFixed(2));
    }

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      quadratmeterpreis: gerundeterPreis,
    }));
  }
  private calcInstandhaltungsruecklageQw() {
    const immoData = this.immoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      instandhaltungsruecklageQw:
        immoData.instandhaltungProQw !== null && immoData.wohnflaeche !== null
          ? Number((immoData.instandhaltungProQw * immoData.wohnflaeche).toFixed(2))
          : null,
    }));
  }
  private calcInstandhaltungsruecklagePauschal() {
    const immoData = this.immoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      instandhaltungsruecklagePauschal: immoData.instandhaltungPauschal
        ? immoData.instandhaltungPauschal
        : null,
    }));
  }
  private calcBankrateProJahr() {
    const immoData = this.immoDataSignal();
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bankrateProJahr:
        immoData.zinssatz !== null &&
        immoData.tilgung !== null &&
        resultImmoData.kaufpreisAbzueglichEigenkapital !== null
          ? Number(
              (
                (immoData.zinssatz * 0.01 + immoData.tilgung * 0.01) *
                resultImmoData.kaufpreisAbzueglichEigenkapital
              ).toFixed(2),
            )
          : null,
    }));
  }
  private calcBankrateProMonat() {
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bankrateProMonat:
        resultImmoData.bankrateProJahr !== null
          ? Number((resultImmoData.bankrateProJahr / 12).toFixed(2))
          : null,
    }));
  }
  private calcGrunderwerbsteuerKosten() {
    const immoData = this.immoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      grunderwerbsteuerKosten:
        immoData.grunderwerbsteuer !== null && immoData.kaufpreis !== null
          ? immoData.grunderwerbsteuer * 0.01 * immoData.kaufpreis
          : null,
    }));
  }
  private calcNotarUndGrundbuchKosten() {
    const immoData = this.immoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      notarUndGrundbuchKosten:
        immoData.notarUndGrundbuch !== null && immoData.kaufpreis !== null
          ? immoData.notarUndGrundbuch * 0.01 * immoData.kaufpreis
          : null,
    }));
  }
  private calcMaklerKosten() {
    const immoData = this.immoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      maklerKosten:
        immoData.maklerprovision !== null && immoData.kaufpreis !== null
          ? immoData.maklerprovision * 0.01 * immoData.kaufpreis
          : null,
    }));
  }
  private calcFaktorCheck() {
    const immoData = this.immoDataSignal();
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      faktorCheck:
        immoData.kaufpreis !== null && resultImmoData.kaltmiete !== null
          ? Number((immoData.kaufpreis / (resultImmoData.kaltmiete * 12)).toFixed(0))
          : null,
    }));
  }
  private calcbierdeckelrechnungErgebnisOhneInstandhaltung() {
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bierdeckelrechnungErgebnisOhneInstandhaltung:
        resultImmoData.kaltmiete !== null && resultImmoData.bankrateProMonat !== null
          ? Number((resultImmoData.kaltmiete - resultImmoData.bankrateProMonat).toFixed(2))
          : null,
    }));
  }
  private calcbierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter() {
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter:
        resultImmoData.kaltmiete !== null &&
        resultImmoData.bankrateProMonat !== null &&
        resultImmoData.instandhaltungsruecklageQw !== null
          ? Number(
              (
                resultImmoData.kaltmiete -
                resultImmoData.bankrateProMonat -
                resultImmoData.instandhaltungsruecklageQw
              ).toFixed(2),
            )
          : null,
    }));
  }
  private calcbierdeckelrechnungErgebnisMitInstandhaltungPauschal() {
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bierdeckelrechnungErgebnisMitInstandhaltungPauschal:
        resultImmoData.kaltmiete !== null &&
        resultImmoData.bankrateProMonat !== null &&
        resultImmoData.instandhaltungsruecklagePauschal !== null
          ? Number(
              (
                resultImmoData.kaltmiete -
                resultImmoData.bankrateProMonat -
                resultImmoData.instandhaltungsruecklagePauschal
              ).toFixed(2),
            )
          : null,
    }));
  }

  private calcDirektKosten() {
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      direktKosten:
        resultImmoData.grunderwerbsteuerKosten !== null &&
        resultImmoData.notarUndGrundbuchKosten !== null &&
        resultImmoData.maklerKosten !== null
          ? Number(
              (
                resultImmoData.grunderwerbsteuerKosten +
                resultImmoData.notarUndGrundbuchKosten +
                resultImmoData.maklerKosten
              ).toFixed(2),
            )
          : null,
    }));
  }

  public updateValue(key: keyof ImmoData, newValue: number | null | boolean) {
    this.immoDataSignal.update((actualValue) => {
      return {
        ...actualValue,
        [key]: newValue,
      };
    });
  }
}
