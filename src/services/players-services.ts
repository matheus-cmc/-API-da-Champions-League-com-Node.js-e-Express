import { PlayerModel } from "../models/player-model";
import { StatisticsModel } from "../models/statitiscs-model";
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

export const deletePlayerService = async (id: number) =>{
  let response = null;
  const deleted = await PlayerRepository.deleteonePlayer(id);

  if(deleted){
    response = await httpResponse.ok("jogador deletado com sucesso");
  } else {
    response = await httpResponse.notFound("jogador não encontrado");
  }

  return response;
}

export const updatePlayerService = async (id: number, Statistics: StatisticsModel) =>{
 const data = await PlayerRepository.findandModufyPlayer(id, Statistics);
let response = null;
const isdeleted = await PlayerRepository.deleteonePlayer(id);
 if(data){
    return await httpResponse.ok(data);
 }else{
    return await httpResponse.notFound("jogador não encontrado");
 }

 if(isdeleted){
    response = await httpResponse.ok("jogador atualizado com sucesso");
 }else{
    response = await httpResponse.notFound("jogador não encontrado");
 }
 

}