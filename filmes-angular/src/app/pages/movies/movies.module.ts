import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieFormComponent } from './movie-form/movie-form.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MovieListComponent, MovieFormComponent],
  imports: [CommonModule, MoviesRoutingModule, HttpClientModule],
})
export class MoviesModule {}
