import { Component, inject, OnInit } from '@angular/core';
import { ResultContainerComponent } from '../../../components/result-container/result-container';
import { CalcDataService } from '../../../services/calc-data';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { PinnedItemContainer } from '../../../components/pinned-item-container/pinned-item-container';
import { PdfExportService } from '../../../services/pdf-export-service';

@Component({
  selector: 'app-result-page',
  imports: [ResultContainerComponent, NgIf, PinnedItemContainer],
  templateUrl: './result-page.html',
  styleUrl: './result-page.scss',
})
export class ResultPageComponent implements OnInit {
  public calcDataService = inject(CalcDataService);
  private pdfexport = inject(PdfExportService);
  private router = inject(Router);

  ngOnInit(): void {
    if (!this.calcDataService.immoDataSignal().dataSet) {
      this.router.navigate(['/main-page/calc']);
    }
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

  getFactorText(value: number | null): string {
    if (value === null) return '';
    if (value <= 20) return 'Guter Deal';
    if (value > 20 && value <= 25) return 'Marktüblich / Okay';
    return 'Zu Teuer';
  }

  clickDownlaodPdf() {
    this.pdfexport.generatePdf();
  }
}
