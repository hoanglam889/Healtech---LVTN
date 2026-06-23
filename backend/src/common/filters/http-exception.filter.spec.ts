import { AllExceptionsFilter } from './http-exception.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

function buildMockHost(url = '/test'): {
  host: ArgumentsHost;
  response: { status: jest.Mock; json: jest.Mock };
} {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const host = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ url }),
      getResponse: jest.fn().mockReturnValue(response),
    }),
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  } as unknown as ArgumentsHost;
  return { host, response };
}

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockI18n: jest.Mocked<Pick<I18nService, 'translate'>>;

  beforeEach(() => {
    mockI18n = {
      translate: jest.fn().mockResolvedValue('translated message'),
    } as any;
    filter = new AllExceptionsFilter(mockI18n as any);
  });

  it('formats a 401 HttpException with i18nKey correctly', async () => {
    const { host, response } = buildMockHost('/auth/staff-login');
    const exception = new HttpException(
      { i18nKey: 'errors.auth.invalid_credentials' },
      HttpStatus.UNAUTHORIZED,
    );

    await filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(401);
    const body = response.json.mock.calls[0][0];
    expect(body).toMatchObject({
      success: false,
      statusCode: 401,
      error: 'UNAUTHORIZED',
      errors: null,
      path: '/auth/staff-login',
    });
    expect(typeof body.message).toBe('string');
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  it('formats a 400 HttpException with i18nKey correctly', async () => {
    const { host, response } = buildMockHost('/auth/staff-login');
    const exception = new HttpException(
      { i18nKey: 'errors.auth.missing_login_fields' },
      HttpStatus.BAD_REQUEST,
    );

    await filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(400);
    const body = response.json.mock.calls[0][0];
    expect(body).toMatchObject({
      success: false,
      statusCode: 400,
      error: 'BAD_REQUEST',
    });
  });

  it('formats a 409 HttpException with i18nKey correctly', async () => {
    const { host, response } = buildMockHost('/auth/patient-register');
    const exception = new HttpException(
      { i18nKey: 'errors.auth.email_already_registered' },
      HttpStatus.CONFLICT,
    );

    await filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(409);
    const body = response.json.mock.calls[0][0];
    expect(body).toMatchObject({
      success: false,
      statusCode: 409,
      error: 'CONFLICT',
    });
  });

  it('handles ValidationPipe array message format', async () => {
    const { host, response } = buildMockHost('/patients');
    const exception = new HttpException(
      { message: ['field is required', 'email must be valid'] },
      HttpStatus.BAD_REQUEST,
    );

    await filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(400);
    const body = response.json.mock.calls[0][0];
    expect(body.errors).toHaveLength(2);
    expect(body.errors[0]).toMatchObject({ field: null, message: 'field is required' });
    expect(body.errors[1]).toMatchObject({ field: null, message: 'email must be valid' });
  });

  it('formats a plain string HttpException', async () => {
    const { host, response } = buildMockHost('/test');
    const exception = new HttpException('Custom plain error', HttpStatus.FORBIDDEN);

    await filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(403);
    const body = response.json.mock.calls[0][0];
    expect(body.message).toBe('Custom plain error');
    expect(body.error).toBe('FORBIDDEN');
  });

  it('returns 500 for unhandled non-HTTP exceptions', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const { host, response } = buildMockHost('/test');
    const exception = new Error('Unexpected crash');

    await filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(500);
    const body = response.json.mock.calls[0][0];
    expect(body).toMatchObject({
      success: false,
      statusCode: 500,
      error: 'INTERNAL_SERVER_ERROR',
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('always includes timestamp and path in error response', async () => {
    const { host, response } = buildMockHost('/some/path');
    const exception = new HttpException('error', HttpStatus.NOT_FOUND);

    await filter.catch(exception, host);

    const body = response.json.mock.calls[0][0];
    expect(body.path).toBe('/some/path');
    expect(body.timestamp).toBeDefined();
    expect(() => new Date(body.timestamp)).not.toThrow();
  });
});
