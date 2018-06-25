
import { auth } from './auth'
import { games } from './games'
import { addGame } from './addGame'
import { viewGame } from './viewGame'
import { players } from './players'
import { addPlayer } from './addPlayer'
import { editPlayer } from './editPlayer'
import { addRakeoff } from './addRakeoff'
import { rakeoffs } from './rakeoffs'
import { club } from './club'
import { req } from './req'
import { gamePlayer } from './gamePlayer'
import { joinGame } from './joinGame'
import { joinGameInner } from './joinGameInner'
import { gameDowns } from './gameDowns'
import { report } from './report'
import { combineReducers } from 'redux'

export default combineReducers({
    auth,
    games,
    addGame,
    viewGame,
    players,
    addPlayer,
    editPlayer,
    addRakeoff,
    rakeoffs,
    club,
    req,
    gamePlayer, 
    joinGame,
    joinGameInner,
    gameDowns,
    report,
})