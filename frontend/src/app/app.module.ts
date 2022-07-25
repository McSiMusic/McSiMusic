import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PlayerComponent } from './pages/player/player.component';
import { EditorComponent } from './pages/editor/editor.component';
import { AboutComponent } from './pages/about/about.component';
import { BrowserComponent } from './pages/browser/browser.component';
import { LoginComponent } from './pages/login/login.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { PreloaderLogoComponent } from './components/preloader/components/preloader-logo/preloader-logo.component';
import { MenuComponent } from './ui-components/menu/menu.component';
import { MenuContentComponent } from './ui-components/menu/menu-content/menu-content.component';
import { PortalRootDirective } from './services/portal/PortalRoot';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlayerComponent,
    EditorComponent,
    AboutComponent,
    BrowserComponent,
    LoginComponent,
    PreloaderComponent,
    PreloaderLogoComponent,
    MenuComponent,
    MenuContentComponent,
    PortalRootDirective,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
