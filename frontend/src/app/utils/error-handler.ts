import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError {
    message: string;
    status: number;
    details?: unknown;
}

export class ErrorHandler {
    static handleError(error: unknown): ApiError {
        console.error('Error caught by ErrorHandler:', error);

        if (error instanceof HttpErrorResponse) {
            if (error.error && (error.error as any).message) {
                return {
                    message: (error.error as any).message,
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

        if ((error as any).name === 'HttpErrorResponse') {
            return {
                message: 'Erro de conexão. Verifique sua internet e tente novamente.',
                status: 0,
                details: error
            };
        }

        return {
            message: (error as Error).message || 'Ocorreu um erro inesperado. Tente novamente.',
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

    static getErrorMessage(error: unknown): string {
        const apiError = this.handleError(error);
        return apiError.message;
    }

    static getErrorDetails(error: unknown): ApiError {
        return this.handleError(error);
    }
}
