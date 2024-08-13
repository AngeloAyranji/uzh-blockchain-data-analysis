import axios, { AxiosError, AxiosPromise } from "axios";
import { BaseResponse } from "../types";

export const backendInstance = axios.create({
  baseURL: "http://localhost:4000",
});

export type ControlledAxiosPromise<T extends NonNullable<unknown>> =
  AxiosPromise<BaseResponse<T>>;

export const controlledAxiosPromise = <T extends NonNullable<unknown>>(
  promise: ControlledAxiosPromise<T>
): Promise<T> =>
  promise
    .then((res: any) => {
      if (res.data.result.data === null) {
        throw new Error("Data is null");
      }
      return res.data.result.data as T;
    })
    .catch((err: AxiosError<BaseResponse<null>>) => {
      if (err.response) {
        throw new Error(err.response.data.result.error);
      }
      throw err;
    });
