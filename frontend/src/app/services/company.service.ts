import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Company, CreateCompanyRequest } from '../models/company.model';
import { ErrorHandler, ApiError } from '../utils/error-handler';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly apiUrl = 'http://localhost:3000/companies';

  constructor(private http: HttpClient) { }

  getAllCompanies(): Observable<Company[]> {
    try {
      return this.http.get<Company[]>(this.apiUrl).pipe(
        catchError(error => {
          const apiError = ErrorHandler.handleError(error);
          return throwError(() => apiError);
        })
      );
    } catch (error) {
      const apiError = ErrorHandler.handleError(error);
      return throwError(() => apiError);
    }
  }

  getCompanyById(id: string): Observable<Company> {
    try {
      return this.http.get<Company>(`${this.apiUrl}/${id}`).pipe(
        catchError(error => {
          const apiError = ErrorHandler.handleError(error);
          return throwError(() => apiError);
        })
      );
    } catch (error) {
      const apiError = ErrorHandler.handleError(error);
      return throwError(() => apiError);
    }
  }

  createCompany(company: CreateCompanyRequest): Observable<Company> {
    try {
      return this.http.post<Company>(this.apiUrl, company).pipe(
        catchError(error => {
          const apiError = ErrorHandler.handleError(error);
          return throwError(() => apiError);
        })
      );
    } catch (error) {
      const apiError = ErrorHandler.handleError(error);
      return throwError(() => apiError);
    }
  }

  updateCompany(id: string, company: Partial<CreateCompanyRequest>): Observable<Company> {
    try {
      return this.http.patch<Company>(`${this.apiUrl}/${id}`, company).pipe(
        catchError(error => {
          const apiError = ErrorHandler.handleError(error);
          return throwError(() => apiError);
        })
      );
    } catch (error) {
      const apiError = ErrorHandler.handleError(error);
      return throwError(() => apiError);
    }
  }

  deleteCompany(id: string): Observable<void> {
    try {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(error => {
          const apiError = ErrorHandler.handleError(error);
          return throwError(() => apiError);
        })
      );
    } catch (error) {
      const apiError = ErrorHandler.handleError(error);
      return throwError(() => apiError);
    }
  }
}
