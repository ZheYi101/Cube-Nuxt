import axios, { AxiosError, type Method } from "axios";

import { toCamelCase } from "./camelize";
import { API_KEY_STORAGE_KEY } from "~/assets/constant";

export interface CommonRespWrap<T> {
  code: number;
  msg: string;
  data: T;
}

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    const body: CommonRespWrap<unknown> = response.data;
    if (body.code !== SERVICE_RESP_CODE.OK) {
      throw new RequestError(body.msg, body.code);
    }
    return response;
  },
  (axiosErr: AxiosError) => {
    throw RequestError.fromAxiosError(axiosErr);
  }
);

interface RequestOptions {
  url: string;
  method: Method;
  params?: Record<string, unknown>;
  data?: Record<string, unknown> | FormData;
  /**
   * 是否携带 API Key
   * @default true
   */
  withAPIKey?: boolean;
}

export async function request<R>(opts: RequestOptions): Promise<R> {
  const { withAPIKey = true } = opts;
  const url = new URL(opts.url,import.meta.env.VITE_API_URL);
  const apiKey = useApiKey()
  const { data: body } = await axiosInstance({
    url: url.href,
    method: opts.method,
    params: opts.params,
    data: opts.data,
    headers: withAPIKey
      ? {
          Key: apiKey.value || "",
        }
      : undefined
  });

  body.data = toCamelCase(body.data);
  return (body as CommonRespWrap<R>).data;
}
