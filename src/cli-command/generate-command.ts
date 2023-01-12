import {CliCommandInterface} from './cli-command.interface.js';
import {MockData} from '../types/mock-data.type.js';
import got from 'got';
import {MovieGenerator} from '../common/movie-generator/movie-generator.js';
import {appendFile} from 'fs/promises';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const movieCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`Can't fetch data from ${url}.`);
    }

    const movieGeneratorString = new MovieGenerator(this.initialData);

    for (let i = 0; i < movieCount; i++) {
      await appendFile(filepath, `${movieGeneratorString.generate()}\n`, 'utf-8');
    }

    console.log(`File ${filepath} was created!`);
  }
}
