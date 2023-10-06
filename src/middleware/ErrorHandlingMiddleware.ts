import ApiError from '../error/ApiError';

export const errorHandling = function (err: any, req: any, res: any, next: any) {
  if (err instanceof ApiError) {
    const errorResponse = {
      isSystemError: false,
      error: {
        time: new Date(),
        status: err.status,
        title: err.title,
        detail: err.detail,
        controller: err.controllerName
      }
    };

    return res.status(err.status).json(errorResponse);
  }

  const systemErrorResponse = {
    isSystemError: true,
    error: {
      time: new Date(),
      status: err.status,
      title: err.statusText,
      controller: err.controllerName
    }
  };

  return res.status(500).json(systemErrorResponse);
};
