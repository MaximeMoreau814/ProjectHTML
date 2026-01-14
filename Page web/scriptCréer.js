var i=0;

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
                container.innerHTML = "<p class='msg-attente'>Vote enregistré !<br><span>Attente des autres joueurs...</span></p>";
            }
            if (Object.keys(roomData.votes).length === roomData.users.length) {
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
    var syleSheet = document.getElementsByTagName("style").sheet;
    var r = document.querySelector(':root');
    const container = document.getElementById("Answer"); 
    container.style.alignItems = "normal";
    if(container.getElementsByClassName("anim").length == 0){
        sheet.insertRule(`@keyframes ${"anim"+i} {}`, sheet.cssRules.length);
        const keyframesRule = Array.from(sheet.cssRules).find(
        rule => rule.name === "anim"+i && rule.type === CSSRule.KEYFRAMES_RULE
        );
        keyframesRule.appendRule('from { width: 0px; }');
        keyframesRule.appendRule('to { width: 300px; }');
        let btn = document.createElement("div");
        btn.className = "anim";
        btn.innerText = "Rémi";
        btn.style.animation = '${"anim"+i} 5s both'
        container.appendChild(btn);
    }
    else{
        if(container.getElementsByClassName("anim").length == 1){
            r.style.setProperty('--final-anim','600px');
            let btn = document.createElement("div");
            btn.className = "anim";
            btn.innerText = "Maxime";
            container.appendChild(btn);
        }
    }
    i++;
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
        //remplacer le bloc indication par le bloc de question, J'affiche une question mais c'es pas la même pour tous
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
}

next()