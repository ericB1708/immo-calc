import { inject, Injectable } from '@angular/core';

import * as pdfMakeLib from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CalcDataService } from './calc-data';

const pdfMake: any = (pdfMakeLib as any).default ? (pdfMakeLib as any).default : pdfMakeLib;

const vfs =
  (pdfFonts as any).pdfMake?.vfs ||
  (pdfFonts as any).vfs ||
  (pdfFonts as any).default?.pdfMake?.vfs ||
  (pdfFonts as any).default?.vfs;

pdfMake.vfs = vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfExportService {
  private calcService = inject(CalcDataService);

  private formatCur(value: number | null): string {
    if (value === null) return '- €';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  }

  public generatePdf() {
    const inputData = this.calcService.immoDataSignal();
    const resultData = this.calcService.resultImmoDataSignal();

    // ==========================================
    // LINKE SPALTE: EINGABEN (Inputs)
    // ==========================================
    const inputStack: any[] = [
      { text: 'DEINE EINGABEN', style: 'columnHeader' },

      { text: 'Objekt & Finanzierung', style: 'subHeader' },
      {
        text: `Objekttyp: ${inputData.objektTyp === 'haus' ? 'Haus' : 'Wohnung'}`,
        style: 'listItem',
      },
      { text: `Eigenkapital: ${this.formatCur(inputData.eigenkapital)}`, style: 'listItem' },
    ];

    inputStack.push(
      {
        text: `Mit EK decken?: ${inputData.eigenkapitalMitKaufnebenkostenDecken ? 'Ja' : 'Nein'}`,
        style: 'listItem',
      },
      { text: `Kaufpreis: ${this.formatCur(inputData.kaufpreis)}`, style: 'listItem' },

      { text: `Wohnfläche: ${inputData.wohnflaeche} m²`, style: 'listItem' },
      { text: `Miete / m²: ${this.formatCur(inputData.mieteProQm)}`, style: 'listItem' },

      { text: 'Instandhaltung', style: 'subHeader' },
    );

    if (inputData.objektTyp === 'wohnung') {
      inputStack.push({
        text: `Hausgeld (gesamt): ${this.formatCur(inputData.hausgeld)}`,
        style: 'listItem',
      });

      if (inputData.hausgeldNichtUmlagefaehigisEingabe) {
        inputStack.push({
          text: `Nicht umlagefähig: ${this.formatCur(inputData.hausGeldNichtUmlagefaehigEingabe)}`,
          style: 'listItem',
        });
      } else {
        inputStack.push({
          text: `Nicht umlagefähig: ${inputData.hausgeldNichtUmlagefaehigProzentaneil} %`,
          style: 'listItem',
        });
      }
    }
    if (inputData.instandhaltungisPauschal) {
      inputStack.push({
        text: `Instandhaltung (pauschal): ${this.formatCur(inputData.instandhaltungPauschal)}`,
        style: 'listItem',
      });
    } else {
      inputStack.push({
        text: `Instandhaltung (pro m²): ${this.formatCur(inputData.instandhaltungProQw)}`,
        style: 'listItem',
      });
    }

    inputStack.push(
      { text: 'Bank', style: 'subHeader' },
      { text: `Zinssatz: ${inputData.zinssatz} %`, style: 'listItem' },
      { text: `Tilgung: ${inputData.tilgung} %`, style: 'listItem' },
      { text: 'Kaufnebenkosten', style: 'subHeader' },
      { text: `Grunderwerbsteuer: ${inputData.grunderwerbsteuer} %`, style: 'listItem' },
      { text: `Notar & Grundbuch: ${inputData.notarUndGrundbuch} %`, style: 'listItem' },
      { text: `Maklerprovision: ${inputData.maklerprovision} %`, style: 'listItem' },
    );

    // ==========================================
    // RECHTE SPALTE: ERGEBNISSE & FORMELN
    // ==========================================
    const outputStack: any[] = [
      { text: 'BERECHNUNGEN & FORMELN', style: 'columnHeader' },

      {
        text: `Faktor-Check: ${resultData.faktorCheck}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      {
        text: 'Kaufpreis / (Kaltmiete * 12)',
        style: 'formulaText',
      },
      {
        text: `${inputData.kaufpreis} / (${resultData.kaltmiete} * 12) = ${resultData.faktorCheck}`,
        style: 'formulaNumbers',
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Cashflow (ohne Instandhaltung): ${this.formatCur(resultData.bierdeckelrechnungErgebnisOhneInstandhaltung)}`,
        style: 'resultHighlight',
      },
    ];

    if (inputData.objektTyp === 'wohnung') {
      outputStack.push(
        { text: 'Formel:', style: 'formulaLabel' },
        {
          text: 'Kaltmiete - Bankrate pro Monat - Hausgeld (nicht umlagefähig)',
          style: 'formulaText',
        },
        {
          text: `${resultData.kaltmiete} - ${resultData.bankrateProMonat} - ${resultData.hausGeldNichtUmlagefaehig} = ${resultData.bierdeckelrechnungErgebnisOhneInstandhaltung}`,
          style: 'formulaNumbers',
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
          ],
          margin: [0, 10, 0, 10],
        },
      );
      if (inputData.instandhaltungisPauschal) {
        outputStack.push(
          {
            text: `Cashflow (Instandhaltung pauschal): ${this.formatCur(resultData.bierdeckelrechnungErgebnisMitInstandhaltungPauschal)}`,
            style: 'resultHighlight',
          },
          { text: 'Formel:', style: 'formulaLabel' },
          {
            text: 'Kaltmiete - Bankrate pro Monat - Hausgeld (nicht umlagefähig) - Instandhaltung Pauschal',
            style: 'formulaText',
          },
          {
            text: `${resultData.kaltmiete} - ${resultData.bankrateProMonat} - ${resultData.hausGeldNichtUmlagefaehig} - ${resultData.instandhaltungsruecklagePauschal} = ${resultData.bierdeckelrechnungErgebnisMitInstandhaltungPauschal}`,
            style: 'formulaNumbers',
          },
        );
      } else {
        outputStack.push(
          {
            text: `Cashflow (mit Instandhaltung/m²): ${this.formatCur(resultData.bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter)}`,
            style: 'resultHighlight',
          },
          { text: 'Formel:', style: 'formulaLabel' },
          {
            text: 'Kaltmiete - Bankrate pro Monat - Hausgeld (nicht umlagefähig) - Instandhaltung/m²',
            style: 'formulaText',
          },
          {
            text: `${resultData.kaltmiete} - ${resultData.bankrateProMonat} - ${resultData.hausGeldNichtUmlagefaehig} - ${resultData.instandhaltungsruecklageQw} = ${resultData.bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter}`,
            style: 'formulaNumbers',
          },
        );
      }
    } else {
      outputStack.push(
        { text: 'Formel:', style: 'formulaLabel' },
        {
          text: 'Kaltmiete - Bankrate pro Monat',
          style: 'formulaText',
        },
        {
          text: `${resultData.kaltmiete} - ${resultData.bankrateProMonat} = ${resultData.bierdeckelrechnungErgebnisOhneInstandhaltung}`,
          style: 'formulaNumbers',
        },
        { text: '', margin: [0, 0, 0, 10] },
      );
      if (inputData.instandhaltungisPauschal) {
        outputStack.push(
          {
            text: `Cashflow (Instandhaltung pauschal): ${this.formatCur(resultData.bierdeckelrechnungErgebnisMitInstandhaltungPauschal)}`,
            style: 'resultHighlight',
          },
          { text: 'Formel:', style: 'formulaLabel' },
          {
            text: 'Kaltmiete - Bankrate pro Monat - Instandhaltung Pauschal',
            style: 'formulaText',
          },
          {
            text: `${resultData.kaltmiete} - ${resultData.bankrateProMonat} - ${resultData.instandhaltungsruecklagePauschal} = ${resultData.bierdeckelrechnungErgebnisMitInstandhaltungPauschal}`,
            style: 'formulaNumbers',
          },
        );
      } else {
        outputStack.push(
          {
            text: `Cashflow (mit Instandhaltung/m²): ${this.formatCur(resultData.bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter)}`,
            style: 'resultHighlight',
          },
          { text: 'Formel:', style: 'formulaLabel' },
          {
            text: 'Kaltmiete - Bankrate pro Monat - Instandhaltung/m²',
            style: 'formulaText',
          },
          {
            text: `${resultData.kaltmiete} - ${resultData.bankrateProMonat} - ${resultData.instandhaltungsruecklageQw} = ${resultData.bierdeckelrechnungErgebnisMitInstandhaltungProQuadratmeter}`,
            style: 'formulaNumbers',
          },
        );
      }
    }

    outputStack.push(
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Kaufnebenkosten (Gesamt): ${this.formatCur(resultData.direktKosten)}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      {
        text: 'Grunderwerbsteuer + Notar & Grundbuch + Makler',
        style: 'formulaText',
      },
      {
        text: `${resultData.grunderwerbsteuerKosten} + ${resultData.notarUndGrundbuchKosten} + ${resultData.maklerKosten} = ${resultData.direktKosten}`,
        style: 'formulaNumbers',
      },
      {
        text: `Info: ${this.calcService.getdarlehensbetragResultInfoText(
          resultData.darlehensbetragResultInfoText,
        )}`,
        style: 'formulaText',
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      { text: 'Zwischenergebnisse', style: 'subHeader' },
      { text: 'Hausinformationskosten', style: 'subHeader' },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Darlehensbetrag: ${this.formatCur(resultData.darlehensbetrag)}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      {
        text: inputData.eigenkapitalMitKaufnebenkostenDecken
          ? 'Kaufpreis + Kaufnebenkosten - Eigenkapital'
          : 'Kaufpreis - Eigenkapital',
        style: 'formulaText',
      },
      {
        text: inputData.eigenkapitalMitKaufnebenkostenDecken
          ? `${inputData.kaufpreis} + ${resultData.direktKosten} - ${inputData.eigenkapital} = ${resultData.darlehensbetrag}`
          : `${inputData.kaufpreis} - ${inputData.eigenkapital} = ${resultData.darlehensbetrag}`,
        style: 'formulaNumbers',
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Kaltmiete (monatlich): ${this.formatCur(resultData.kaltmiete)}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      { text: 'Wohnfläche * Miete pro m²', style: 'formulaText' },
      {
        text: `${inputData.wohnflaeche} * ${inputData.mieteProQm} = ${resultData.kaltmiete}`,
        style: 'formulaNumbers',
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Kaufpreis / m²: ${this.formatCur(resultData.quadratmeterpreis)}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      { text: 'Kaufpreis / Wohnfläche', style: 'formulaText' },
      {
        text: `${inputData.kaufpreis} / ${inputData.wohnflaeche} = ${resultData.quadratmeterpreis}`,
        style: 'formulaNumbers',
      },
    );

    if (inputData.objektTyp === 'wohnung') {
      outputStack.push(
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          text: `Hausgeld (nicht umlagefähig): ${this.formatCur(resultData.hausGeldNichtUmlagefaehig)}`,
          style: 'resultHighlight',
        },
        { text: 'Formel:', style: 'formulaLabel' },
        {
          text: inputData.hausgeldNichtUmlagefaehigisEingabe
            ? 'Direkte Eingabe übernommen'
            : 'Hausgeld (Gesamt) * Prozentanteil',
          style: 'formulaText',
        },
        {
          text: inputData.hausgeldNichtUmlagefaehigisEingabe
            ? `${resultData.hausGeldNichtUmlagefaehig} = ${resultData.hausGeldNichtUmlagefaehig}`
            : `${inputData.hausgeld} * ${inputData.hausgeldNichtUmlagefaehigProzentaneil}% = ${resultData.hausGeldNichtUmlagefaehig}`,
          style: 'formulaNumbers',
        },
      );
    }

    if (inputData.instandhaltungisPauschal) {
      outputStack.push(
        { text: 'Instandhaltungskosten', style: 'subHeader' },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          text: `Rücklage (pauschal pro Monat): ${this.formatCur(resultData.instandhaltungsruecklagePauschal)}`,
          style: 'resultHighlight',
        },
        { text: 'Formel:', style: 'formulaLabel' },
        { text: 'Instandhaltung Pauschal = Eingabe', style: 'formulaText' },
        {
          text: `${inputData.instandhaltungPauschal} = ${resultData.instandhaltungsruecklagePauschal}`,
          style: 'formulaNumbers',
        },
      );
    } else {
      outputStack.push(
        { text: 'Instandhaltungskosten', style: 'subHeader' },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          text: `Rücklage / m² (pro Monat): ${this.formatCur(resultData.instandhaltungsruecklageQw)}`,
          style: 'resultHighlight',
        },
        { text: 'Formel:', style: 'formulaLabel' },
        { text: 'Wohnfläche * Instandhaltung pro Quadratmeter', style: 'formulaText' },
        {
          text: `${inputData.wohnflaeche} * ${inputData.instandhaltungProQw} = ${resultData.instandhaltungsruecklageQw}`,
          style: 'formulaNumbers',
        },
      );
    }

    outputStack.push(
      { text: 'Bankkosten', style: 'subHeader' },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Bankrate (pro Jahr): ${this.formatCur(resultData.bankrateProJahr)}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      {
        text: '(Zins + Tilgung) * Darlehensbetrag',
        style: 'formulaText',
      },
      {
        text: `(${inputData.zinssatz}% + ${inputData.tilgung}%) * ${resultData.darlehensbetrag} = ${resultData.bankrateProJahr}`,
        style: 'formulaNumbers',
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Bankrate (monatlich): ${this.formatCur(resultData.bankrateProMonat)}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      {
        text: 'Bankrate (pro Jahr) / 12',
        style: 'formulaText',
      },
      {
        text: `${resultData.bankrateProJahr} / 12 = ${resultData.bankrateProMonat}`,
        style: 'formulaNumbers',
      },

      { text: 'Direktkosten aufgesplittet', style: 'subHeader' },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Grunderwerbsteuer: ${this.formatCur(resultData.grunderwerbsteuerKosten)}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      {
        text: 'Grunderwerbsteueranteil * Kaufpreis',
        style: 'formulaText',
      },
      {
        text: `${inputData.grunderwerbsteuer}% * ${inputData.kaufpreis} = ${resultData.grunderwerbsteuerKosten}`,
        style: 'formulaNumbers',
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Notar & Grundbuch: ${this.formatCur(resultData.notarUndGrundbuchKosten)}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      {
        text: 'Notar & Grundbuchanteil * Kaufpreis',
        style: 'formulaText',
      },
      {
        text: `${inputData.notarUndGrundbuch}% * ${inputData.kaufpreis} = ${resultData.notarUndGrundbuchKosten}`,
        style: 'formulaNumbers',
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 230, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
        ],
        margin: [0, 10, 0, 10],
      },
      {
        text: `Makler: ${this.formatCur(resultData.maklerKosten)}`,
        style: 'resultHighlight',
      },
      { text: 'Formel:', style: 'formulaLabel' },
      {
        text: 'Maklerprovision * Kaufpreis',
        style: 'formulaText',
      },
      {
        text: `${inputData.maklerprovision}% * ${inputData.kaufpreis} = ${resultData.maklerKosten}`,
        style: 'formulaNumbers',
      },
    );

    // ==========================================
    // PDF DOKUMENT DEFINITION
    // ==========================================
    const docDefinition: any = {
      info: {
        title: 'Immobilien Kalkulation',
        author: 'Immo App',
      },
      pageMargins: [40, 60, 40, 60],

      content: [
        { text: 'Immobilien Kalkulation', style: 'mainHeader' },
        { text: `Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, style: 'dateText' },

        {
          canvas: [
            { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#f97316' },
          ],
        },
        { text: '', margin: [0, 0, 0, 20] },

        {
          columns: [
            { width: '45%', stack: inputStack },
            { width: '10%', text: '' },
            { width: '45%', stack: outputStack },
          ],
        },
      ],
      styles: {
        mainHeader: { fontSize: 24, bold: true, color: '#111827' },
        dateText: { fontSize: 10, color: '#6b7280', margin: [0, 5, 0, 10] },

        columnHeader: {
          fontSize: 16,
          bold: true,
          color: '#f97316',
          margin: [0, 0, 0, 15],
          textTransform: 'uppercase',
        },
        subHeader: {
          fontSize: 12,
          bold: true,
          color: '#374151',
          margin: [0, 10, 0, 5],
          decoration: 'underline',
        },
        listItem: { fontSize: 10, color: '#4b5563', margin: [0, 3, 0, 3] },

        resultHighlight: { fontSize: 12, bold: true, color: '#111827', margin: [0, 0, 0, 2] },
        formulaLabel: { fontSize: 9, bold: true, color: '#9ca3af', margin: [0, 2, 0, 0] },
        formulaText: { fontSize: 9, italics: true, color: '#6b7280', margin: [0, 1, 0, 1] },
        formulaNumbers: { fontSize: 10, bold: true, color: '#f97316', margin: [0, 1, 0, 5] },
      },
    };

    pdfMake.createPdf(docDefinition).download('Immo-Kalkulation.pdf');
  }
}
