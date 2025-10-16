import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee, CreateEmployeeRequest } from '../models/employee.model';
import { ErrorHandler } from '../utils/error-handler';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/employees';


  getAll(): Observable<Employee[]> {
    try {
      return this.http.get<Employee[]>(this.apiUrl).pipe(
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

  getEmployeeById(id: string): Observable<Employee> {
    try {
      return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
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

  getEmployeesByCompany(companyId: string): Observable<Employee[]> {
    try {
      return this.http.get<Employee[]>(`${this.apiUrl}/company/${companyId}`).pipe(
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

  create(employee: CreateEmployeeRequest): Observable<Employee> {
    try {
      return this.http.post<Employee>(this.apiUrl, employee).pipe(
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

  update(id: string, employee: Partial<CreateEmployeeRequest>): Observable<Employee> {
    try {
      return this.http.patch<Employee>(`${this.apiUrl}/${id}`, employee).pipe(
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

  delete(id: string): Observable<void> {
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
