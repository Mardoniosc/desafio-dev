import { Component, OnInit } from '@angular/core';
import { Movie } from '../shared/models/movies.model';
import { MovieService } from '../shared/services/movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  movies: Movie[] = [];

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movieService.getAll().subscribe(
      (data) => (this.movies = data),
      (err) => console.error('Erro ao carregar Lista ', err)
    );
  }

  deleteMovie(movie: Movie) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      if(movie.id) {
        this.movieService.delete(movie.id).subscribe(
          (data) => {
            this.movies = this.movies.filter((x) => x != movie);
          },
          (err) => alert('Erro ao tentar excluir!!')
        );
      }
    }
  }

}
