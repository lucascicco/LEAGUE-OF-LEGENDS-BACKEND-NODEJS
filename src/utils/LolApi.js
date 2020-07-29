const RiotRequest = require('riot-lol-api');

const riotRequest = new RiotRequest(process.env.LOL_API_KEY);

//Here goes the warning, the this api key needs to be renew every single day you need to work with this application, then it will be available here:
// https://developer.riotgames.com

const searchingName = (name, fn) => {
    riotRequest.request('br1', 'summoner', `/lol/summoner/v4/summoners/by-name/${name}`, (error, data) => {
        if(error){
            fn(undefined, error)
        }else{
            fn(data, undefined)
        }     
    })
}

const searchingLeagueTier =  (name, fn) => {
    riotRequest.request('br1', 'summoner', `/lol/summoner/v4/summoners/by-name/${name}`, (error, data) => {
       if(error){
           fn(undefined, undefined, error)
       }else{
           riotRequest.request('br1', 'league', `/lol/league/v4/entries/by-summoner/${data.id}`, (error, data) => {
               if(error){
                   fn(undefined, error, undefined)
               }else{
                   fn(data, undefined, undefined)
               }
               
           })
       }     
   })
}

const MatchList =  (name, fn) => {
    riotRequest.request('br1', 'summoner', `/lol/summoner/v4/summoners/by-name/${name}`, (error, data) => {
        if(error){
            fn(undefined, error)
        }else{
            riotRequest.request('br1', 'match', `/lol/match/v4/matchlists/by-account/${data.accountId}`, (error, data) => {
                if(error){
                    fn(undefined, error)
                }else{
                    fn(data, undefined)
                }
                
            })
        }     
    })
}     

const MatchDetail = async (gameId, fn) => {
       await riotRequest.request('br1', 'match', `/lol/match/v4/matches/${gameId}`, (error, data) => {
            if(error){
                fn(undefined, error)
            }else{
                fn(data, undefined)
            }
        })    
}


let championByIdCache = {};
let championJson = {};

async function getLatestChampionDDragon(language = "pt_BR") {
	if (championJson[language])
		return championJson[language];

	let response;
	let versionIndex = 0;
	do { // I loop over versions because 9.22.1 is broken
		const version = (await fetch("http://ddragon.leagueoflegends.com/api/versions.json").then(async(r) => await r.json()))[versionIndex++];
	
		response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`);
	}
	while (!response.ok)
	
	championJson[language] = await response.json();
	return championJson[language];
}

async function getChampionByKey(key, language = "pt_BR") {

	if (!championByIdCache[language]) {
		let json = await getLatestChampionDDragon(language);

        championByIdCache[language] = {};
        
		for (var championName in json.data) {
			if (!json.data.hasOwnProperty(championName))
				continue;

			const champInfo = json.data[championName];
			championByIdCache[language][champInfo.key] = champInfo;
		}
	}

	return championByIdCache[language][key];
}


module.exports = {
    searchingName,
    searchingLeagueTier,
    MatchList,
    MatchDetail
}
