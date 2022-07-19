import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { BrowserComponent } from './pages/browser/browser.component';
import { EditorComponent } from './pages/editor/editor.component';
import { PlayerComponent } from './pages/player/player.component';

const routes: Routes = [
  { path: 'player', component: PlayerComponent },
  { path: 'browser', component: BrowserComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
