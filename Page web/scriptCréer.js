var i=0;
var votemax = 400;

function myMove(wmax,idEle) {
    var id = null;
    var elem = document.getElementById(idEle);
    var width = 0;
    clearInterval(id);
    id = setInterval(frame, 10);
    function frame() {
        if (width == wmax) {
        clearInterval(id);
        } else {
            width++;
            elem.style.width = width + 'px';
        }
    }
}

window.onbeforeunload = function(e) {
    e.preventDefault();
}

window.addEventListener('unload', function (e) {
    fetch('http://localhost:8080/delete?r='+localStorage.getItem('roomcode')+"&user="+localStorage.getItem('username'), {
            keepalive: true // this is important!
        });
    localStorage.clear();
});

const block = document.getElementById("Liste-joueur");
document.querySelector("#player-btn").addEventListener("click", function() {
    block.style.visibility="visible";
    document.getElementById("player-btn").style.visibility="hidden";
});
document.querySelector("#close-player-btn").addEventListener("click", function() {
    block.style.visibility="hidden";
    document.getElementById("player-btn").style.visibility="visible";
});

const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", function() {
    window.location.href = "Index.html";
});

const copyBtn = document.getElementById("copy-btn");
copyBtn.addEventListener("click", function() {
    if(!localStorage.getItem('start')){
    text = document.getElementById("code-box").textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("Code copié : " + text);
    }).catch(() => {
        alert("Impossible de copier le code !");
    });
    }
    else{
        text = document.getElementById("code").textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert("Code copié : " + text);
        }).catch(() => {
            alert("Impossible de copier le code !");
        });
    }
});

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

function updateInfo(){
    let roomCode = localStorage.getItem('roomcode');
    fetch('http://localhost:8080/part?room=' + roomCode)
    .then(response => response.json())
    .then(roomData => {
        if (roomData == false) return;
        const listeuser = document.getElementById("users");
        listeuser.innerHTML = "";
        if(roomData.users && Array.isArray(roomData.users)){
            roomData.users.forEach(username => {
                let li = document.createElement("li");
                li.textContent = username;
                li.className = "user";
                listeuser.appendChild(li);
            });
        }  
        const questionElement = document.querySelector(".question");
        if (questionElement && roomData.question && questionElement.textContent !== roomData.question) {
            questionElement.textContent = roomData.question;
            document.getElementById("Answer").innerHTML = "";
            const container = document.getElementById("Answer");
            container.style.alignItems = "center";
            container.style.height = "auto";
            container.style.display = "flex";
            buttons();
        }
    });
    if (localStorage.getItem('start') === "true") {
            buttons(); 
        }
    fetch('http://localhost:8080/part?room=' + roomCode)
    .then(response => response.json())
    .then(roomData => {
        if (roomData.started === "true" && !localStorage.getItem('start')) {
            localStorage.setItem("start", "true");
            main();
        }
    });
}

function buttons() {
    let roomCode = localStorage.getItem('roomcode');
    let moi = localStorage.getItem('username');
    const container = document.getElementById("Answer"); 
    if (!container) return;
    fetch('http://localhost:8080/part?room=' + roomCode)
    .then(response => response.json())
    .then(roomData => {
        if (roomData.votes && roomData.votes[moi]) {
            if(!container.getElementsByClassName("msg-attente").length != 0){
                container.innerHTML = "<p class='msg-attente' id='msg-att'>Vote enregistré !<br><span>Attente des autres joueurs...</span></p>";
            }
            if (Object.keys(roomData.votes).length >= roomData.users.length) {
                console.log("Tous les votes sont enregistrés.");
                result();
            }
            return;
        }
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
        }
    });
}

function result() {
    let top=0;
    let Macron = {};
    fetch('http://localhost:8080/part?room=' + localStorage.getItem('roomcode'))
    .then(response => response.json())
    .then(roomData => {
        document.getElementById("msg-att").style.visibility = "hidden";
        const container = document.getElementById("Answer"); 
        container.style.alignItems = "normal";
        document.getElementById("foot").style.marginTop = 20+60*(roomData.users.length-1) + "px";
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
        if(container.getElementsByClassName("anim").length == 0){
            for(var key in Macron){
                let anim = document.createElement("div");
                anim.className = "anim";
                anim.id = "anim"+i
                anim.innerText = key + ":" + Math.round((votemax*Macron[key]/roomData.users.length)/4) + "%";
                if(top > 0){
                    anim.style.top = top+"px";
                    top+=100;
                }
                else{
                    top=300;
                }
                container.appendChild(anim);
                myMove(Math.round(votemax*Macron[key]/roomData.users.length),"anim"+i)
                i++;
            }
        }
        if (!document.getElementById("btn-next-round")) {
        let nextBtn = document.createElement("button");
        nextBtn.id = "btn-next-round"; 
        nextBtn.className = "btn-next";     
        nextBtn.textContent = "Question Suivante";
        nextBtn.style.position = "absolute";
        nextBtn.style.top = (top + 40) + "px"; 
        nextBtn.style.left = "50%";
        nextBtn.style.transform = "translateX(-50%)"; 
        nextBtn.style.margin = "0";
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

function main(){
    if(!localStorage.getItem('start')){
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
            document.getElementById("code-box").textContent = code;

        }
        else{
            let text=localStorage.getItem('roomcode');
            document.getElementById("code-box").textContent = text;
            console.log(text);
        }
    }
    else{
        document.getElementById("bienvenue").style.fontSize="1em";
        let roomCode = localStorage.getItem('roomcode');
        //remplacer le bloc indication par le bloc de question
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

        element = document.getElementById("start-btn");
        element.remove();
        //on affiche le code
        document.getElementById("foot").style.visibility = "visible";
    }
    document.getElementById("code").textContent = localStorage.getItem('roomcode');
    setInterval(updateInfo, 1000);
}

main();

function next(){
    const container = document.getElementById("Answer"); 
    container.style.alignItems = "normal";
    if(container.getElementsByClassName("anim").length == 0){
        let anim = document.createElement("div");
        anim.className = "anim anim"+i;
        anim.innerText = "Rémi";
        container.appendChild(anim);
        myMove(400,"anim"+i)
    }
}