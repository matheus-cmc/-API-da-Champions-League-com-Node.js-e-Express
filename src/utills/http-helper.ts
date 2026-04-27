interface HttpResponse {
    statuscode: number;
    body: any;
}


export const ok = async (data: any): Promise<HttpResponse> =>{
    return {
        statuscode: 200,
        body: data
    };
};