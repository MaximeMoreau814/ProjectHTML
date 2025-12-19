

function generateCode() {
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let code = "";

    for (let i = 0; i < 5; i++) {
        code += letters[Math.floor(Math.random()*26)];
    }
    //document.getElementById("code-box").textContent = code;
    return code;
    
    }
let text=generateCode();
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