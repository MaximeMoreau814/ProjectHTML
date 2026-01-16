// envoie un utilisateur ayant déjà un userName dans le Lobby
if(localStorage.getItem('username')){
    window.location.href = "Lobby.html";
}

// envoie un utilisateur qui a quitté le Lobby dans la page Index
if(localStorage.getItem('quit')){
    window.location.href = "Index.html";
}

// script principal qui récupère le userName
function verif_champ() 
{
    var Pseudo = document.getElementById("Pseudo").value;
    if (Pseudo == "") // si le Psuedo entré est vide
    { 
        alert("Veuillez entrer un pseudo."); 
    } 
    else 
    { 
        var space = 0;
        for(var i = 0; i<Pseudo.length; i++) // vérification que le Pseudo entré n'est pas uniquement des espaces
        {
            var char = Pseudo.charAt(i);
            if(char == ' ')
            {
                space++;
            }

        }
        if(space == Pseudo.length)
        {
            alert("Le pseudo ne peut être composé uniquement d'espaces.");
        }
        else
        {
            localStorage.setItem('username',Pseudo);
            if(localStorage.getItem('roomcode')){ // si le roomCode existe déjà, l'utilisateur est ajouté dans la room
                fetch('http://localhost:8080/add_usr?r='+localStorage.getItem('roomcode')+"&user="+localStorage.getItem('username'))
                .then(response => response.text())
                .then(data => {
                    if(data != "true"){
                        alert("Ce Pseudo est déjà utilisé dans cette room.")
                    }
                });
            }
            window.location.href = "Lobby.html"; // on est envoyé sur la page Lobby
            
        }
    }
} 

// EventListener lié au bouton "validé", lance la fonction verif_champ quand il est cliqué
const ValidBtn = document.getElementById("btn-valid");
ValidBtn.addEventListener("click", function() {
    verif_champ();
});