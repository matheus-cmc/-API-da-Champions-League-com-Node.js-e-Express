import * as PlayerRepository from "../repositories/players-repository";
import { findAllPlayers } from "../repositories/players-repository";
import { noContent, ok } from "../utills/http-helper";

export const getplayerservice = async () =>{
     const data = await PlayerRepository.findAllPlayers();
     let response = null;

     if(data){
        response = await ok(data);
     }else{
         
        response = await noContent();
     }
    return response;
}