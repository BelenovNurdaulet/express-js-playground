export const asyncHandler = (fn) => (error, req, res, next) => {
    Promise.resolve(fn(req,res,next)).catch(next);
}