import { Response } from 'express';
import { ApiResponse } from '../types/api-response.type';

type SendApiOptions<T> = {
  data?: T;
  token?: string;
};

export function sendApi<T>(res: Response, httpStatus: number, options: SendApiOptions<T> = {}) {
  const body: ApiResponse<T> = {
    status: 1,
    ...(options.token ? { token: options.token } : {}),
    ...(options.data !== undefined ? { data: options.data } : {}),
  };

  return res.status(httpStatus).json(body);
}
