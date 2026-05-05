import { Component, inject } from '@angular/core';
import { InputContainerComponent } from '../../../components/input-container/input-container';
import { CalcDataService } from '../../../services/calc-data';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-input-page',
  imports: [InputContainerComponent, MatSlideToggleModule],
  templateUrl: './input-page.html',
  styleUrl: './input-page.scss',
})
export class InputPageComponent {
  public calcDataService = inject(CalcDataService);

}
