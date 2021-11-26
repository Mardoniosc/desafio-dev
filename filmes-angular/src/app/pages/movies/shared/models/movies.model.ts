export class Movie {
  constructor(
    public id: number,
    public nome?: string,
    public ano?: number,
    public diretor?: string,
    public genero?: string,
    public descricao?: string,
    public poster?: string
  ) {}
}
