import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarClientComponent, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardClientComponent implements OnInit {
  // Stats
  commandesEnCours = 0;
  expressionsBesoin = 0;
  commandesLivrees = 0;

  // Données
  dernieresCommandes: any[] = [];
  dernieresExpressions: any[] = [];

  showCommandeModal = false;
  commandeForm = { compte: '', categorie: '', article: '', unite: '', quantite: '', motif: '' };
  commandeErrors = { compte: false, categorie: false, article: false, unite: false, quantite: false, motif: false };
  articlesCommande: any[] = [];
  comptes = ['DSP', 'DGBF', 'SAF', 'SCG', 'SP'];
  categories = ['Mobilier', 'Informatique', 'Papeterie', 'Véhicule', 'Autre'];

  // Feedback pour le modal
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    // Charger les commandes depuis le localStorage
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    const expressions = JSON.parse(localStorage.getItem('expressions_besoin') || '[]');
    
    // Filtrer les commandes du client connecté
    const clientConnecte = JSON.parse(localStorage.getItem('user_connecte') || '{}');
    const commandesClient = commandes.filter((cmd: any) => cmd.client_id === clientConnecte.id);
    const expressionsClient = expressions.filter((exp: any) => exp.client_id === clientConnecte.id);

    // Calculer les stats
    this.commandesEnCours = commandesClient.filter((cmd: any) => 
      ['ENVOYEE', 'VALIDEE'].includes(cmd.statut)).length;
    this.commandesLivrees = commandesClient.filter((cmd: any) => 
      cmd.statut === 'LIVREE').length;
    this.expressionsBesoin = expressionsClient.length;

    // Trier et limiter les dernières commandes/expressions
    this.dernieresCommandes = commandesClient
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    this.dernieresExpressions = expressionsClient
      .sort((a: any, b: any) => new Date(b.date_saisie).getTime() - new Date(a.date_saisie).getTime())
      .slice(0, 5);
  }

  nouvelleCommande() {
    this.ouvrirCommandeModal();
  }

  nouvelleExpressionBesoin() {
    // Navigation vers la page de création d'expression de besoin
    // TODO: Implémenter la navigation
  }

  voirDetailCommande(commande: any) {
    // Navigation vers la page de détail de la commande
    // TODO: Implémenter la navigation
  }

  voirDetailExpression(expression: any) {
    // Navigation vers la page de détail de l'expression de besoin
    // TODO: Implémenter la navigation
  }

  ouvrirCommandeModal() {
    this.showCommandeModal = true;
    this.resetCommandeForm();
  }
  closeCommandeModal() {
    this.showCommandeModal = false;
    this.resetCommandeForm();
  }
  resetCommandeForm() {
    this.commandeForm = { compte: '', categorie: '', article: '', unite: '', quantite: '', motif: '' };
    this.commandeErrors = { compte: false, categorie: false, article: false, unite: false, quantite: false, motif: false };
  }
  ajouterArticle() {
    // Validation
    let valid = true;
    this.commandeErrors = { compte: false, categorie: false, article: false, unite: false, quantite: false, motif: false };
    const quantiteNum = parseInt(this.commandeForm.quantite as any, 10);
    if (!this.commandeForm.compte) { this.commandeErrors.compte = true; valid = false; }
    if (!this.commandeForm.categorie) { this.commandeErrors.categorie = true; valid = false; }
    if (!this.commandeForm.article) { this.commandeErrors.article = true; valid = false; }
    if (!this.commandeForm.unite) { this.commandeErrors.unite = true; valid = false; }
    if (!quantiteNum || quantiteNum <= 0) { this.commandeErrors.quantite = true; valid = false; }
    if (!this.commandeForm.motif) { this.commandeErrors.motif = true; valid = false; }
    if (!valid) return;
    this.articlesCommande.push({
      article: this.commandeForm.article,
      unite: this.commandeForm.unite,
      quantite: quantiteNum
    });
    this.commandeForm.article = '';
    this.commandeForm.unite = '';
    this.commandeForm.quantite = '';
    this.commandeForm.motif = '';
  }
  supprimerArticle(index: number) {
    this.articlesCommande.splice(index, 1);
  }

  validerCommande() {
    // Validation : il faut au moins un article
    if (this.articlesCommande.length === 0) {
      this.message = "Ajoutez au moins un article à la commande.";
      this.messageType = 'error';
      this.clearMessageAfterDelay();
      return;
    }
    // Construction de la commande
    const clientConnecte = JSON.parse(localStorage.getItem('user_connecte') || '{}');
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    const nouvelleCommande = {
      id: Date.now(),
      numero: 'CMD-' + Math.floor(1000 + Math.random() * 9000),
      client_id: clientConnecte.id,
      date: new Date().toISOString(),
      statut: 'ENVOYEE',
      articles: [...this.articlesCommande],
      nombreArticles: this.articlesCommande.length,
      motif: this.commandeForm.motif
    };
    commandes.push(nouvelleCommande);
    localStorage.setItem('commandes', JSON.stringify(commandes));
    this.message = "Commande envoyée avec succès !";
    this.messageType = 'success';
    this.chargerDonnees();
    // Reset après succès
    setTimeout(() => {
      this.closeCommandeModal();
      this.message = null;
      this.messageType = null;
    }, 1500);
  }

  clearMessageAfterDelay() {
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
    }, 2500);
  }
} 