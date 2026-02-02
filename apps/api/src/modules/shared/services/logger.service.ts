import {
  Injectable,
  LoggerService as NestLoggerService,
  Scope,
} from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT }) // Transient to allow unique context per service
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, ...optionalParams: any[]) {
    this.print('LOG', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.print('ERROR', message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.print('WARN', message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.print('DEBUG', message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.print('VERBOSE', message, ...optionalParams);
  }

  private print(level: string, message: any, ...params: any[]) {
    const timestamp = new Date().toISOString();
    const ctx = this.context ? `[${this.context}]` : '';
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;

    // Use console for now, but formatted
    // In valid prod env, use winston/pino
    const output = `${timestamp} ${level.padEnd(7)} ${ctx} ${msg}`;

    switch (level) {
      case 'ERROR':
        console.error(output, ...params);
        break;
      case 'WARN':
        console.warn(output, ...params);
        break;
      default:
        console.log(output, ...params);
        break;
    }
  }
}
