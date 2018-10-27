import fetch from "node-fetch";

//the following is a typescript interface. 
//i simply looked at the Dota API data and made this manually
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

// json_data_cache is a list/array of Match that is what ": Match[]" after the name means
let json_data_cache: Match[] = [];

// get_data is a async function meaning that it returns a promise that something will eventually happen not a value
let get_data = async () => {
    // request public Matches form Dota api and await for it to return since fetch returns a promise and not the data itself
    let data = await fetch('https://api.opendota.com/api/publicMatches')
    // json_from_server is a list of Match since we are telling the compiler to interpret data.json() as Match[]
    // the data.json() returns a promise and we tell it to wait until the promise is resolved 
    let json_from_server = await data.json() as Match[];
    // output json_from_server to screen
    console.log(json_from_server);

    // here the filter takes one Match at a time and checks if we want to store it in filtered_json_from_server
    // typescript lets us put "types" requirements on function parameters hence the ": Match" for the function callback
    // a callback is a function given as a perimeter to function so that the function can be used by the callee to do something
    // in this example we are telling filter what to do for each Match in Match[] 
    let filtered_json_from_server: Match[] = json_from_server.filter((match: Match) =>
        // if we return true that means keep it else if we return false that means dont 
        match.avg_mmr && match.avg_mmr >= 3000 && match.avg_mmr < 5000
    );

    // this is the same thing as the previous code 
    // let filtered_json_from_server: Match[] = json_from_server.filter(function(match: Match) {
    //     return match.avg_mmr !== undefined && match.avg_mmr >= 3000 && match.avg_mmr < 5000;
    // });

    // here the filter takes one Match at a time and checks if we want to store it in filtered_json_from_server
    filtered_json_from_server = filtered_json_from_server.filter((match: Match) => 
        // we check to see if the match is in json_data_cache if it is find will return the match if it is not find will return undefined
        // hence we are returning true if find returns undefined. meaning the filter will updated filtered_json_from_server to only 
        // Matches that are not in the Json_data_cache
        json_data_cache.find((cache_match: Match) => match.match_id === cache_match.match_id) === undefined
    )

    // update the Json_data_cache so that it contains filtered_json_from_server
    json_data_cache = [...json_data_cache, ...filtered_json_from_server];
    // another way to do this is 
    // json_data_cache = json_data_cache.concat(filtered_json_from_server);

    // now wait a 500 milliseconds and do this again
    setTimeout(() => get_data(), 500);
}

// this is the starting point this gets the whole process going 
get_data()
