var fs = require('fs');
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

app.get('/add_usr', function(req, res) {
    create_user = true;
    if("r" in req.query && "user" in req.query) {
        for(var key in Rooms){
            if(Rooms[key].name == req.query.r){
                // CHANGED: Check if user already exists in the users array
                if(Rooms[key].users.includes(req.query.user)){
                    create_user = false;
                }
                
                if(create_user){
                    // CHANGED: Simply push the user to the users array
                    Rooms[key].users.push(req.query.user);
                    res.send(true);
                }
                else{
                    throw(new Error("username déjà pris"));
                }
            }
        }
    } else {
        res.send("Pas de parametres");
    }
});

app.get('/join', function(req, res) {
    room_exist = false;
    if("r" in req.query) {
        for(var key in Rooms){
            if(Rooms[key].name == req.query.r){
                res.send(true);
                room_exist = true;
            }
        }
        if(!room_exist){
            throw(new Error("room n'existe pas"));
        }
    } else {
        res.send("Pas de parametres");
    }
})

app.get('/create', function(req, res) {
    create_room = true;
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

app.get('/delete', function(req, res) {
    let roomname;
    let username;
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
                // Remove user from array
                Rooms[roomname].users.splice(userIndex, 1);
                
                // Check if room should be deleted (only name, users array, and questions left)
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

app.get('/json', function(req, res) {
    res.json(Rooms);
});

app.get('/question', function(req, res) { 
    let RoomCode = req.query.r;
    fs.readFile('./serveur/Question.txt', 'utf-8', (err, data) => {
        if(err){
            res.status(500).send("Error reading questions file");
            return;
        }
        let words = data.split("\n");
        // Filter out empty lines
        words = words.filter(word => word.trim().length > 0);
        if(words.length > 0){
            let Question = words[Math.floor(Math.random() * words.length)]; 
            for (var key in Rooms) {
                    if (Rooms[key].name == RoomCode) {
                        Rooms[key].question = Question;
                        res.send(Rooms[key]);
                        break;
                    }
                }
        } else {
            res.send("No questions available");
        }
    });
});
app.get('/start_game', function(req, res) {
    let roomCode = req.query.r;
    for (let key in Rooms) {
        if (Rooms[key].name === roomCode) {
            Rooms[key].started = "true"; 
            res.send("true");
            return;
        }
    }
    res.send("false");
});
app.get('/vote', function(req, res) {
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
    res.send("false");
});

app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");