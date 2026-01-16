// supprime les données enregistrées dans le localStorage (roomCode et userName) quand on arrive sur la page
if(localStorage.getItem('quit')){ // ce if est utile si on veut ouvrir plusieurs onglets dans le même navigateur
    localStorage.clear();         // la variable quit existe si on quitte la page Lobby
}