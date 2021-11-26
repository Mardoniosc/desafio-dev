import { Component, OnInit, AfterContentChecked } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import * as toastr from 'toastr';
import { Movie } from '../shared/models/movies.model';
import { MovieService } from '../shared/services/movie.service';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss']
})
export class MovieFormComponent implements OnInit {

  currentAction: string = '';
  movieForm!: FormGroup;
  pageTitle: string = '';
  serverErrorMessages: string[] = [];
  submittingForm: boolean = false;
  movie: Movie = new Movie();

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildMovieForm();
    this.loadMovie();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

   // PRIVATE METHODS

   private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildMovieForm() {
    this.movieForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
    });
  }

  private loadMovie() {
    if (this.currentAction === 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((parms) =>
            this.movieService.getById(Number(parms.get('id')))
          )
        )
        .subscribe(
          (data) => {
            this.movie = data;
            if(this.movieForm) {
              this.movieForm.patchValue(this.movie);
            }
          },
          (err) => console.error('Erro ao carregar a categoria', err)
        );
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Novo Filme';
    } else {
      if(this.movie) {
        const movieName = this.movie.nome || '';
        this.pageTitle = 'Editando filme: ' + movieName;
      }
    }
  }

}
