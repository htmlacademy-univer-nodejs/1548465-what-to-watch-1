import {MovieGeneratorInterface} from './movie-generator.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import {getRandomItem, getRandomItems} from '../../utils/random.js';

export class MovieGenerator implements MovieGeneratorInterface{
  constructor(private readonly mockData: MockData) {}
  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = getRandomItem<string>(this.mockData.publicationDates);
    const genre = getRandomItem<string>(this.mockData.genres);
    const releaseYear = getRandomItem<string>(this.mockData.releaseYears);
    const rating = getRandomItem<number>(this.mockData.ratings);
    const preview = getRandomItem<string>(this.mockData.previews);
    const video = getRandomItem<string>(this.mockData.videos);
    const actors = getRandomItems<string>(this.mockData.actors).join(';');
    const director = getRandomItem<string>(this.mockData.directors);
    const durationInMinutes = getRandomItem<number>(this.mockData.durationsInMinutes);
    const commentsCount = getRandomItem<number>(this.mockData.commentsCounts);
    const user = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatarImage = getRandomItem<string>(this.mockData.avatarImages);
    const password = getRandomItem<string>(this.mockData.passwords);
    const poster = getRandomItem<string>(this.mockData.posters);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImages);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);

    const [firstname, lastName] = user.split(' ');

    return  [
      title,
      description,
      publicationDate,
      genre,
      releaseYear,
      rating,
      preview,
      video,
      actors,
      director,
      durationInMinutes,
      commentsCount,
      firstname,
      lastName,
      email,
      avatarImage,
      password,
      poster,
      backgroundImage,
      backgroundColor
    ].join('\t');
  }
}
