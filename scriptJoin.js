const input = document.getElementById('code');

input.addEventListener('input', function() {
    input.value = input.value.toUpperCase();
});

const button = document.getElementById("join-btn");

button.addEventListener("click", (event) => {
    var texte = document.getElementById("code").value;
    if(texte.length == 5){
        window.location.href = "NameUSer.html";
    }
    else{
        //Afficher que le code est incomplet
    }
});