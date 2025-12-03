
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
            window.location.href = "Lobby.html";
        }
    }

 
} 
const ValidBtn = document.getElementById("btn-valid");
        ValidBtn.addEventListener("click", function() {
            verif_champ();
        });