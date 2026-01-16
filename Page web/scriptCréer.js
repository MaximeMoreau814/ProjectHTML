
var i = 0;
// la taille maximale pour les block de résultat de vote
var votemax = 400;

// la fonction d'animation
function myMove(wmax,idEle) {
    var id = null;
    var elem = document.getElementById(idEle); // elem est le block à animer
    var width = 0;
    clearInterval(id);
    id = setInterval(frame, 10); // toutes les 10ms, une nouvelle image
    function frame() {
        if (width == wmax) {
        clearInterval(id); // suppression de l'animation
        } else {
            width++;
            elem.style.width = width + 'px';
        }
    }
}

// affiche un popup d'avertissement avant la fermeture de la page
window.onbeforeunload = function(e) {
    e.preventDefault();
}

// éxecute à la fermeture de la page
window.addEventListener('unload', function (e) {
    fetch('http://localhost:8080/delete?r='+localStorage.getItem('roomcode')+"&user="+localStorage.getItem('username'), {
            keepalive: true // cette option permet de faire le fetch pendant et après la fermeture de la page
        });
    localStorage.setItem('quit', 'true');
});

// deux événements liés à l'onglet des participants
const block = document.getElementById("Liste-joueur");
document.querySelector("#player-btn").addEventListener("click", function() { // affiche l'onglet
    block.style.visibility="visible";
    document.getElementById("player-btn").style.visibility="hidden";
});
document.querySelector("#close-player-btn").addEventListener("click", function() { // masque l'onglet
    block.style.visibility="hidden";
    document.getElementById("player-btn").style.visibility="visible";
});

// un EventListener lié au bouton "Retour à l'accueil", s'il est cliqué, l'utilisateur est envoyé sur la page Index
const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", function() {
    window.location.href = "Index.html";
});

// un EventListener lié au bouton "Copier/Partager le code"
const copyBtn = document.getElementById("copy-btn");
copyBtn.addEventListener("click", function() {
    if(!localStorage.getItem('start')){ // si le jeu n'a pas commencé, le code de la room est dans l'objet d'id code-box
        text = document.getElementById("code-box").textContent;
        navigator.clipboard.writeText(text).then(() => { // enregistrer text dans le presse-papier
            alert("Code copié : " + text);
        }).catch(() => {
            alert("Impossible de copier le code !");
        });
    }
    else{ // sinon il est dans l'objet d'id code
        text = document.getElementById("code").textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert("Code copié : " + text);
        }).catch(() => {
            alert("Impossible de copier le code !");
        });
    }
});

// un EventListener lié au bouton "Lancer la partie"
const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", function() {
    let roomCode = localStorage.getItem('roomcode');
    fetch('http://localhost:8080/start_game?r=' + roomCode)
    .then(response => response.text())
    .then(data => {
        if(data === "true") {
            console.log("Lancement de la partie");
        }
    });
    fetch('http://localhost:8080/question?r=' + roomCode)
    .then(res => res.json())
    .then(data => {});
});

// fonction bouclée
function updateInfo(){
    let roomCode = localStorage.getItem('roomcode');
    fetch('http://localhost:8080/part?room=' + roomCode) // retourne toutes les informations de cette room
    .then(response => response.json())
    .then(roomData => {
        if (roomData == false) return;
        const listeuser = document.getElementById("users");
        listeuser.innerHTML = "";
        if(roomData.users && Array.isArray(roomData.users)){ // remplit l'onglet des utilisateurs
            roomData.users.forEach(username => {
                let li = document.createElement("li");
                li.textContent = username;
                li.className = "user";
                listeuser.appendChild(li);
            });
        }  
        const questionElement = document.querySelector(".question"); // la question en cours sur la page
        if (questionElement && roomData.question && questionElement.textContent !== roomData.question) {
            localStorage.removeItem("result"); // une variable utile pour la partie résultat
            questionElement.textContent = roomData.question; // on met à jour la question en cours
            document.getElementById("Answer").innerHTML = "";
            const container = document.getElementById("Answer");
            container.style.alignItems = "center";
            container.style.height = "auto";
            container.style.display = "flex";
            buttons();
        }
    });
    // si le jeu a commencé, exécuter la fonction buttons
    if (localStorage.getItem('start') === "true") {
            buttons(); 
    }
    fetch('http://localhost:8080/part?room=' + roomCode)
    .then(response => response.json())
    .then(roomData => {
        // si un utilisateur arrive dans le jeu en plain milieu, le jeu est automatiquement démarré pour lui
        if (roomData.started === "true" && !localStorage.getItem('start')) {
            localStorage.setItem("start", "true");
            main();
        }
        // si l'utilisateur n'a pas de userName, il est renvoyé en page Index
        if (!roomData || !roomData.users.includes(localStorage.getItem('username'))) {
                localStorage.clear();
                window.location.href = "Index.html"; 
                return;
            }
    });
}

// une fonction pour afficher la première partie du jeu : le vote
function buttons() {
    let roomCode = localStorage.getItem('roomcode');
    let moi = localStorage.getItem('username');
    const container = document.getElementById("Answer"); 
    if (!container) return;
    fetch('http://localhost:8080/part?room=' + roomCode)
    .then(response => response.json())
    .then(roomData => {
        // si tout l'utilisateur a voté, on affiche un message d'attente
        if (roomData.votes && roomData.votes[moi]) {
            if(!container.getElementsByClassName("msg-attente").length != 0){
                container.innerHTML = "<p class='msg-attente' id='msg-att'>Vote enregistré !<br><span>Attente des autres joueurs...</span></p>";
            }
            // si tout le monde a voté, on exécute la fonction result
            if (Object.keys(roomData.votes).length >= roomData.users.length) {
                console.log("Tous les votes sont enregistrés.");
                result();
            }
            return;
        }
        // l'affichage des boutons
        if(roomData.users && Array.isArray(roomData.users)){
            container.innerHTML = "";
            container.style.visibility = "visible"; 
            container.style.position = "static";
            roomData.users.forEach(username => {
                let btn = document.createElement("button");
                btn.className = "btn-rep";
                btn.textContent = username;                
                btn.onclick = function() {
                    fetch(`http://localhost:8080/vote?r=${roomCode}&from=${moi}&to=${username}`)
                    .then(() => {
                        console.log("Vote envoyé pour : " + username);
                        buttons(); 
                    });
                };
                container.appendChild(btn);
            });
            document.getElementById("foot").style.marginTop = 10*(roomData.users.length-1) + "px";
        }
    });
}

// fonction pour la deuxième partie du jeu : les résultats des votes
function result() {
    let top=0;
    let Macron = {}; // objets contenant les résultats des votes
    fetch('http://localhost:8080/part?room=' + localStorage.getItem('roomcode'))
    .then(response => response.json())
    .then(roomData => {
        document.getElementById("msg-att").style.visibility = "hidden"; // on efface le message de vote
        const container = document.getElementById("Answer"); 
        container.style.alignItems = "normal";
        // on manipule la position de la partie du bas pour qu'il ne soit pas sous les résultats
        // on ne le fait que si localStorage.getItem("result") existe pour ne le faire qu'une seule fois 
        // et ne pas avoir la partie du bas qui se déplace à chaque personne qui part de la room
        if(localStorage.getItem("result") !== "true"){
            document.getElementById("foot").style.marginTop = 100*(roomData.users.length-2) + "px";
        }
        localStorage.setItem("result","true");
        // on calcule le nombre de votes pour chacun
        for(var key in roomData.votes){
            if(!Macron[roomData.votes[key]]){
                Macron[roomData.votes[key]]=1;
            }
            else{
                Macron[roomData.votes[key]]++;
            }
        }
        for(var key in roomData.users){
            if(!Macron[roomData.users[key]]){
                Macron[roomData.users[key]]=0;
            }
        }
        // si les block de résultats n'existent pas, ils sont créés
        if(container.getElementsByClassName("anim").length == 0){
            for(var key in Macron){
                let anim = document.createElement("div");
                anim.className = "anim";
                anim.id = "anim"+i
                anim.innerText = key + ":" + Math.round((votemax*Macron[key]/roomData.users.length)/4) + "%";
                // on manipule la position des blocks pour un meilleur affichage
                if(top > 0){
                    anim.style.top = top+"px";
                    top+=75;
                }
                else{
                    top=300;
                }
                container.appendChild(anim);
                // on associe une animation au block précédemment créé
                myMove(Math.round(votemax*Macron[key]/roomData.users.length),"anim"+i)
                i++;
            }
        }
        // on ajoute le bouton pour passer à la question suivante
        if (!document.getElementById("btn-next-round")) {
            let nextBtn = document.createElement("button");
            nextBtn.id = "btn-next-round"; 
            nextBtn.className = "btn-next";     
            nextBtn.textContent = "Question Suivante";
            // on manipule aussi sa position
            nextBtn.style.top = (roomData.users.length-2) * 100 + 'px'
            // on génère une nouvelle question pour déclencher le script plus haut
            nextBtn.onclick = function() {
                let roomCode = localStorage.getItem('roomcode');
                fetch('http://localhost:8080/question?r=' + roomCode)
                .then(res => res.json())
                .then(data => {
                    console.log("oui c'est bueno");
                });
            };
            container.appendChild(nextBtn);
        }
    });
}

// fonction principale
function main(){
    const quit = localStorage.getItem('quit');
    const roomCode = localStorage.getItem('roomcode');
    const username = localStorage.getItem('username');
    // la variable quit permet d'empêcher une déconnection après un rafraichissement de la page
    if (quit === 'true' && roomCode) {
        fetch('http://localhost:8080/isroomvalid?room=' + roomCode)
            .then(res => res.text())
            .then(isValid => {
                if (isValid === "true") {
                    fetch('http://localhost:8080/add_usr?r=' + roomCode + '&user=' + username)
                        .then(() => {
                            localStorage.removeItem('quit');
                            main(); 
                        })
                        .catch(() => {
                            window.location.href = "Index.html";
                        });
                    return;
                } else {
                    localStorage.removeItem('roomcode');
                    localStorage.removeItem('quit');
                    localStorage.removeItem('start');
                    main(); 
                }
            });
    } 
    else {
        // si le jeu n'a pas commencé
        if(!localStorage.getItem('start')){
            // si la room est en train de se créer (il n'y a pas de roomCode)
            if(!localStorage.getItem('roomcode')){
                let code="";
                function generateCode() {
                    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

                    for (let i = 0; i < 5; i++) {
                        code += letters[Math.floor(Math.random()*26)];
                    }
                    //document.getElementById("code-box").textContent = code;
                    fetch('http://localhost:8080/create?r='+code+"&user="+localStorage.getItem('username')).then(response => response.text()).then(data => {
                        if(data =! "true"){
                            generateCode();
                        }
                    });
                }
                generateCode();
                localStorage.setItem('roomcode',code);
                document.getElementById("code-box").textContent = code; // on ajoute le code dans le block d'id code-box

            }
            else{
                let text=localStorage.getItem('roomcode');
                document.getElementById("code-box").textContent = text;
                console.log(text);
            }
        }
        else{
            // si le jeu a commencé, le texte de bienvenue est rapetissé
            document.getElementById("bienvenue").style.fontSize="1em";
            let roomCode = localStorage.getItem('roomcode');
            // remplacer le bloc indication par le bloc de question
            fetch('http://localhost:8080/part?room=' + roomCode)
            .then(res => res.json())
            .then(data => {
                let element = document.createElement("p");
                element.className = "question";
                element.textContent = data.question;
                console.log(data.question);
                const indication = document.getElementById("indication");
                if (indication) {
                    document.body.replaceChild(element, indication);
                }
            });
            //remplacer le bloc code-box par un bloc de boutons de réponse
            element = document.getElementById("code-box");
            element.remove();
            buttons(); 
            // on cache le bouton de démarrage
            element = document.getElementById("start-btn");
            element.remove();
            // on affiche le code
            document.getElementById("foot").style.visibility = "visible";
        }
    }
    // le code est affiché dans le block d'id code
    document.getElementById("code").textContent = localStorage.getItem('roomcode');
    // la fonction updateInfo est bouclée
    setInterval(updateInfo, 1000);
}

// on appelle la fonction principale
main();