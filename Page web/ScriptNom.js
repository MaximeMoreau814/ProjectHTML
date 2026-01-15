if(localStorage.getItem('username')){
    window.location.href = "Lobby.html";
}
if(localStorage.getItem('quit')){
    window.location.href = "Index.html";
}
function verif_champ() 
{
    var Pseudo =document.getElementById("Pseudo").value;
    if (Pseudo == "") 
    { 
    alert("Veuillez entrer un pseudo."); 
    } 
    else 
    { 
        var space=0;
        for(var i=0; i<Pseudo.length; i++)
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
            if(localStorage.getItem('roomcode')){
                fetch('http://localhost:8080/add_usr?r='+localStorage.getItem('roomcode')+"&user="+localStorage.getItem('username')).then(response => response.text()).then(data => {
                    console.log(data)
                    if(data == "true"){
                    }
                    else{
                        alert("Ce Pseudo est déjà utilisé dans cette room.")
                    }
                });
            }
            window.location.href = "Lobby.html";
            
        }
    }
} 

const ValidBtn = document.getElementById("btn-valid");
        ValidBtn.addEventListener("click", function() {
            verif_champ();
        });