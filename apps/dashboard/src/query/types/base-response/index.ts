type ErrorType<T> = T extends null ? string : null;

export interface BaseResponse<T> {
  statusCode: number;
  result: {
    data: T extends null ? null : T;
    error: ErrorType<T>;
  };
}