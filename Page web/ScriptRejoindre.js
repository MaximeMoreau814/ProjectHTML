// envoie un utilisateur qui a quitté le Lobby dans la page Index
if(localStorage.getItem('quit')){
    window.location.href = "Index.html";
}

// le message d'erreur
let error = document.getElementById("erreur");
error.style.display = "none";

// le roomCode
let prevcode="";

// un EventListener qui affiche le roomCode entré en majuscule
const input = document.getElementById('code');
input.addEventListener('input', function() {
    input.value = input.value.toUpperCase();
    if(prevcode != input.value){
        error.style.display = "none";
    }
});

// un EventListener lié au bouton "Rejoindre le groupe"
const button = document.getElementById("join-btn");
button.addEventListener("click", () => {
    const texte = input.value; // récupération du roomCode
    prevcode = texte;

    if (texte.length === 5) { // le roomCode doit faire 5 caractères de long
        error.style.display = "none";
        let value;
        value = fetch('http://localhost:8080/isroomvalid?room='+texte)
        .then(response => response.text())
        .then(data => {
            if(data == "true"){ // si la room existe, on rejoint la room...
                localStorage.setItem('roomcode',texte);
                window.location.href = "NameUSer.html"; // ...en envoyant l'utilisateur sur la page NameUSer
            }
            else{ // sinon on affiche error
                error.style.display = "block";
            }
        });

    } else { // sinon on affiche error
        error.style.display = "block";
    }
});