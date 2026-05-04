import { ClubeModel } from "../models/clubs-model";
import fs from "fs/promises";


const database=[
    {
            id: 1,
            name: "Real Madrid",    
            },
];

export const findAllClubs = async (): Promise<ClubeModel[]> =>{
   const data = await fs.readFile("./src/data/clubs.json", "utf-8");
   const clubs = JSON.parse(data);
    return clubs;
}