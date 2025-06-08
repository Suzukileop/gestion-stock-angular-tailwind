import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarResponsableComponent } from '../sidebar-responsable.component';
import { EntreeStockService } from '../../../services/entree-stock.service';

@Component({
  selector: 'entrees-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, SidebarResponsableComponent],
  templateUrl: './entrees-stock.html',
  styleUrls: ['./entrees-stock.css']
})
export class EntreesStockComponent implements OnInit {
  entrees: any[] = [];
  selectedEntree: any | null = null;
  showCreateModal: boolean = false;
  newEntree: any = this.getEmptyEntree();
  newLigne: any = this.getEmptyLigne();

  searchTerm: string = '';
  filterStatut: string = '';
  filterMarchandise: string = '';
  filterDate: string = '';
  currentPage: number = 1;
  pageSize: number = 9;

  viewMode: 'cards' | 'table' = 'cards';

  constructor(private entreeStockService: EntreeStockService) {}

  ngOnInit() {
    this.entrees = this.entreeStockService.getAll();
  }

  deleteEntree(id: string) {
    this.entreeStockService.delete(id);
    this.entrees = this.entreeStockService.getAll();
  }

  openDetail(entree: any) {
    this.selectedEntree = entree;
  }

  closeDetail() {
    this.selectedEntree = null;
  }

  openCreateModal() {
    this.resetCreateForm();
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetCreateForm();
  }

  getEmptyEntree() {
    return {
      numero_piece: '',
      date_entree: '',
      marchandise: '',
      statut: 'BROUILLON',
      lignes: []
    };
  }

  getEmptyLigne() {
    return { designation: '', quantite: 1, prix_unitaire: 0, magasin: '', etagere: '' };
  }

  resetCreateForm() {
    this.newEntree = this.getEmptyEntree();
    this.newLigne = this.getEmptyLigne();
  }

  addLigneToNewEntree() {
    if (!this.newEntree.lignes) this.newEntree.lignes = [];
    this.newEntree.lignes.push({ ...this.newLigne });
    this.newLigne = this.getEmptyLigne();
  }

  removeLigneFromNewEntree(i: number) {
    this.newEntree.lignes.splice(i, 1);
  }

  createEntree(entree: any) {
    entree.id = crypto.randomUUID();
    entree.date_entree = entree.date_entree || new Date().toISOString();
    this.entreeStockService.add(entree);
    this.entrees = this.entreeStockService.getAll();
    this.closeCreateModal();
  }

  get filteredEntrees(): any[] {
    let result = this.entrees;
    // Recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e =>
        (e.numero_piece && e.numero_piece.toLowerCase().includes(term)) ||
        (e.marchandise && e.marchandise.toLowerCase().includes(term))
      );
    }
    // Filtre statut
    if (this.filterStatut) {
      result = result.filter(e => e.statut === this.filterStatut);
    }
    // Filtre marchandise
    if (this.filterMarchandise) {
      const march = this.filterMarchandise.toLowerCase();
      result = result.filter(e => e.marchandise && e.marchandise.toLowerCase().includes(march));
    }
    // Filtre date exacte
    if (this.filterDate) {
      result = result.filter(e => e.date_entree && e.date_entree.startsWith(this.filterDate));
    }
    // Tri par date (plus récent d'abord)
    result = result.slice().sort((a, b) => new Date(b.date_entree).getTime() - new Date(a.date_entree).getTime());
    // Pagination
    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    let result = this.entrees;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e =>
        (e.numero_piece && e.numero_piece.toLowerCase().includes(term)) ||
        (e.marchandise && e.marchandise.toLowerCase().includes(term))
      );
    }
    if (this.filterStatut) {
      result = result.filter(e => e.statut === this.filterStatut);
    }
    if (this.filterMarchandise) {
      const march = this.filterMarchandise.toLowerCase();
      result = result.filter(e => e.marchandise && e.marchandise.toLowerCase().includes(march));
    }
    if (this.filterDate) {
      result = result.filter(e => e.date_entree && e.date_entree.startsWith(this.filterDate));
    }
    return Math.ceil(result.length / this.pageSize) || 1;
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'cards' ? 'table' : 'cards';
  }
}
