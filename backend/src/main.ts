import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true, // Rejeita propriedades extras
    transform: true // Transforma tipos automaticamente
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Forte Asset Manager API')
    .setDescription('API para gerenciamento de empresas, funcionários e ativos')
    .setVersion('1.0')
    .addTag('Empresas')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger documentation: http://localhost:3000/api');
}
bootstrap();
