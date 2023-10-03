class ApiError extends Error {
    status: number;
    title?: string;
    detail: string;
    controllerName: string;
    constructor(status: number, detail: string, controllerName: string) {
        super();
        this.status = status;
        this.detail = detail;
        this.controllerName = controllerName;
    }

    static badRequest(detail: string, controllerName: string) {
        const apiError = new ApiError(400, detail, controllerName);
        apiError.title = 'badRequest'
        return apiError
    }

    static notFound(detail: string, controllerName: string) {
        const apiError = new ApiError(404, detail, controllerName);
        apiError.title = 'notFound';
        return apiError;
    }
 
    static badGateway(detail: string, controllerName: string) {
        const apiError = new ApiError(503, detail, controllerName);
        apiError.title = 'badGateway';
        return apiError;
    }

    static unauthorized(detail: string, controllerName: string) {
        const apiError = new ApiError(401, detail, controllerName);
        apiError.title = 'unauthorized';
        return apiError;
    }

    static forbidden(detail: string, controllerName: string) {
        const apiError = new ApiError(403, detail, controllerName);
        apiError.title = 'forbidden';
        return apiError;
    }
}

export default ApiError;