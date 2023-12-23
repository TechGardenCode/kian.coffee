import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'home - kian.coffee',
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'about - kian.coffee',
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'contact - kian.coffee',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
