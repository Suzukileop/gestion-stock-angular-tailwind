import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarResponsableComponent } from '../sidebar-responsable.component';
import { EntreeStockService } from '../../../services/entree-stock.service';

@Component({
  selector: 'entrees-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarResponsableComponent],
  templateUrl: './entrees-stock.html',
  styleUrls: ['./entrees-stock.css']
})
export class EntreesStockComponent implements OnInit {
  pieces: any[] = [];
  selectedPiece: any | null = null;
  showCreateModal: boolean = false;
  newPiece: any = this.getEmptyPiece();
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
    this.pieces = this.entreeStockService.getAll();
  }

  deletePiece(id: string) {
    this.entreeStockService.delete(id);
    this.pieces = this.entreeStockService.getAll();
  }

  openDetail(piece: any) {
    this.selectedPiece = piece;
  }

  closeDetail() {
    this.selectedPiece = null;
  }

  openCreateModal() {
    this.resetCreateForm();
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetCreateForm();
  }

  getEmptyPiece() {
    return {
      numero_piece: '',
      date_piece: '',
      marche: '',
      categorie_article: '',
      compte: '',
      contact: '',
      tous_livres: '',
      commentaire: '',
      piece_justificative: null,
      statut: 'BROUILLON',
      articles: []
    };
  }

  getEmptyLigne() {
    return { designation: '', quantite: 1, prix_unitaire: 0, magasin: '', etagere: '' };
  }

  resetCreateForm() {
    this.newPiece = this.getEmptyPiece();
    this.newLigne = this.getEmptyLigne();
  }

  addLigneToNewPiece() {
    if (!this.newPiece.articles) this.newPiece.articles = [];
    this.newPiece.articles.push({ ...this.newLigne });
    this.newLigne = this.getEmptyLigne();
  }

  removeLigneFromNewPiece(i: number) {
    this.newPiece.articles.splice(i, 1);
  }

  createPiece(piece: any) {
    piece.id = crypto.randomUUID();
    piece.date_piece = piece.date_piece || new Date().toISOString();
    this.entreeStockService.add(piece);
    this.pieces = this.entreeStockService.getAll();
    this.closeCreateModal();
  }

  get filteredPieces(): any[] {
    let result = this.pieces;
    // Recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e =>
        (e.numero_piece && e.numero_piece.toLowerCase().includes(term)) ||
        (e.marche && e.marche.toLowerCase().includes(term))
      );
    }
    // Filtre statut
    if (this.filterStatut) {
      result = result.filter(e => e.statut === this.filterStatut);
    }
    // Filtre marchandise
    if (this.filterMarchandise) {
      const march = this.filterMarchandise.toLowerCase();
      result = result.filter(e => e.marche && e.marche.toLowerCase().includes(march));
    }
    // Filtre date exacte
    if (this.filterDate) {
      result = result.filter(e => e.date_piece && e.date_piece.startsWith(this.filterDate));
    }
    // Tri par date (plus récent d'abord)
    result = result.slice().sort((a, b) => new Date(b.date_piece).getTime() - new Date(a.date_piece).getTime());
    // Pagination
    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    let result = this.pieces;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e =>
        (e.numero_piece && e.numero_piece.toLowerCase().includes(term)) ||
        (e.marche && e.marche.toLowerCase().includes(term))
      );
    }
    if (this.filterStatut) {
      result = result.filter(e => e.statut === this.filterStatut);
    }
    if (this.filterMarchandise) {
      const march = this.filterMarchandise.toLowerCase();
      result = result.filter(e => e.marche && e.marche.toLowerCase().includes(march));
    }
    if (this.filterDate) {
      result = result.filter(e => e.date_piece && e.date_piece.startsWith(this.filterDate));
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.newPiece.piece_justificative = input.files[0];
    }
  }

  openUpdate(piece: any) {
    // À remplacer par l'ouverture d'un vrai formulaire de mise à jour
    alert('Mise à jour de la pièce : ' + piece.numero_piece);
  }

  visualiserPieceJustificative(piece: any) {
    if (piece.piece_justificative) {
      const file = piece.piece_justificative;
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000 * 60);
    }
  }
}
