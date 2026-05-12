import { computed, Injectable, numberAttribute, signal } from '@angular/core';
import { ImmoData, PinnedData, resultImmoData } from '../models/immoData';
import { bufferTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalcDataService {
  public immoDataSignal = signal<ImmoData>({
    objektTyp: 'haus',
    eigenkapital: null,
    eigenkapitalMitKaufnebenkostenDecken: true,
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
    dataSet: false,
    hausgeld: null,
    hausgeldNichtUmlagefaehigProzentaneil: null,
    hausGeldNichtUmlagefaehigEingabe: null,
    hausgeldNichtUmlagefaehigisEingabe: false,
  });

  public resultImmoDataSignal = signal<resultImmoData>({
    darlehensbetrag: null,
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
    darlehensbetragResultInfo: false,
    darlehensbetragResultInfoText: null,
    hausGeldNichtUmlagefaehig: null,
    hausGeldNichtUmlagefaehigWarning: false,
  });

  public pinnedItemsSignal = signal<string[]>([]);

  public pinnedDisplayItems = computed<PinnedData[]>(() => {
    const pinnedList = this.pinnedItemsSignal();
    const listLength = pinnedList.length;

    let returnList: PinnedData[] = [];

    for (let index = 0; index < listLength; index++) {
      let pinnedItem: PinnedData = {
        acronym: '',
        subtext: '',
        value: null,
        unit: '',
        showPlus: false,
        circleColor: '',
        showCircle: false,
      };
      switch (pinnedList[index]) {
        case 'faktorCheck':
          pinnedItem.acronym = 'Faktor-Check';
          pinnedItem.subtext = this.getFactorText(this.resultImmoDataSignal().faktorCheck);
          pinnedItem.value = this.resultImmoDataSignal().faktorCheck;
          pinnedItem.circleColor = this.getFactorColor(this.resultImmoDataSignal().faktorCheck);
          pinnedItem.showCircle = true;
          break;
        case 'bierdeckelOhneInst':
          pinnedItem.acronym = 'Cashflow (ohne Inst.)';
          pinnedItem.value =
            this.resultImmoDataSignal().bierdeckelrechnungErgebnisOhneInstandhaltung;
          pinnedItem.circleColor = this.getStandardColor(
            this.resultImmoDataSignal().bierdeckelrechnungErgebnisOhneInstandhaltung,
          );
          pinnedItem.showCircle = true;
          pinnedItem.unit = '€';
          pinnedItem.showPlus = true;
          break;
        case 'bierdeckelMitInstProQm':
          pinnedItem.acronym = 'Cashflow (mit Inst./m²)';
          pinnedItem.value =
            this.resultImmoDataSignal().bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter;
          pinnedItem.circleColor = this.getStandardColor(
            this.resultImmoDataSignal().bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter,
          );
          pinnedItem.showCircle = true;
          pinnedItem.unit = '€';
          pinnedItem.showPlus = true;
          break;
        case 'bierdeckelMitInstPaus':
          pinnedItem.acronym = 'Cashflow (Inst. pauschal)';
          pinnedItem.value =
            this.resultImmoDataSignal().bierdeckelrechnungErgebnisMitInstandhaltungPauschal;
          pinnedItem.circleColor = this.getStandardColor(
            this.resultImmoDataSignal().bierdeckelrechnungErgebnisMitInstandhaltungPauschal,
          );
          pinnedItem.showCircle = true;
          pinnedItem.unit = '€';
          pinnedItem.showPlus = true;
          break;
        case 'direktKosten':
          pinnedItem.acronym = 'Kaufnebenkosten';
          pinnedItem.value = this.resultImmoDataSignal().direktKosten;
          pinnedItem.unit = '€';
          break;
        case 'kaufpreisAbzueglichEigenkapital':
          pinnedItem.acronym = 'Darlehensbetrag';
          pinnedItem.value = this.resultImmoDataSignal().darlehensbetrag;
          pinnedItem.unit = '€';
          break;
        case 'kaltmiete':
          pinnedItem.acronym = 'Kaltmiete';
          pinnedItem.value = this.resultImmoDataSignal().kaltmiete;
          pinnedItem.unit = '€';
          break;
        case 'quadratmeterpreis':
          pinnedItem.acronym = 'Preis / m²';
          pinnedItem.value = this.resultImmoDataSignal().quadratmeterpreis;
          pinnedItem.unit = '€';
          break;
        case 'instandhaltungsruecklageQw':
          pinnedItem.acronym = 'Instandhaltung / m²';
          pinnedItem.value = this.resultImmoDataSignal().instandhaltungsruecklageQw;
          pinnedItem.unit = '€';
          break;
        case 'instandhaltungsruecklagePauschal':
          pinnedItem.acronym = 'Instandhaltung (pausch.)';
          pinnedItem.value = this.resultImmoDataSignal().instandhaltungsruecklagePauschal;
          pinnedItem.unit = '€';
          break;
        case 'bankrateProJahr':
          pinnedItem.acronym = 'Bankrate (p.a.)';
          pinnedItem.value = this.resultImmoDataSignal().bankrateProJahr;
          pinnedItem.unit = '€';
          break;
        case 'bankrateProMonat':
          pinnedItem.acronym = 'Bankrate (mtl.)';
          pinnedItem.value = this.resultImmoDataSignal().bankrateProMonat;
          pinnedItem.unit = '€';
          break;
        case 'grunderwerbsteuerKosten':
          pinnedItem.acronym = 'Grunderwerbsteuer';
          pinnedItem.value = this.resultImmoDataSignal().grunderwerbsteuerKosten;
          pinnedItem.unit = '€';
          break;
        case 'notarUndGrundbuchKosten':
          pinnedItem.acronym = 'Notar & Grundbuch';
          pinnedItem.value = this.resultImmoDataSignal().notarUndGrundbuchKosten;
          pinnedItem.unit = '€';
          break;
        case 'maklerKosten':
          pinnedItem.acronym = 'Maklerprovision';
          pinnedItem.value = this.resultImmoDataSignal().maklerKosten;
          pinnedItem.unit = '€';
          break;
        case 'hausGeldNichtUmlagefaehig':
          pinnedItem.acronym = 'Hausgeld nicht umlagefähig';
          pinnedItem.value = this.resultImmoDataSignal().hausGeldNichtUmlagefaehig;
          pinnedItem.unit = '€';
          break;
        default:
          break;
      }
      returnList.push(pinnedItem);
    }
    return returnList;
  });

  getFactorText(value: number | null): string {
    if (value === null) return '';
    if (value <= 20) return 'Guter Deal';
    if (value > 20 && value <= 25) return 'Marktüblich / Okay';
    return 'Zu Teuer';
  }

  getStandardColor(value: number | null): 'green' | 'red' | '' {
    if (value === null) return '';
    return value >= 0 ? 'green' : 'red';
  }

  getFactorColor(value: number | null): 'green' | 'yellow' | 'red' | '' {
    if (value === null) return '';
    if (value <= 20) return 'green';
    if (value > 20 && value <= 25) return 'yellow';
    return 'red';
  }

  getdarlehensbetragResultInfoTextColor(value: number | null): 'green' | 'orange' | 'red' | '' {
    if (value === null) return '';
    if (value == 1) return 'green';
    if (value == 2) return 'orange';
    if (value == 3) return 'red';
    return '';
  }

  getdarlehensbetragResultInfoText(value: number | null): string {
    if (value === null) return '';
    if (value == 1) return 'Kaufnebenkosten komplett gedeckt mit Eigenkapital';
    if (value == 2) return 'Kaufnebenkosten noch als Eigenkapital notwendig';
    if (value == 3) return 'Achtung 110% Finanzierung';
    return '';
  }

  public calcResultValues() {
    this.immoDataSignal.update((currentData) => ({
      ...currentData,
      dataSet: true,
    }));
    this.calcGrunderwerbsteuerKosten();
    this.calcNotarUndGrundbuchKosten();
    this.calcMaklerKosten();
    this.calcDirektKosten();
    this.darlehensbetrag();
    this.calcKaltmiete();
    this.calcQuadratmeterpreis();
    this.calcInstandhaltungsruecklageQw();
    this.calcInstandhaltungsruecklagePauschal();
    this.calcBankrateProJahr();
    this.calcBankrateProMonat();
    this.calcFaktorCheck();

    if (this.immoDataSignal().objektTyp === 'haus') {
      this.calcbierdeckelrechnungErgebnisOhneInstandhaltung();
      this.calcbierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter();
      this.calcbierdeckelrechnungErgebnisMitInstandhaltungPauschal();
    }

    if (this.immoDataSignal().objektTyp === 'wohnung') {
      this.calcHausgeldNichtUmlagefähig();
      this.calcbierdeckelrechnungErgebnisOhneInstandhaltungWohnung();
      this.calcbierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeterWohnung();
      this.calcbierdeckelrechnungErgebnisMitInstandhaltungPauschalWohnung();
    }
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

  private calcHausgeldNichtUmlagefähig() {
    const immoData = this.immoDataSignal();
    let hausgeldNichtUmlagefaehigResult: number | null = null;
    let warning = false;
    if (!immoData.hausgeldNichtUmlagefaehigisEingabe) {
      if (immoData.hausgeldNichtUmlagefaehigProzentaneil !== null && immoData.hausgeld !== null) {
        hausgeldNichtUmlagefaehigResult =
          immoData.hausgeld * immoData.hausgeldNichtUmlagefaehigProzentaneil * 0.01;
      }
    } else {
      if (immoData.hausgeld !== null && immoData.hausGeldNichtUmlagefaehigEingabe !== null) {
        if (immoData.hausgeld > immoData.hausGeldNichtUmlagefaehigEingabe) {
          hausgeldNichtUmlagefaehigResult = immoData.hausGeldNichtUmlagefaehigEingabe;
        } else {
          warning = true;
        }
      }
    }
    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      hausGeldNichtUmlagefaehig: hausgeldNichtUmlagefaehigResult,
      hausGeldNichtUmlagefaehigWarning: warning,
    }));
  }

  private darlehensbetrag() {
    const immoData = this.immoDataSignal();
    const currentResultData = this.resultImmoDataSignal();
    let darlehensbetragResult: number | null = null;
    let info = false;
    let infoText: number | null = null;

    if (immoData.kaufpreis !== null && immoData.eigenkapital !== null) {
      if (immoData.eigenkapitalMitKaufnebenkostenDecken) {
        if (this.resultImmoDataSignal().direktKosten !== null) {
          if (currentResultData.direktKosten !== null) {
            darlehensbetragResult =
              immoData.kaufpreis + currentResultData.direktKosten - immoData.eigenkapital;
            if (darlehensbetragResult < 0) {
              darlehensbetragResult = 0;
            }

            if (currentResultData.direktKosten > immoData.eigenkapital) {
              info = true;
              infoText = 3;
            } else if (currentResultData.direktKosten <= immoData.eigenkapital) {
              info = true;
              infoText = 1;
            }
          } else {
          }
        }
      } else {
        darlehensbetragResult = immoData.kaufpreis - immoData.eigenkapital;
        info = true;
        infoText = 2;
      }
      this.resultImmoDataSignal.update((currentData) => ({
        ...currentData,
        darlehensbetrag: darlehensbetragResult,
        darlehensbetragResultInfo: info,
        darlehensbetragResultInfoText: infoText,
      }));
    }
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
    let resultBankrateProJahr: number | null = null;

    if (
      immoData.zinssatz !== null &&
      immoData.tilgung !== null &&
      resultImmoData.darlehensbetrag !== null
    ) {
      if (immoData.kaufpreis !== null && immoData.eigenkapital !== null) {
        if (immoData.kaufpreis + resultImmoData.darlehensbetrag - immoData.eigenkapital <= 0) {
          resultBankrateProJahr = 0;
        } else {
          resultBankrateProJahr = Number(
            (
              (immoData.zinssatz * 0.01 + immoData.tilgung * 0.01) *
              resultImmoData.darlehensbetrag
            ).toFixed(2),
          );
        }
      }
    }
    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bankrateProJahr: resultBankrateProJahr,
    }));
  }
  private calcBankrateProMonat() {
    const resultImmoData = this.resultImmoDataSignal();
    let resultBankrateProMonat: number | null = null;

    if (resultImmoData.bankrateProJahr !== null) {
      if (resultImmoData.bankrateProJahr == 0) {
        resultBankrateProMonat = 0;
      } else {
        resultBankrateProMonat = Number((resultImmoData.bankrateProJahr / 12).toFixed(2));
      }
    }

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bankrateProMonat: resultBankrateProMonat,
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

  private calcbierdeckelrechnungErgebnisOhneInstandhaltungWohnung() {
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bierdeckelrechnungErgebnisOhneInstandhaltung:
        resultImmoData.kaltmiete !== null &&
        resultImmoData.bankrateProMonat !== null &&
        resultImmoData.hausGeldNichtUmlagefaehig !== null
          ? Number(
              (
                resultImmoData.kaltmiete -
                resultImmoData.bankrateProMonat -
                resultImmoData.hausGeldNichtUmlagefaehig
              ).toFixed(2),
            )
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
  private calcbierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeterWohnung() {
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter:
        resultImmoData.kaltmiete !== null &&
        resultImmoData.bankrateProMonat !== null &&
        resultImmoData.instandhaltungsruecklageQw !== null &&
        resultImmoData.hausGeldNichtUmlagefaehig !== null
          ? Number(
              (
                resultImmoData.kaltmiete -
                resultImmoData.bankrateProMonat -
                resultImmoData.instandhaltungsruecklageQw -
                resultImmoData.hausGeldNichtUmlagefaehig
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
  private calcbierdeckelrechnungErgebnisMitInstandhaltungPauschalWohnung() {
    const resultImmoData = this.resultImmoDataSignal();

    this.resultImmoDataSignal.update((currentData) => ({
      ...currentData,
      bierdeckelrechnungErgebnisMitInstandhaltungPauschal:
        resultImmoData.kaltmiete !== null &&
        resultImmoData.bankrateProMonat !== null &&
        resultImmoData.instandhaltungsruecklagePauschal !== null &&
        resultImmoData.hausGeldNichtUmlagefaehig !== null
          ? Number(
              (
                resultImmoData.kaltmiete -
                resultImmoData.bankrateProMonat -
                resultImmoData.instandhaltungsruecklagePauschal -
                resultImmoData.hausGeldNichtUmlagefaehig
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

  public updateValue(key: keyof ImmoData, newValue: number | null | boolean | string) {
    this.immoDataSignal.update((actualValue) => {
      return {
        ...actualValue,
        [key]: newValue,
      };
    });
  }
}
