import 'reflect-metadata';
import LoggerService from './common/logger/logger.service.js';
import Application from './app/application.js';
import ConfigService from './common/config/config.service.js';
import {Component} from './types/component.types.js';
import {ConfigInterface} from './common/config/config.interface.js';
import {LoggerInterface} from './common/logger/logger.interface.js';
import {Container} from 'inversify';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application);
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService);
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService);

const application = applicationContainer.get<Application>(Component.Application);
await application.init();
