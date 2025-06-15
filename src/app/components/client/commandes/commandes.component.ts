import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';

@Component({
  selector: 'app-commandes-client',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarClientComponent, FormsModule],
  templateUrl: './commandes.component.html',
})
export class CommandesClientComponent implements OnInit {
  commandesEnCours = 0;
  commandesLivrees = 0;
  dernieresCommandes: any[] = [];
  showCommandeModal = false;
  stepCommande: 1 | 2 = 1;
  commandeForm = { categorie: '', article: '', unite: '', quantite: '' };
  commandeMeta = { compte: '', motif: '' };
  commandeErrors = { categorie: false, article: false, unite: false, quantite: false };
  metaErrors = { compte: false, motif: false };
  articlesCommande: any[] = [];
  comptes = ['DSP', 'DGBF'];
  categories = ['Mobilier', 'Informatique', 'Papeterie', 'Véhicule', 'Autre'];
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  selectedCommande: any = null;

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    const clientConnecte = JSON.parse(localStorage.getItem('user_connecte') || '{}');
    const commandesClient = commandes.filter((cmd: any) => cmd.client_id === clientConnecte.id);
    commandesClient.forEach((cmd: any) => cmd.showDetail = false);
    this.commandesEnCours = commandesClient.filter((cmd: any) => ['ENVOYEE', 'VALIDEE'].includes(cmd.statut)).length;
    this.commandesLivrees = commandesClient.filter((cmd: any) => cmd.statut === 'LIVREE').length;
    this.dernieresCommandes = commandesClient.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  nouvelleCommande() { this.ouvrirCommandeModal(); }
  ouvrirCommandeModal() { this.showCommandeModal = true; this.stepCommande = 1; this.resetCommandeForm(); }
  closeCommandeModal() { this.showCommandeModal = false; this.stepCommande = 1; this.resetCommandeForm(); }
  resetCommandeForm() {
    this.commandeForm = { categorie: '', article: '', unite: '', quantite: '' };
    this.commandeMeta = { compte: '', motif: '' };
    this.commandeErrors = { categorie: false, article: false, unite: false, quantite: false };
    this.metaErrors = { compte: false, motif: false };
    this.articlesCommande = [];
    this.message = null;
    this.messageType = null;
  }
  ajouterArticle() {
    let valid = true;
    this.commandeErrors = { categorie: false, article: false, unite: false, quantite: false };
    const quantiteNum = parseInt(this.commandeForm.quantite as any, 10);
    if (!this.commandeForm.categorie) { this.commandeErrors.categorie = true; valid = false; }
    if (!this.commandeForm.article) { this.commandeErrors.article = true; valid = false; }
    if (!this.commandeForm.unite) { this.commandeErrors.unite = true; valid = false; }
    if (!quantiteNum || quantiteNum <= 0) { this.commandeErrors.quantite = true; valid = false; }
    if (!valid) return;
    this.articlesCommande.push({
      article: this.commandeForm.article,
      unite: this.commandeForm.unite,
      quantite: quantiteNum,
      categorie: this.commandeForm.categorie
    });
    this.commandeForm.article = '';
    this.commandeForm.unite = '';
    this.commandeForm.quantite = '';
  }
  supprimerArticle(index: number) { this.articlesCommande.splice(index, 1); }
  passerEtape2() {
    if (this.articlesCommande.length === 0) {
      this.message = "Ajoutez au moins un article avant de continuer.";
      this.messageType = 'error';
      this.clearMessageAfterDelay();
      return;
    }
    this.stepCommande = 2;
  }
  validerCommande() {
    let valid = true;
    this.metaErrors = { compte: false, motif: false };
    if (!this.commandeMeta.compte) { this.metaErrors.compte = true; valid = false; }
    if (!this.commandeMeta.motif) { this.metaErrors.motif = true; valid = false; }
    if (!valid) return;
    const clientConnecte = JSON.parse(localStorage.getItem('user_connecte') || '{}');
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    let dernierNumero = parseInt(localStorage.getItem('dernier_numero_commande') || '0', 10);
    dernierNumero++;
    localStorage.setItem('dernier_numero_commande', dernierNumero.toString());
    const nouvelleCommande = {
      id: Date.now(),
      numero: dernierNumero.toString(),
      client_id: clientConnecte.id,
      date: new Date().toISOString(),
      statut: 'ENVOYEE',
      articles: [...this.articlesCommande],
      nombreArticles: this.articlesCommande.length,
      compte: this.commandeMeta.compte,
      motif: this.commandeMeta.motif,
      categorie: this.articlesCommande[0]?.categorie || '',
      showDetail: false
    };
    commandes.push(nouvelleCommande);
    localStorage.setItem('commandes', JSON.stringify(commandes));
    this.message = "Commande envoyée avec succès !";
    this.messageType = 'success';
    this.chargerDonnees();
    setTimeout(() => { this.closeCommandeModal(); this.message = null; this.messageType = null; }, 1500);
  }
  clearMessageAfterDelay() { setTimeout(() => { this.message = null; this.messageType = null; }, 2500); }
  toggleDetailCommande(cmd: any) { this.dernieresCommandes.forEach(c => { if (c !== cmd) c.showDetail = false; }); cmd.showDetail = !cmd.showDetail; }
  openDetailModal(cmd: any) { this.selectedCommande = cmd; }
  closeDetailModal() { this.selectedCommande = null; }
} 