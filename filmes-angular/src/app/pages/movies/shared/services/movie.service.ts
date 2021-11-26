import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Movie } from '../models/movies.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiPath: string = 'api/movies';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToMovies));
  }

  getById(id: number): Observable<Movie> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .get(url)
      .pipe(catchError(this.handleError), map(this.jsonDataToMovie));
  }

  create(movie: Movie): Observable<Movie> {
    return this.http
      .post(this.apiPath, movie)
      .pipe(catchError(this.handleError), map(this.jsonDataToMovie));
  }

  update(movie: Movie): Observable<Movie> {
    const url = `${this.apiPath}/${movie.id}`;
    return this.http.put(url, movie).pipe(
      catchError(this.handleError),
      map(() => movie)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  // PRIVATE METHODS
  private jsonDataToMovies(jsonData: any[]): Movie[] {
    const movies: Movie[] = [];
    jsonData.forEach((element) => movies.push(element as Movie));
    return movies;
  }

  private jsonDataToMovie(jsonData: any[]): Movie {
    return jsonData as Movie;
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição => ', error);
    return throwError(error);
  }
}
