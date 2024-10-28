import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMessage(): string {
    return 'Challenge accepted: Task management system for sales By Osama Ayman Ibrahim';
  }
}
