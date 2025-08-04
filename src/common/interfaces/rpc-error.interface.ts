export interface RpcError {
  status: number;
  message: string | string[];
  service?: string;
  timestamp?: string;
  code?: number;
  details?: string;
}
