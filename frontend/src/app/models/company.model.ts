export interface Company {
  id: string;
  name: string;
  cnpj: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyRequest {
  name: string;
  cnpj: string;
}
