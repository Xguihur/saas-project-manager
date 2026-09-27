import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns a healthy response with the request id', () => {
    const controller = new HealthController();
    const result = controller.getHealth({ header: () => 'test-request-id' } as never);

    expect(result.status).toBe('ok');
    expect(result.service).toBe('backend');
    expect(result.requestId).toBe('test-request-id');
  });
});
