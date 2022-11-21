# Les Petits Plats [P7] : Développez un algorithme de recherche en JavaScript
> Après avoir édité des livres de cuisine pendant plusieurs années, l’entreprise (Les petits plats) a décidé de se lancer dans un nouveau projet : réaliser son propre site de recettes de cuisine à l’instar de Marmiton ou 750g. 
> On nous demande d'intégrer les maquettes fournies. Il faudra ensuite proposer deux algorithmes de recherche et tester leurs performances afin d'en recommander un des deux.
> Voici les deux repo :
- 1er version utilsant les boucles natives (while, for...) [voir](https://github.com/MasterCodeDevelop/MohamedAliElhamech_P7_18102022/tree/v1_boucles-native).
- 2e version utilisant la programmation fonctionnelle avec les méthodes de l'objet array (foreach, filter, map, reduce) [voir](https://github.com/MasterCodeDevelop/MohamedAliElhamech_P7_18102022/tree/v2_programation-fonctionelle)

![Maquette de Les Petits Plats](https://github.com/MasterCodeDevelop/MohamedAliElhamech_P7_18102022/blob/v1_boucles-native/project/capture.jpg?raw=true)
## 📖 Cahier des charges
- La recherche doit pouvoir se faire via le champ principal ou via les tags (ingrédients, ustensiles ou appareil).
- La recherche principale se lance à partir de 3 caractères entrés par l’utilisateur dans la barre de recherche.
- La recherche s’actualise pour chaque nouveau caractère entré.
- La recherche principale affiche les premiers résultats le plus rapidement possible.
- Les champs ingrédients, ustensiles et appareil de la recherche avancée proposent seulement les éléments restant dans les recettes présentes sur la page.
- Les retours de recherche doivent être une intersection des résultats. Si l’on ajoute les tags “coco” et “chocolat” dans les ingrédients, on doit récupérer les recettes qui ont à la
fois de la coco et du chocolat.
- Comme pour le reste du site, le code HTML et CSS pour l’interface (avec ou sans Bootstrap) devra passer avec succès le validateur W3C.
- Aucune librairie ne sera utilisée pour le JavaScript du moteur de recherche

## 📦 Éléments fournis pour le projet
- La [maquette](https://www.figma.com/file/xqeE1ZKlHUWi2Efo8r73NK/UI-Design-Les-Petits-Plats-FR) qui est déjà intégrée.
- Les [données au format JS](https://github.com/OpenClassrooms-Student-Center/P11-front-end-search-engine/blob/master/recipes.js).
- La description du cas d’utilisation de recherche dans ce [lien](https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Front-End+V2/P6+Algorithms/Cas+d%E2%80%99utilisation+%2303+Filtrer+les+recettes+dans+l%E2%80%99interface+utilisateur.pdf).
- La fiche d’investigation de fonctionnalité de [connexion / inscription"](https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Front-End+V2/P6+Algorithms/Fiche+d%E2%80%99investigation+fonctionnalite%CC%81.pdf).

## 📚 Technologie utilisées
- HTML
- CSS (SCSS)
- JavaScript

## 💻 Démo du site
[Les Petits Plats](https://mastercodedevelop.github.io/MohamedAliElhamech_P7_18102022/)

## 📝 Note du projet
- Le développement à été réalisé sur l'éditeur [Visual Studio Code](https://code.visualstudio.com/).
-  Vérification du HTML et CSS avec [W3C](https://validator.w3.org/).
-  Vérification du code JS avec un linter [ESLint](https://www.synbioz.com/blog/tech/un-code-js-impeccable-grace-a-eslint).
-  Test de performance des algorithmes JS sur [JSBEN.CH](https://jsben.ch).