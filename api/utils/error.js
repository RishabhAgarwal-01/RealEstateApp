
//custom error handler to give the errors which are not present in the internal implementation
export const errorHandler =(statusCode, message)=>{
    const error = new Error();
    error.statusCode= statusCode;
    error.message= message;
    return error;
}