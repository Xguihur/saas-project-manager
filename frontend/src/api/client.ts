const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
  requestId: string | null;
};

export class ApiError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
  }
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, body.message ?? '请求失败');
  }
  return body as HealthResponse;
}
