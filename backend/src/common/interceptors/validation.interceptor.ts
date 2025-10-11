import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BadRequestException) {
          const response = error.getResponse();
          
          if (typeof response === 'object' && 'message' in response) {
            const messages = Array.isArray(response.message) ? response.message : [response.message];
            
            const translatedMessages = messages.map((msg: string) => {
              if (msg.includes('property') && msg.includes('should not exist')) {
                const property = msg.match(/property (\w+)/)?.[1];
                return `Propriedade '${property}' não é permitida`;
              }
              
              if (msg.includes('should not be empty')) {
                return 'Campo não pode estar vazio';
              }
              
              if (msg.includes('must be a string')) {
                return 'Deve ser um texto';
              }
              
              if (msg.includes('must be an email')) {
                return 'Deve ser um email válido';
              }
              
              if (msg.includes('must be a valid email')) {
                return 'Deve ser um email válido';
              }
              
              if (msg.includes('must match')) {
                return 'Formato inválido';
              }
              
              if (msg.includes('must be between')) {
                return 'Tamanho inválido';
              }
              
              return msg; 
            });
            
            return throwError(() => new BadRequestException({
              message: translatedMessages,
              error: 'Dados inválidos',
              statusCode: 400,
            }));
          }
        }
        
        return throwError(() => error);
      }),
    );
  }
}
