import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import LoginController from './app/controllers/LoginController';
import LolController from './app/controllers/LolController';

const routes = new Router();

routes.get('/', (req, res) => {
    return res.json({
        testing: 'Ok'
    })
})

routes.post('/users', UserController.store);
routes.post('/login', LoginController.store);


routes.get('/searchingNameRoute', LolController.searchingNameRoute)
routes.get('/searchingLeagueTierRoute', LolController.searchingLeagueTierRoute)
routes.get('/MatchListRoute', LolController.MatchListRoute)
routes.get('/MatchDetailRoute', LolController.MatchDetailRoute)
routes.get('/MatchListRankedGames', LolController.MatchListRankedGames)
routes.get('/GetTheChampionNameById', LolController.GetTheChampionNameById)

routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes