import { 
    searchingName,
    searchingLeagueTier,
    MatchList,
    MatchDetail
    } from '../../utils/LolApi'

import axios from 'axios';

class LolController{
    searchingNameRoute(req, res){
         searchingName(req.query.nickname, (data, error) => {
            if(error){
                return res.status(400).json({
                    error: error
                })
            }else{
                return res.json({
                    nickname: data.name,
                    id: data.id,
                    account_id: data.accountId,
                })
            }
        })
    }

    searchingLeagueTierRoute(req, res){
        searchingLeagueTier(req.query.nickname, (data, error, error2) => {
            if(error2){
                return res.status(400).json({
                    error: 'Usuário não existente'
                })
            }
            else if(error){
                return res.status(400).json({
                    error: error
                })
            }
            else if(data.length === 0){

                return res.json({
                    tier: 'UNRANKED'
                })
                
            }else{
                const { 
                    summonerName,
                    queueType,
                    tier,
                    rank,
                    leaguePoints,
                    wins,
                    losses
                } = data[0]

                return res.json({
                    nickname: summonerName,
                    queueType,
                    tier,
                    rank,
                    leaguePoints,
                    wins,
                    losses
                })
                
            }
        })
    }

    MatchListRoute(req, res){
        MatchList(req.query.nickname, (data, error) => {
            if(error){
                return res.status(400).json({
                    error: error
                })
            }else{
                return res.json({
                    matches: data.matches
                })
            }
        })
    }

    MatchListRankedGames(req,res){
        MatchList(req.query.nickname, (data, error) => {
            if(error){
                return res.status(400).json({
                    error: error
                })
            }else{
                const dataMatches = data.matches

                const RANKED_SOLO_5v5 = dataMatches.filter(item => {
                    return item.queue === 420
                })

                const partidas = RANKED_SOLO_5v5.slice(0,10)

                return res.json(partidas)
            }
        })
    }

      MatchDetailRoute(req, res){
        MatchDetail(req.query.gameId, async (data, error) => {
            if(data){
            
                const {player, participantId} = data.participantIdentities.find(player => {
                    return player.player.currentAccountId == req.query.accountId
                })
                
                const participant = data.participants.find(item => {
                    return item.participantId === participantId
                })
                
                const {win, kills, deaths, assists} = participant.stats

                const {championId} = participant

                const Url = await axios.get(`http://localhost:3333/GetTheChampionNameById?key=${championId}`)
                const championUrl = Url.data.url

                const DataComputed = {
                    gameId: data.gameId,
                    player,
                    win,
                    kills,
                    deaths,
                    assists,
                    championId,
                    championUrl
                }

                return res.json(DataComputed)

            }else{  
                return res.status(400).json({
                    error: error
                })
                
            }
        })
    }

    async GetTheChampionNameById(req, res){
       try{
            const key = req.query.key;

            const response = await axios.get('http://ddragon.leagueoflegends.com/cdn/10.15.1/data/en_US/champion.json')
       
            const json = response.data
            
            let championByIdCache = {};
                
            for (var championName in json.data) {
                    if (!json.data.hasOwnProperty(championName))
                        continue;
        
                    const champInfo = json.data[championName];
                    championByIdCache[champInfo.key] = champInfo;
            }
            
            const fixingName = (x) => {
                if(x.indexOf("'") !== -1){
                    const ReformatedName = x.trim().split("'")
                    const NameByComplete = ReformatedName[0] + ReformatedName[1].replace(/^\w/, (c) => c.toLowerCase())
        
                    return NameByComplete
                }else{
                    return x
                }
            }

            const ChampionName = fixingName(championByIdCache[key].name)

            res.json({
                 url: `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${ChampionName}_0.jpg`
            })
    
       }catch(e){

            res.status(400).json({
                error: 'Erro!'
            })
       }
    }

}

export default new LolController()
