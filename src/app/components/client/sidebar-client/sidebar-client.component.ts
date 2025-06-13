import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sidebar-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg p-4 h-full border border-violet-100 dark:border-violet-900/40">
      <nav class="space-y-2">
        <a routerLink="/client/dashboard" routerLinkActive="bg-gradient-to-r from-violet-600 to-blue-400 text-white" 
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-violet-900/40 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Tableau de bord
        </a>

        <a routerLink="/client/commandes" routerLinkActive="bg-gradient-to-r from-violet-600 to-blue-400 text-white"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-violet-900/40 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          Mes commandes
        </a>

        <a routerLink="/client/expressions-besoin" routerLinkActive="bg-gradient-to-r from-violet-600 to-blue-400 text-white"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-violet-900/40 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          Expressions de besoin
        </a>

        <a routerLink="/client/profil" routerLinkActive="bg-gradient-to-r from-violet-600 to-blue-400 text-white"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-violet-900/40 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Mon profil
        </a>
      </nav>
    </div>
  `
})
export class SidebarClientComponent {} 