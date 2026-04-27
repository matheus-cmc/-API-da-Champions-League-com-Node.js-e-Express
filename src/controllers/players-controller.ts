import { Request, Response } from 'express';
import { getplayerservice } from '../services/players-services';
import { ok } from '../utills/http-helper';


export const getPlayers = async (req: Request, res: Response) => {
    const data = await getplayerservice();
    const response = await ok(data);
    res.status(response.statuscode).json(response.body);
  };