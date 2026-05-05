import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bottom-nav-bar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './bottom-nav-bar.html',
  styleUrl: './bottom-nav-bar.scss',
})
export class BottomNavBarComponent {}
