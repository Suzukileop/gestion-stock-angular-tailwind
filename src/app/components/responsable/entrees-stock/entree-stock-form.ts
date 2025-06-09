import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'entree-stock-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entree-stock-form.html',
})
export class EntreeStockFormComponent {
  entree: any = {
    numero_piece: '',
    date_entree: '',
    marchandise: '',
    statut: 'BROUILLON',
    lignes: []
  };
  ligne: any = { designation: '', quantite: 1, prix_unitaire: 0, magasin: '', etagere: '' };
  lignes: any[] = [];

  constructor(private router: Router) {}

  addLigne() {
    this.lignes.push({ ...this.ligne });
    this.ligne = { designation: '', quantite: 1, prix_unitaire: 0, magasin: '', etagere: '' };
  }

  removeLigne(i: number) {
    this.lignes.splice(i, 1);
  }

  save() {
    this.entree.lignes = this.lignes;
    const entrees = JSON.parse(localStorage.getItem('entreesStock') || '[]');
    this.entree.id = crypto.randomUUID();
    this.entree.date_entree = this.entree.date_entree || new Date().toISOString();
    entrees.push(this.entree);
    localStorage.setItem('entreesStock', JSON.stringify(entrees));
    this.router.navigate(['/responsable/entrees-stock']);
  }
}
