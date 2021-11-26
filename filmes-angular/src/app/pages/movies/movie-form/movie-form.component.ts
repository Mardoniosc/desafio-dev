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
  styleUrls: ['./movie-form.component.scss'],
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

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createMovie();
    } else {
      this.updateMovie();
    }
  }

  private createMovie() {
    const movie: Movie = Object.assign(
      new Movie(),
      this.movieForm.value
    );

    this.movieService.create(movie).subscribe(
      (movie) => this.actionForSuccess(movie),
      (err) => this.actionForError(err)
    );
  }

  private updateMovie() {
    const movie: Movie = Object.assign(
      new Movie(),
      this.movieForm.value
    );

    this.movieService.update(movie).subscribe(
      (movie) => this.actionForSuccess(movie),
      (err) => this.actionForError(err)
    );
  }

  private actionForSuccess(movie: Movie) {
    toastr.success('Solicitação processada com sucesso!');

    this.router
      .navigateByUrl('movies', { skipLocationChange: true })
      .then(() => this.router.navigate(['movies', movie.id, 'edit']));
  }

  private actionForError(err: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if (err.status === 422) {
      this.serverErrorMessages = JSON.parse(err._body).erros;
    } else {
      this.serverErrorMessages = [
        'Falha na comunicação com o servidor. Favor tente mais tarde!',
      ];
    }
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
      nome: [null, [Validators.required, Validators.minLength(2)]],
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      ano: [null, [Validators.required, Validators.minLength(4)]],
      diretor: [null, [Validators.required, Validators.minLength(4)]],
      genero: [null, [Validators.required, Validators.minLength(4)]],
      poster: [null, [Validators.required, Validators.minLength(4)]],
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
            if (this.movieForm) {
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
      if (this.movie) {
        const movieName = this.movie.nome || '';
        this.pageTitle = 'Editando filme: ' + movieName;
      }
    }
  }
}
