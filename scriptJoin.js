const input = document.getElementById('code');
const button = document.getElementById("join-btn");
let error = document.getElementById("erreur");
let prevcode="";
error.style.display = "none";

input.addEventListener('input', function() {
    input.value = input.value.toUpperCase();
    if(prevcode!=input.value){
      error.style.display = "none";
    }
});

button.addEventListener("click", () => {
    const texte = input.value;
    prevcode = texte;

    if (texte.length === 5) {
        error.style.display = "none";
        window.location.href = "NameUSer.html";

    } else {
        error.style.display = "block";
    }
});
