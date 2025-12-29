export type ApiSuccess<T = unknown> = {
  status: 1;
  token?: string;
  data?: T;
};

export type ApiError = {
  status: 0;
  error: {
    code: string;
  };
};

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
