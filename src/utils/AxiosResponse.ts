interface ApiResponse<T>{
    message?: string;
    data?: T;
}


export interface AxiosResponseState<T> {
    status: number | null; // To hold HTTP status
    data: ApiResponse<T> | null;        // To hold response data
}