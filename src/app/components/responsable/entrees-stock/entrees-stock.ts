import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarResponsableComponent } from '../sidebar-responsable.component';

@Component({
  selector: 'entrees-stock',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarResponsableComponent],
  templateUrl: './entrees-stock.html',
  styleUrls: ['./entrees-stock.css']
})
export class EntreesStockComponent implements OnInit {
  entrees: any[] = [];

  ngOnInit() {
    // À remplacer par service :
    this.entrees = JSON.parse(localStorage.getItem('entreesStock') || '[]');
  }

  deleteEntree(id: string) {
    this.entrees = this.entrees.filter(e => e.id !== id);
    localStorage.setItem('entreesStock', JSON.stringify(this.entrees));
  }
}
