import {FileReaderInterface} from './file-reader.interface.js';
import {readFileSync} from 'fs';
import {Movie} from '../../types/movie.type.js';
import {Genre} from '../../types/genre-type.enum.js';

export default class TsvFileReader implements FileReaderInterface{
  private rawData = '';
  constructor(public filename : string) {
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Movie[] {
    if(!this.rawData) {
      return [];
    }
    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, publicationDate, genre, releaseYear, rating, preview, video, actors, director, durationInMinutes, commentsCount, name, email, avatarImage, password, poster, backgroundImage, backgroundColor]) => ({
        title,
        description,
        publicationDate: new Date(publicationDate),
        genre: <Genre>genre,
        releaseYear: Number(releaseYear),
        rating: Number(rating),
        preview,
        video,
        actors: String(actors).split(';'),
        director,
        durationInMinutes: Number(durationInMinutes),
        commentsCount: Number(commentsCount),
        user: {name, email, avatarImage, password},
        poster,
        backgroundColor,
        backgroundImage
      }));
  }

}
