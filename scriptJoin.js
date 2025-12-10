const input = document.getElementById('code');

input.addEventListener('input', function() {
    input.value = input.value.toUpperCase();
});

const button = document.getElementById("join-btn");

let error = false;

button.addEventListener("click", (event) => {
    var texte = document.getElementById("code").value;
    if(texte.length == 5){
        window.location.href = "NameUSer.html";
    }
    else{
        error = true;
    }
});

let d2 = document.getElementById("erreur");

function togg(){
  if(error == true){
    d2.style.display = "contents";
  }else{
    d2.style.display = "none";
  }
};