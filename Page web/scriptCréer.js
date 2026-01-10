window.onbeforeunload = function(e) {
    e.preventDefault();
}

window.addEventListener('unload', function (e) {
    fetch('http://localhost:8080/delete?r='+localStorage.getItem('roomcode')+"&user="+localStorage.getItem('username'), {
            keepalive: true // this is important!
        });
    localStorage.clear();
});

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
    let text=code;
    document.getElementById("code-box").textContent = text;

    const backBtn = document.getElementById("back-btn");
            backBtn.addEventListener("click", function() {
                window.location.href = "index.html";
            });

    const copyBtn = document.getElementById("copy-btn");
    copyBtn.addEventListener("click", function() {
        navigator.clipboard.writeText(text).then(() => {
            alert("Code copié : " + text);
        }).catch(() => {
            alert("Impossible de copier le code !");
        });
    });
}
else{
    let text=localStorage.getItem('roomcode');
    document.getElementById("code-box").textContent = text;
    console.log(text);

    const backBtn = document.getElementById("back-btn");
            backBtn.addEventListener("click", function() {
                window.location.href = "index.html";
            });

    const copyBtn = document.getElementById("copy-btn");
    copyBtn.addEventListener("click", function() {
        navigator.clipboard.writeText(text).then(() => {
            alert("Code copié : " + text);
        }).catch(() => {
            alert("Impossible de copier le code !");
        });
    });
}
