class apiError extends Error {
    constructor(
        statuscode,
        message = "somthing went wrong",
        error = [],
        stack = ""
    ) {
        super(message)
        this.statuscode = statuscode
        this.error = error
        this.stack = stack
        this.data = null
        this.success = false
        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {apiError}