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
    fetch('http://localhost:8080/part?room=' + roomCode)
    .then(response => response.json())
    .then(roomData => {
        if (roomData.started === "true" && !localStorage.getItem('start')) {
            localStorage.setItem("start", "true");
            main();
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
        
        //remplacer le bloc indication par le bloc de question
        fetch('http://localhost:8080/question')
            .then(response => response.text())
            .then(questionRecue => {
                let element = document.createElement("p");
                element.className = "question";
                element.textContent = questionRecue; 
                
                const indication = document.getElementById("indication");
                if (indication) {
                    document.body.replaceChild(element, indication);
                }
            });
        //remplacer le bloc code-box par un bloc de boutons de réponse
        element=document.createElement("div");
        element.className="reponses";
        let child=document.createElement("button");
        child.setAttribute("id","button1");
        child.className="btn btn-rep";
        child.textContent="Premiere personne"
        element.appendChild(child);
        document.body.replaceChild(element,document.getElementById("code-box"));
        //on supprime le start button
        element = document.getElementById("start-btn");
        element.remove();
        //on affiche le code
        document.getElementById("foot").style.visibility = "visible";
    }
    document.getElementById("code").textContent = localStorage.getItem('roomcode');
    setInterval(updateInfo, 1000);
}


main();