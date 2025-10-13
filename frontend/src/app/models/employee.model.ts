export interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  cpf: string;
  companyId: string;
}

export interface CompanyWithEmployees {
  id: string;
  name: string;
  cnpj: string;
  createdAt: Date;
  updatedAt: Date;
  employees: Employee[];
}
