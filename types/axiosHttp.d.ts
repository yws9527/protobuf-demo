declare type ApiPromise<T = any> = Promise<ApiResponse<T>>;

interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

interface ApiResponse<T = any> {
  succ: boolean;
  ts: number;
  data: T;
  code: string;
  msg: string;
  headers: string;
}
