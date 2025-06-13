import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarClientComponent],
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
    // Navigation vers la page de création de commande
    // TODO: Implémenter la navigation
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
} 