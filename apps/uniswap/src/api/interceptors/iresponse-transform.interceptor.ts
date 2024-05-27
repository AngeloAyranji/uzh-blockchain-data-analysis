export interface IResponse<T> {
  statusCode: number;
  result: {
    data: T | null;
    error: string | null;
  };
}
