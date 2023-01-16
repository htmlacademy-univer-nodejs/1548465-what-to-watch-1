import {MovieGeneratorInterface} from './movie-generator.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import {generateRandomValue, getRandomItem, getRandomItems} from '../../utils/random.js';
import dayjs from 'dayjs';
import {GenresList} from '../../types/enums/genre-type.enum.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: MockData) {
  }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const genre = getRandomItem<string>(GenresList);
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
    const avatarPath = getRandomItem<string>(this.mockData.avatarPaths);
    const password = getRandomItem<string>(this.mockData.passwords);
    const poster = getRandomItem<string>(this.mockData.posters);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImages);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);

    return [
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
      user,
      email,
      avatarPath,
      password,
      poster,
      backgroundImage,
      backgroundColor
    ].join('\t');
  }
}
