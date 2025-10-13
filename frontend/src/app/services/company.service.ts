import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, CreateCompanyRequest } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly apiUrl = 'http://localhost:3000/companies';

  constructor(private http: HttpClient) { }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  getCompanyById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  createCompany(company: CreateCompanyRequest): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  updateCompany(id: string, company: Partial<CreateCompanyRequest>): Observable<Company> {
    return this.http.patch<Company>(`${this.apiUrl}/${id}`, company);
  }

  deleteCompany(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
