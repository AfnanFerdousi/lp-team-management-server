import IGenericErrorMessage from "./error";

export type IGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorMessage: IGenericErrorMessage[];
};
export type name = {
    firstName: string;
    lastName: string;
};