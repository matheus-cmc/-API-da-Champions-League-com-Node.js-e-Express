import { PlayerModel } from "../models/player-model";
import * as PlayerRepository from "../repositories/players-repository";
import * as httpResponse from "../utills/http-helper";

export const getplayerservice = async () =>{
     const data = await PlayerRepository.findAllPlayers();
     let response = null;

     if(data){
        response = await httpResponse.ok(data);
     }else{
         
        response = await httpResponse.noContent();
     }
    return response;
};

export const getplayerByIdService = async (id: number) =>{
    const data = await PlayerRepository.findPlayerById(id);
    let response = null;

    if(data){
         response = await httpResponse.ok(data);
      }else{
        response = await httpResponse.noContent();
    }
    return response;
};

export const createPlayerService = async (player: PlayerModel) =>{

   let response = null;
   
    if(player && Object.keys(player).length !== 0){
      response = await PlayerRepository.insertPlayer(player);
      response = httpResponse.created(player);
    }else{
      response = await httpResponse.badRequest("jogador inválido");
    }
  return response;
}