import { PlayerModel } from "../models/player-model";
import { StatisticsModel } from "../models/statitiscs-model";



const database: PlayerModel[] = [
    {
        id: 1,
        name: "Erling Haaland",
        club: "Manchester City",
        nationality: "Norway",
        position: "ST",
        statistics: {
            overall: 91,
            pace: 89,
            shooting: 94,
            passing: 65,
            dribbling: 80,
            defending: 45,
            physical: 88
        }
    },
    {
        id: 2,
        name: "Kylian Mbappé",
        club: "Real Madrid",
        nationality: "France",
        position: "ST",
        statistics: {
            overall: 92,
            pace: 97,
            shooting: 90,
            passing: 80,
            dribbling: 92,
            defending: 36,
            physical: 78
        }
    },
    {
        id: 3,
        name: "Kevin De Bruyne",
        club: "Manchester City",
        nationality: "Belgium",
        position: "CM",
        statistics: {
            overall: 91,
            pace: 74,
            shooting: 86,
            passing: 93,
            dribbling: 88,
            defending: 65,
            physical: 78
        }
    },
    {
    id: 4,
    name: "Vinícius Júnior",
    club: "Real Madrid",
    nationality: "Brazil",
    position: "LW",
    statistics: {
        overall: 89,
        pace: 95,
        shooting: 84,
        passing: 80,
        dribbling: 92,
        defending: 30,
        physical: 70
    }
},
{
    id: 5,
    name: "Jude Bellingham",
    club: "Real Madrid",
    nationality: "England",
    position: "CM",
    statistics: {
        overall: 90,
        pace: 80,
        shooting: 85,
        passing: 86,
        dribbling: 88,
        defending: 78,
        physical: 84
    }
},
{
    id: 6,
    name: "Harry Kane",
    club: "Bayern Munich",
    nationality: "England",
    position: "ST",
    statistics: {
        overall: 91,
        pace: 75,
        shooting: 93,
        passing: 84,
        dribbling: 82,
        defending: 45,
        physical: 85
    }
},
{
    id: 7,
    name: "Jamal Musiala",
    club: "Bayern Munich",
    nationality: "Germany",
    position: "CAM",
    statistics: {
        overall: 87,
        pace: 86,
        shooting: 83,
        passing: 85,
        dribbling: 91,
        defending: 50,
        physical: 68
    }
},
{
    id: 8,
    name: "Pedri",
    club: "Barcelona",
    nationality: "Spain",
    position: "CM",
    statistics: {
        overall: 88,
        pace: 79,
        shooting: 75,
        passing: 89,
        dribbling: 90,
        defending: 72,
        physical: 70
    }
},
{
    id: 9,
    name: "Robert Lewandowski",
    club: "Barcelona",
    nationality: "Poland",
    position: "ST",
    statistics: {
        overall: 90,
        pace: 75,
        shooting: 92,
        passing: 80,
        dribbling: 85,
        defending: 40,
        physical: 84
    }
},
{
    id: 10,
    name: "Bukayo Saka",
    club: "Arsenal",
    nationality: "England",
    position: "RW",
    statistics: {
        overall: 88,
        pace: 90,
        shooting: 85,
        passing: 84,
        dribbling: 89,
        defending: 60,
        physical: 72
    }
},
{
    id: 11,
    name: "Martin Ødegaard",
    club: "Arsenal",
    nationality: "Norway",
    position: "CAM",
    statistics: {
        overall: 88,
        pace: 78,
        shooting: 82,
        passing: 90,
        dribbling: 88,
        defending: 58,
        physical: 70
    }
},
{
    id: 12,
    name: "Victor Osimhen",
    club: "Napoli",
    nationality: "Nigeria",
    position: "ST",
    statistics: {
        overall: 88,
        pace: 91,
        shooting: 87,
        passing: 70,
        dribbling: 82,
        defending: 45,
        physical: 85
    }
},
{
    id: 13,
    name: "Khvicha Kvaratskhelia",
    club: "Napoli",
    nationality: "Georgia",
    position: "LW",
    statistics: {
        overall: 87,
        pace: 88,
        shooting: 85,
        passing: 82,
        dribbling: 90,
        defending: 40,
        physical: 70
    }
},
{
    id: 14,
    name: "Bruno Fernandes",
    club: "Manchester United",
    nationality: "Portugal",
    position: "CAM",
    statistics: {
        overall: 88,
        pace: 75,
        shooting: 86,
        passing: 90,
        dribbling: 85,
        defending: 65,
        physical: 78
    }
},
{
    id: 15,
    name: "Marcus Rashford",
    club: "Manchester United",
    nationality: "England",
    position: "LW",
    statistics: {
        overall: 87,
        pace: 93,
        shooting: 86,
        passing: 78,
        dribbling: 87,
        defending: 45,
        physical: 75
    }
}
];


export const findAllPlayers = async (): Promise<PlayerModel[]> =>{
    return database;
}

export const findPlayerById = async (id: number): Promise<PlayerModel | undefined> =>{
    return database.find((player) => player.id === id);
}

export const insertPlayer = async (player: PlayerModel) =>{
    database.push(player);
}

export const deleteonePlayer = async (id: number) =>{
    const index = database.findIndex(p => p.id === id);

    if(index !== -1){
        database.splice(index, 1);
        return true;
    }

    return false;
}

export const findandModufyPlayer = async (id: number, statistics: StatisticsModel) =>{
   const playerIndex = database.findIndex(players => players.id ===id);

   if(playerIndex !== -1){
    database[playerIndex].statistics = statistics.statistics;
    return database[playerIndex];
   }
}
