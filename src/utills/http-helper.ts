import { HttpResponse } from "../models/player-model";



export const ok = async (data: any): Promise<HttpResponse> =>{
    return {
        statuscode: 200,
        body: data
    };
};

export const created = async (data: any): Promise<HttpResponse> =>{
    return {
        statuscode: 201,
        body: {
            message: "sucesso",
        }
    }
};

export const noContent= async():Promise<HttpResponse> =>{
     return{
        statuscode: 204,
        body: null
     }
}

export const badRequest = async (message: string): Promise<HttpResponse> =>{
    return {
        statuscode: 400,
        body: { message },
    }
}

export const notFound = async (message: string): Promise<HttpResponse> =>{
    return {
        statuscode: 404,
        body: { message },
    }
}