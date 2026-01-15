# ProjectHTML
Projet pour le cours de HTML/Java en 4A de SAGI

Projet : Qui est le plus ?

Site internet sur lequel se connectent des amis et répondent à des qustions sur leur groupe. On vote la personne correspondant le plus au critère et une fois que tout le monde a voté, les résultats s'affichent. Ensuite il est possible de passer à une autre question.

Les participants peuvent créer et rejoindre des groupes privés. Chaque utilisateur renseigne un pseudonyme avant de créer ou rejoindre un groupe. Les groupes sont géré par un serveur qui vient stocker le code du groupe, la question en court, si la partie à commencé, les personnes présentes dans le groupe ainsi que les votes de chacun.

Nous avons utilisé un serveur tournant via node.js, le reste des fonctionnalitées est assuré par du javascript.

lien : 

Un bug connu est lorsque la page subie trop de reload, l'utilisateur est supprimé du groupe. Ainsi, lorsque cela se produit, nous avons fait en sorte qu'il soit redirigé sur la page d'index. 

Projet par : Clément GAUTRET, Maxime MOREAU, Rémi REULIER, Bosco-Marie D'ALIGNY