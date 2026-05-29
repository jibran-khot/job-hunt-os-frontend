export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    success: boolean;
    data: T;
}

export interface PaginatedResponse<T> {
    statusCode: number;
    message: string;
    success: boolean;
    data: T[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export interface ErrorResponse {
    statusCode: number;
    message: string;
    errors?: string[];
}