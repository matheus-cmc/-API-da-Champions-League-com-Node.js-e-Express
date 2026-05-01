import { Request, Response } from 'express';
import * as service from '../services/players-services';
import { noContent } from '../utills/http-helper';


export const getPlayers = async (req: Request, res: Response) => {
    const HttpResponse = await service.getplayerservice();
    res.status(HttpResponse.statuscode).json(HttpResponse.body);
  };

export const getplayerById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const httpResponse = await service.getplayerByIdService(Number(id));
  res.status(httpResponse.statuscode).json(httpResponse.body);
}

export const postPlayer = async(req: Request, res: Response) => {
  const bodyValues = req.body;
  const httpResponse = await service.createPlayerService(bodyValues);

  if(httpResponse){
    res.status(httpResponse.statuscode).json(httpResponse.body);
  }
};
