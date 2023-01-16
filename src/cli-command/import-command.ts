import {CliCommandInterface} from './cli-command.interface.js';
import TsvFileReader from '../common/file-reader/tsv-file-reader.js';
import {createMovie, getErrorMessage} from '../utils/common.js';
import {Movie} from '../types/entities/movie.type.js';
import {UserServiceInterface} from '../modules/user/service/user-service.interface.js';
import {MovieServiceInterface} from '../modules/movie/service/movie-service.interface.js';
import {DatabaseInterface} from '../common/db-client/database.interface.js';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import MovieService from '../modules/movie/service/movie.service.js';
import {MovieModel} from '../modules/movie/movie.entity.js';
import UserService from '../modules/user/service/user.service.js';
import {UserModel} from '../modules/user/user.entity.js';
import DatabaseService from '../common/db-client/database.service.js';
import {getURI} from '../utils/db.js';

const DEFAULT_DB_PORT = 27018;
const DEFAULT_USER_PASSWORD = '123456';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private movieService!: MovieServiceInterface;
  private databaseService!: DatabaseInterface;
  private readonly logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.movieService = new MovieService(this.logger, MovieModel);
    this.userService = new UserService(this.logger, UserModel, MovieModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async saveMovie(movie: Movie) {
    const user = await this.userService.findOrCreate({
      ...movie.user,
      password: DEFAULT_USER_PASSWORD,
      toWatchMovies: []
    }, this.salt);

    await this.movieService.create({
      ...movie,
      userId: user.id,
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const movie = createMovie(line);
    await this.saveMovie(movie);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TsvFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch(err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
