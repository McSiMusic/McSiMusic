import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
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
import { ButtonComponent } from './ui-components/button/button.component';
import { UploadComponent } from './ui-components/upload/upload.component';
import { FoldersComponent } from './pages/browser/folders/folders.component';
import { TracksComponent } from './pages/browser/tracks/tracks.component';
import { InputComponent } from './ui-components/input/input.component';
import { SearchComponent } from './ui-components/search/search.component';
import { SortIconComponent } from './pages/browser/tracks/sort-icon/sort-icon.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { DeleteIconComponent } from './pages/browser/folders/delete-icon/delete-icon.component';
import { EditIconComponent } from './pages/browser/folders/edit-icon/edit-icon.component';
import { ApplyIconComponent } from './pages/browser/folders/apply-icon/apply-icon.component';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';

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
    ButtonComponent,
    UploadComponent,
    FoldersComponent,
    TracksComponent,
    InputComponent,
    SearchComponent,
    SortIconComponent,
    AutofocusDirective,
    EditIconComponent,
    DeleteIconComponent,
    ApplyIconComponent,
    ClickStopPropagationDirective,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
