export interface RpcError {
  status: number;
  message: string;
  service?: string;
  timestamp?: string;
  code?: number;
  details?: string;
}
