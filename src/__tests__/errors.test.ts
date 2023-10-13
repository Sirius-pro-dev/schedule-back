import { errorHandling } from '../middleware/ErrorHandlingMiddleware'; // Подключите ваш файл errorHandling
import ApiError from '../error/ApiError';

describe('errorHandling', () => {
  it('should handle an ApiError and return the correct JSON response', async () => {
    const apiError = new ApiError(404, 'notFound', 'TestController');
    const req = {};
    // @ts-ignore
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandling(apiError, req, res, next);

    const jsonResponse = res.json.mock.calls[0][0];

    expect(jsonResponse.isSystemError).toBe(false);
    expect(jsonResponse.error.status).toBe(404);
    expect(jsonResponse.error.controller).toBe('TestController');
    expect(jsonResponse.error.detail).toBe('notFound');
  });

  it('should handle a non-ApiError and return a generic system error response', async () => {
    const nonApiError = new Error('Generic error');

    const req = {};
    // @ts-ignore
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandling(nonApiError, req, res, next);

    const jsonResponse = res.json.mock.calls[0][0];

    expect(jsonResponse.isSystemError).toBe(true);
  });
});
