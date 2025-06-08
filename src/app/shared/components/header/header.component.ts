import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  menuOpen = false;
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
} 