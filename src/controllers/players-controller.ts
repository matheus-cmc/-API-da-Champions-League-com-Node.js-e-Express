import { Request, Response } from 'express';
import { getplayerservice } from '../services/players-services';
import { ok } from '../utills/http-helper';


export const getPlayers = async (req: Request, res: Response) => {
    const HttpResponse = await getplayerservice();
    res.status(HttpResponse.statuscode).json(HttpResponse.body);
  };