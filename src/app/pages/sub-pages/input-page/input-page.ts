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

  onClickbuttonCalc() {
    this.calcDataService.calcResultValues();
    if (!this.calcDataService.resultImmoDataSignal().hausGeldNichtUmlagefaehigWarning) {
      this.router.navigate(['/main-page/result']);
    }
  }
}
