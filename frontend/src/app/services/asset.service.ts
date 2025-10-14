import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Asset, CreateAssetRequest } from '../models/asset.model';
import { ErrorHandler, ApiError } from '../utils/error-handler';

@Injectable({
    providedIn: 'root'
})
export class AssetService {
    private readonly apiUrl = 'http://localhost:3000/assets';

    constructor(private http: HttpClient) { }

    getAllAssets(): Observable<Asset[]> {
        try {
            return this.http.get<Asset[]>(this.apiUrl).pipe(
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

    getAvailableAssets(): Observable<Asset[]> {
        try {
            return this.http.get<Asset[]>(`${this.apiUrl}`).pipe(
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

    getAssetsByEmployee(employeeId: string): Observable<Asset[]> {
        try {
            return this.http.get<Asset[]>(`${this.apiUrl}/employee/${employeeId}`).pipe(
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

    getAssetById(id: string): Observable<Asset> {
        try {
            return this.http.get<Asset>(`${this.apiUrl}/${id}`).pipe(
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

    create(asset: CreateAssetRequest): Observable<Asset> {
        try {
            return this.http.post<Asset>(this.apiUrl, asset).pipe(
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

    update(id: string, asset: Partial<CreateAssetRequest>): Observable<Asset> {
        try {
            return this.http.patch<Asset>(`${this.apiUrl}/${id}`, asset).pipe(
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

    associateAsset(assetId: string, employeeId: string): Observable<Asset> {
        try {
            return this.http.post<Asset>(`${this.apiUrl}/${assetId}/associate/${employeeId}`, {}).pipe(
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

    disassociateAsset(assetId: string): Observable<Asset> {
        try {
            return this.http.post<Asset>(`${this.apiUrl}/${assetId}/disassociate`, {}).pipe(
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
