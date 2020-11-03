/**
 * This module implements a REST-inspired webservice for the Monopoly DB.
 * The database is hosted on ElephantSQL.
 *
 * Currently, the service supports the player table only.
 *
 * @author: kvlinden
 * @date: Summer, 2020
 */

// Set up the database connection.

const pgp = require('pg-promise')();
const db = pgp({
    host: process.env.SERVER,
    port: 5432,
    database: process.env.USER,
    user: process.env.USER,
    password: process.env.PASSWORD
});

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Configure the server and its routes.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

// Home screen
router.get("/", readHelloMessage);

// Players
router.get("/players", readPlayers);
router.get("/players/:id", readPlayer);
router.put("/players/:id", updatePlayer);
router.post('/players', createPlayer);
router.delete('/players/:id', deletePlayer);

// PlayerGame
router.get("/playergame", readPlayerGames);
router.get("/playergame/game=:id", readPlayersInGame);
router.get("/playergame/player=:id", readGamesWithPlayer);
// router.put("/playergame/:id", updatePlayerGame);
// router.post('/playergame', createPlayerGame);
// router.delete('/playergame/:id', deletePlayerGame);

// Players and PlayerGame
router.get("/player_playergame", joinPlayer_PlayerGame);

app.use(router);
app.use(errorHandler);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function errorHandler(err, req, res) {
    if (app.get('env') === "development") {
        console.log(err);
    }
    res.sendStatus(err.status || 500);
}

function returnDataOr404(res, data) {
    if (data == null) {
        res.sendStatus(404);
    } else {
        res.send(data);
    }
}

/**************************************
            Home Screen
 **************************************/

function readHelloMessage(req, res) {
    res.send('Hello, CS 262 Monopoly service!\n');
}


/**************************************
            Player
 **************************************/

function readPlayers(req, res, next) {
    db.many("SELECT * FROM Player")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readPlayer(req, res, next) {
    db.oneOrNone(`SELECT * FROM Player WHERE id=${req.params.id}`)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updatePlayer(req, res, next) {
    db.oneOrNone(`UPDATE Player SET email=$(email), name=$(name) WHERE id=${req.params.id} RETURNING id`, req.body)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createPlayer(req, res, next) {
    db.one(`INSERT INTO Player(email, name) VALUES ($(email), $(name)) RETURNING id`, req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deletePlayer(req, res, next) {
    db.oneOrNone(`DELETE FROM Player WHERE id=${req.params.id} RETURNING id`)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

/**************************************
            PlayerGame
 **************************************/

function readPlayerGames(req, res, next) {
    db.many("SELECT * FROM PlayerGame")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readPlayersInGame(req, res, next) {
    db.many(`SELECT * FROM PlayerGame WHERE gameID=${req.params.id}`)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readGamesWithPlayer(req, res, next) {
    db.many(`SELECT * FROM PlayerGame WHERE playerID=${req.params.id}`)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

/**************************************
        Player and PlayerGame
 **************************************/

function joinPlayer_PlayerGame(req, res, next) {
    db.many("SELECT * FROM Player, PlayerGame WHERE playerID = Player.ID")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}