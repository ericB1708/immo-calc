import { Component } from '@angular/core';
import { BottomNavBarComponent } from '../../components/bottom-nav-bar/bottom-nav-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [BottomNavBarComponent, RouterOutlet],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPageComponent {}
