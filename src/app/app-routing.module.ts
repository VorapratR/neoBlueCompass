import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./page/main/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'feeds',
    loadChildren: () => import('./page/main/feeds/feeds.module').then( m => m.FeedsPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./page/main/history/history.module').then( m => m.HistoryPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./page/main/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'plan',
    loadChildren: () => import('./page/process/plan/plan.module').then( m => m.PlanPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
