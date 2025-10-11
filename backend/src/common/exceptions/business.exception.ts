import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, status);
  }
}

export class CompanyNotFoundException extends BusinessException {
    constructor() {
        super(`Empresa não encontrada`, HttpStatus.NOT_FOUND);
    }
}

export class CompanyAlreadyExistsException extends BusinessException {
  constructor(field: string, value: string) {
    const fieldName = field === 'name' ? 'nome' : 'CNPJ';
    super(`Já existe uma empresa com ${fieldName} '${value}'`, HttpStatus.CONFLICT);
  }
}

export class EmployeeNotFoundException extends BusinessException {
  constructor() {
    super(`Funcionário não encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class EmployeeAlreadyExistsException extends BusinessException {
  constructor(field: string, value: string) {
    const fieldName = field === 'email' ? 'email' : 'CPF';
    super(`Já existe um funcionário com ${fieldName} '${value}'`, HttpStatus.CONFLICT);
  }
}