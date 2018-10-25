import fetch from "node-fetch";

//the following is a typescript interface. 
//i simply looked at the Dota API data and made this manualy
//the ? mark at the end of the name means that it can be undefined
interface Match {
    match_id: number,
    match_seq_num: number,
    radiant_win: boolean,
    start_time: number,
    duration: number,
    avg_mmr?: number,
    num_mmr?: number,
    lobby_type?: number,
    game_mode?: number,
    avg_rank_tier?: number,
    num_rank_tier?: number,
    cluster?: number,
    radiant_team: string,
    dire_time: string,
}

let json_data_cache: Match[] = [];

let get_data = async () => {
    let data = await fetch('https://api.opendota.com/api/heroes')
    let json_from_server = await data.json();
    console.log(json_from_server);

    let filtered_json_from_server: Match[] = json_from_server.filter((match: Match) => 
        match.avg_mmr && match.avg_mmr >= 3000 && match.avg_mmr < 5000
    );

//  this is the same thing as the privous 
//    let filtered_json_from_server: Match[] = json_from_server.filter(function(match:any) {
//        return match.avg_mmr !== undefined && match.avg_mmr >= 3000 && match.avg_mmr < 5000;
//    });

    filtered_json_from_server = filtered_json_from_server.filter((match: Match) => 
        json_data_cache.find((cache_match: Match) => match.match_id === cache_match.match_id) === undefined
    )
    json_data_cache = [...json_data_cache, ...json_from_server];
    setTimeout(() => get_data(), 500);
}

get_data()
