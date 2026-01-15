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
        let value;
        value = fetch('http://localhost:8080/isroomvalid?room='+texte).then(response => response.text()).then(data => {
            if(data == "true"){
                localStorage.setItem('roomcode',texte);
                window.location.href = "NameUSer.html";
            }
            else{
                error.style.display = "block";
            }
        });

    } else {
        error.style.display = "block";
    }
});
console.log(localStorage.getItem('quit'));
if(localStorage.getItem('quit')){
    localStorage.removeItem('quit');
    localStorage.clear();
    console.log("clear");
}