var fs = require('fs'); //import de la bibliothèque fs
var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

let i = 1;
let create_room = true;
let create_user = true;
let room_exist = false;
let Rooms = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting up cross-origin policy
const cors = require('cors');
app.use(cors({
    origin: 'null'
}));

// [url]/add_usr?r=[roomCode]&user=[userName] ajoute l'utilisateur user dans la room r
app.get('/add_usr', function(req, res) {
    create_user = true;
    if("r" in req.query && "user" in req.query) {
        for(var key in Rooms){
            if(Rooms[key].name == req.query.r){
                // Regarde si user est déjà dans Rooms
                if(Rooms[key].users.includes(req.query.user)){
                    create_user = false;
                }
                
                if(create_user){
                    // Push l'utilisateur à la fin de users
                    Rooms[key].users.push(req.query.user);
                    res.send(true);
                }
                else{
                    throw(new Error("username déjà pris"));
                }
            }
        }
    } else {
        throw(new Error("Pas de parametres"));
    }
});

// [url]/create?r=[roomCode]&user=[userName] crée une room
app.get('/create', function(req, res) {
    create_room = true; // la variable est a true si la room n'existe pas déjà
    if("r" in req.query && "user" in req.query) {
        for(var key in Rooms){
            if(Rooms[key].name == req.query.r){
                create_room = false;
            }
        }
        if(create_room){
            Rooms["room"+i] = {};
            Rooms["room"+i].name = req.query.r;
            Rooms["room"+i].question = "";
            Rooms["room"+i].users = [req.query.user];
            Rooms["room"+i].started = "false";
            Rooms["room"+i].votes = {};
            i++;
            res.send(true);
        }
        else{
            throw(new Error("room déjà existante"));
        }
    } else {
        res.send("Pas de parametres");
    }
});

// [url]/delete?r=[roomCode]&user=[userName] supprime l'utilisateur user de la room r
// si plus d'utilisateur dans la room, supprime la room
app.get('/delete', function(req, res) {
    let roomname;
    if("r" in req.query && "user" in req.query) {
        for(var key in Rooms){
            if(Rooms[key].name == req.query.r){
                roomname = key;
                break;
            }
        }
        if(roomname && Rooms[roomname].users){
            const userIndex = Rooms[roomname].users.indexOf(req.query.user);
            if(userIndex !== -1){
                // supprime l'utilisateur de users
                Rooms[roomname].users.splice(userIndex, 1);

                if (Rooms[roomname].votes && Rooms[roomname].votes[req.query.user]) {
                    delete Rooms[roomname].votes[req.query.user];
                }
                
                // vérification de si la room doit être supprimée ou non ==> il n'y a plus d'utilisateurs
                if(Rooms[roomname].users.length === 0){
                    delete Rooms[roomname];
                }
            }
        }
    }
    else{
        res.send(false);
    }
});

// [url]/isroomvalid?room=[roomCode] vérifie si la room existe
app.get('/isroomvalid', function(req, res) {
    room_exist = false;
    if("room" in req.query){
        for(var key in Rooms){
            if(Rooms[key].name == req.query.room){
                res.send(true);
                room_exist = true;
                break;
            }
        }
        if(!room_exist){
            res.send(false);
        }
    }
    else{
        res.send(false);
    }
});

// [url]/part?room=[roomCode] retourne le contenu de l'objet traduisant la room
app.get('/part', function(req, res) {
    room_exist = false;
    if("room" in req.query){
        for(var key in Rooms){
            if(Rooms[key].name == req.query.room){
                res.send(Rooms[key]);
                room_exist = true;
                break;
            }
        }
        if(!room_exist){
            res.send(false);
        }
    }
    else{
        res.send(false);
    }
});

// [url]/json retourne tout le contenu du json
app.get('/json', function(req, res) {
    res.json(Rooms);
});

// [url]/question?r=[roomCode] met une question aléatoire dans l'objet de la room
app.get('/question', function(req, res) {
    if("r" in req.query){
        let RoomCode = req.query.r;
        // on lit le fichier Question.txt
        fs.readFile('./serveur/Question.txt', 'utf-8', (err, data) => {
            if(err){
                res.status(500).send("Error reading questions file");
                return;
            }
            let words = data.split("\n"); // on divise les lignes
            // on supprime les lignes vides
            words = words.filter(word => word.trim().length > 0);
            if(words.length > 0){
                let Question = words[Math.floor(Math.random() * words.length)]; 
                for (var key in Rooms) {
                        if (Rooms[key].name == RoomCode) {
                            Rooms[key].question = Question;
                            Rooms[key].votes = {};
                            res.send(Rooms[key]);
                            break;
                        }
                    }
            } else {
                res.send("No questions available");
            }
        });
    }
    else{
        res.send(false);
    }
});

// [url]/start_game?r=[roomCode] démarre le jeu chez tous les utilisateurs
app.get('/start_game', function(req, res) {
    if("r" in req.query){
        let roomCode = req.query.r;
        for (let key in Rooms) {
            if (Rooms[key].name === roomCode) {
                Rooms[key].started = "true"; 
                res.send("true");
                return;
            }
        }
        res.send("false")
    }
    else{
        res.send("false");
    }
});

// [url]/vote?r=[roomCode]&from=[userName1]&to[userName2] le vote userName2 de userName1 dans l'objet vote de la room
app.get('/vote', function(req, res) {
    if("r" in req.query && "from" in req.query && "to" in req.query){
        let roomCode = req.query.r;
        let fromUser = req.query.from; 
        let toUser = req.query.to;     
        
        for (let key in Rooms) {
            if (Rooms[key].name == roomCode) {
                if (!Rooms[key].votes) Rooms[key].votes = {};
                Rooms[key].votes[fromUser] = toUser;
                return res.send("true");
            }
        }
        res.send("false")
    }
    else{
        res.send("false");
    }
});

/*
Clément Gautret le GOOOOOOOOOOOOOOOOOOOAAAAAAAAAAAAAAAAAAAAAAAAAAAT
app.get('/question_suivante', function(req, res) { // faut utilser un fetch pour ça et un fetch pour la question et normalement on est good mais j'ai pas eu l'occas de tester
    let roomCode = req.query.r;
    for (let key in Rooms) {
        if (Rooms[key].name == roomCode) {
            Rooms[key].votes = {};
            return res.send("true");
        }
    }
    res.send("false");
});
*/

//On  peut peut-être faire une route pour stop  la game genre ? jsp

app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");