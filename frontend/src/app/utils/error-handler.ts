import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError {
    message: string;
    status: number;
    details?: any;
}

export class ErrorHandler {
    static handleError(error: any): ApiError {
        console.error('Error caught by ErrorHandler:', error);

        if (error instanceof HttpErrorResponse) {
            if (error.error && error.error.message) {
                return {
                    message: error.error.message,
                    status: error.status,
                    details: error.error
                };
            }

            return {
                message: this.getHttpErrorMessage(error.status),
                status: error.status,
                details: error.error
            };
        }

        if (error.name === 'HttpErrorResponse') {
            return {
                message: 'Erro de conexão. Verifique sua internet e tente novamente.',
                status: 0,
                details: error
            };
        }

        return {
            message: error.message || 'Ocorreu um erro inesperado. Tente novamente.',
            status: 0,
            details: error
        };
    }

    private static getHttpErrorMessage(status: number): string {
        switch (status) {
            case 400:
                return 'Dados inválidos. Verifique as informações e tente novamente.';
            case 401:
                return 'Acesso não autorizado. Faça login novamente.';
            case 403:
                return 'Você não tem permissão para realizar esta ação.';
            case 404:
                return 'Recurso não encontrado.';
            case 409:
                return 'Conflito de dados. O recurso já existe ou está em uso.';
            case 422:
                return 'Dados inválidos. Verifique as informações fornecidas.';
            case 500:
                return 'Erro interno do servidor. Tente novamente mais tarde.';
            case 503:
                return 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
            default:
                return `Erro ${status}. Tente novamente.`;
        }
    }

    static getErrorMessage(error: any): string {
        const apiError = this.handleError(error);
        return apiError.message;
    }

    static getErrorDetails(error: any): ApiError {
        return this.handleError(error);
    }
}
