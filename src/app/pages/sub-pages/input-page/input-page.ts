import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InputContainerComponent } from '../../../components/input-container/input-container';
import { CalcDataService } from '../../../services/calc-data';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-page',
  imports: [InputContainerComponent, MatSlideToggleModule, NgIf],
  templateUrl: './input-page.html',
  styleUrl: './input-page.scss',
})
export class InputPageComponent {
  public calcDataService = inject(CalcDataService);
  public router = inject(Router);
  public showValidationError = false;

  onClickbuttonCalc() {
    if (this.isFormValid()) {
      this.calcDataService.calcResultValues();
      if (!this.calcDataService.resultImmoDataSignal().hausGeldNichtUmlagefaehigWarning) {
        this.router.navigate(['/main-page/result']);
      }
    } else {
      this.showValidationError = true;
    }
  }

  isFormValid(): boolean {
    const setData = this.calcDataService.immoDataSignal();

    const baseValid =
      setData.eigenkapital !== null &&
      setData.kaufpreis !== null &&
      setData.wohnflaeche !== null &&
      setData.mieteProQm !== null &&
      setData.zinssatz !== null &&
      setData.tilgung !== null &&
      setData.grunderwerbsteuer !== null &&
      setData.notarUndGrundbuch !== null &&
      setData.maklerprovision !== null;

    if (!baseValid) return false;

    if (setData.instandhaltungisPauschal) {
      if (setData.instandhaltungPauschal === null) return false;
    } else {
      if (setData.instandhaltungProQw === null) return false;
    }

    if (setData.objektTyp === 'wohnung') {
      if (setData.hausgeld === null) return false;
      if (setData.hausgeldNichtUmlagefaehigisEingabe) {
        if (setData.hausGeldNichtUmlagefaehigEingabe === null) return false;
      } else {
        if (setData.hausgeldNichtUmlagefaehigProzentaneil === null) return false;
      }
    }

    return true;
  }
}
