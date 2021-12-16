export type SuccessApiResponse<T> = T & { error: false; }
export type FailedApiResponse = { error: { help?: string, message: string, details?: string }; }

export type ApiResponse<T> = SuccessApiResponse<T> | FailedApiResponse;
