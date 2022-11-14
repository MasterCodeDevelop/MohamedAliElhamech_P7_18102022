/*###################### IMPORTS ######################*/
import { getCloneTemplate } from './get.js';

/*###################### CONST ######################*/
const search = document.getElementById('search'),
searchLabel = document.getElementById('searchLabel'),
recipes = document.getElementById('recipes'),
filters = document.getElementsByClassName('filter'),
tagsHTML = document.getElementById('tags');


/*###################### VAR ######################*/
var data, filteredRecipes, tags = {}, sortedTags = {}, 
tagsSelected = {ingredient:[], appliance:[], ustensil:[]};

/*###################### FUNCTION ######################*/

/**
 * if the input is filled,  search the recipes
 */
function searchBar() {
    const value = search.value.toLowerCase();

    if((!value.length || value.length < 3) && !filteredRecipes) {
        filteredRecipes = data;
    } else {
        filterRecipesByTags();
        if(value.length > 2) {
            filteredRecipes = filterRecipes(value);
            updateTags();
        }
    }
    displayRecipes(filteredRecipes);
}
/**
 * filters the recipes and sends the elements that are found an array
 * @param {string} value 
 * @returns {Array} recipes -> the new recipes (filtred)
 */
function filterRecipes(value) {
    let recipes = [];
    for (const recipe of filteredRecipes) {

        const name = recipe.name.toLowerCase(),
        description = recipe.description.toLowerCase(),
        findIngredients = recipe.ingredients.find((ing) => ing.ingredient.toLowerCase().includes(value));
        
        if (name.includes(value) || findIngredients|| description.includes(value)) {
            recipes.push(recipe);
        }
    }
    return recipes;
}
/**
 * Displays all the recipes given in the data Recipes parm
 * @param {Array} dataRecipes 
 */
function displayRecipes(dataRecipes) {
    recipes.innerHTML = ''; // RESET RECIPES
    
    /*######### ERROR MESSAGE IF THERE ARE NO RECIPES #########*/
    if(dataRecipes.length == 0) {
        const messageError = getCloneTemplate('template-message-fetch-error');
        messageError.innerHTML = `
            Aucune recette ne correspond à votre critère… <br>
            vous pouvez chercher «tarte aux pommes», «poisson», etc.
        `;
		recipes.append(messageError);
    }

    /*######### UPDATE AND DISPLAY RECIPES #########*/
    for (const data of dataRecipes) {
        // CONST
        const { name, time, ingredients, description } = data,
        recipe = getCloneTemplate('template-recipe-card'),
        h2 = recipe.querySelector('h2'),
        strong = recipe.querySelector('strong'),
        ul = recipe.querySelector('ul'),
        p = recipe.querySelector('p');

        // UPDATE
        h2.textContent = name; // title
        strong.textContent = time+' min' // time
        ingredients.forEach(ing => {
            const { ingredient, quantity, unit } = ing;
            const li = document.createElement('li');
            li.innerHTML = `<strong>${ingredient}:&nbsp;</strong> ${unit?quantity+unit:quantity}`;
            ul.appendChild(li);
        }); // ingredients
        p.textContent = description; //description
        
        // APPEND
        recipes.appendChild(recipe)
    }
}
/**
 * Displays all elements for all filters
 */
function displayFilters(filter) {
    /*######### CONST #########*/
    const input = filter.querySelector('input'),
    label = filter.querySelector('label');

    /*######### EVENTLISTENER #########*/
    input.addEventListener('input', searchTags);
    label.addEventListener('click', e => {
        const parentElement = e.target.parentElement,
        lastOpen = document.querySelector('.filter.is-open');

        if(lastOpen && lastOpen != parentElement) {
            lastOpen.classList.remove('is-open')
        }
        parentElement.classList.toggle('is-open');
    });
    
}
/**
 * reset all tags and sort them well
 */
function resetTags() {
    /*######### LET #########*/
    let ingredientsTags = [], applianceTags = [], ustensilsTags = [];

    /*######### RESET DATA #########*/
    if(!filteredRecipes) filteredRecipes = data;
        
    /*######### FILTERS #########*/
    filteredRecipes.map( ({ ingredients, appliance, ustensils }) => {
        ingredients.map(
            ({ingredient}) => sort(ingredient, ingredientsTags)
        )
        sort(appliance, applianceTags)
        ustensils.map(
            (ustensil) => sort(ustensil, ustensilsTags)
        )
    });

    /*######### SORT BY ALPHABETICALLY #########*/
    ingredientsTags.sort( (a, b) =>  a.localeCompare(b));
    applianceTags.sort( (a, b) =>  a.localeCompare(b));
    ustensilsTags.sort( (a, b) =>  a.localeCompare(b));

    /*######### UPDATE tags/sortedTags #########*/
    tags = {
        ingredient: ingredientsTags,
        appliance: applianceTags,
        ustensil: ustensilsTags
    }
    sortedTags = tags;
}
/**
 * sorts the tags 
 * @param {String} tag
 * @param {Array} data
 */
function sort(tag, data) {
    const index =  data.indexOf(tag.toLowerCase());
    if (index == -1) data.push(tag.toLowerCase());
}
/**
 * update the new tags in the filters list
 */
 function updateTags() {
    resetTags();

    for (const filter of filters) {
        /*######### CONST #########*/
        const id = filter.querySelector('input').id,
        list = filter.querySelector('ul');

        list.innerHTML = '';// RESET LIST 
        for (const tag of sortedTags[id]) createItem({id, tag, list});// UPDATE TAGS LIST
    }
}
/**
 * create a new item and add it to the list with its filter given in the id.
 * @param {String} id (ingredient or appliance or ustensil)
 * @param {String} tag is the name Tag
 * @param {Element} list
 */
function createItem({id, tag, list }) {
    /*######### CONST #########*/
    const index = tagsSelected[id].indexOf(tag.toLowerCase()),
    li = document.createElement('li');

    /*######### UPDATE TAG #########*/
    if (index == -1) {
        li.textContent = tag;
        li.addEventListener('click', e => addTag({e, id}));
        list.appendChild(li);   
    }

}
/**
 * if the input is filled,  search the tags
 * @param {*} e event handling.
 */
function searchTags(e) {
    /*######### CONST #########*/
    const id = e.target.id,
    value = e.target.value.toLowerCase(),
    list = document.getElementById(id+'List');
    
    /*######### FILTER TAGS #########*/
    sortedTags[id] = (!value || !value.length)
    ?   tags[id]
    :   filterTags(value, tags[id]);
    
    /*######### UPDATE ITEMS #########*/
    list.innerHTML = '';
    for (const tag of sortedTags[id]) createItem({id, tag, list});
    
}
/**
 * searches for tags that include search input
 * @param {string} value 
 * @param {array} tags 
 * @returns {array} tags is filtred
 */
function filterTags(value, tags) {
    let $tags = [];
    for (const tag of tags) {
        if (tag.includes(value)) $tags.push(tag);
    }
    return $tags;
}
/**
 * Add the tag with dom
 * @param {Event} e event handling.
 * @param {string} id (ingredient or appliance or ustensil)
 */
function addTag({ e, id }) {
    /*######### CONST #########*/
    const value = e.target.textContent,
    nav = e.target.parentElement.parentElement,
    input = nav.querySelector('input'),
    newTag = getCloneTemplate('template-tag'),
    title = newTag.querySelector('span'),
    close = newTag.querySelector('button');

    nav.classList.remove('is-open');// close the dropdown
    input.value = ''; // reset the input tag search
    
    /*######### UPDATE ELEMENT #########*/
    newTag.classList.add(id);
    title.textContent = value;
    close.addEventListener('click', e => closeTag({e, id, value}));

    /*######### UPDATE RECIPES #########*/
    tagsHTML.appendChild(newTag);
    tagsSelected[id].push(value.toLowerCase());
    filterRecipesByTags();
    searchBar();

}
/**
 * Close(delete) the tag and then update all filters
 * @param {Event} e event handling.
 * @param {string} id (ingredient or appliance or ustensil)
 * @param {string} value  tag name
 */
function closeTag({e, id, value}) {
    const index = tagsSelected[id].indexOf(value.toLowerCase());

    tagsSelected[id].splice(index,1);
    e.target.parentElement.parentElement.remove()
    filterRecipesByTags();
    searchBar();
}
/**
 * filters the recipes and display the new recipes
 */
 function filterRecipesByTags() {
    /*######### RESET #########*/
    filteredRecipes = data;
    resetTags();

    /*######### UPDATES #########*/
    filteredByTag('ingredient');
    filteredByTag('appliance');
    filteredByTag('ustensil');
    updateTags();
    
    /*######### DISPLAY #########*/
    displayRecipes(filteredRecipes)
}
/**
 * Filter all recipes by tag
 * @param {string} id (ingredient or appliance or ustensil)
 */
function filteredByTag(id) {
    
    for (const value of tagsSelected[id]) {
        let recipes = [];
        for (const recipe of filteredRecipes) {
            const isRecipe = 
                (id == 'ingredient')?   recipe.ingredients.find((ing) => ing.ingredient.toLowerCase().includes(value))
                :(id == 'appliance')?   recipe.appliance.toLowerCase().includes(value)
                :/*ustensil*/           recipe.ustensils.find((ustensil) => ustensil.toLowerCase().includes(value));
                
            if(isRecipe) recipes.push(recipe);
        }
        filteredRecipes = recipes;
    }

}

/*###################### EXPORT ######################*/
export function display(dataRecipes) {
    data = dataRecipes;

    displayRecipes(data);
    updateTags()

    /*########### EventListener ###########*/
    search.addEventListener('input', searchBar);
    searchLabel.addEventListener('click', searchBar);
    for (const filter of filters)  displayFilters(filter);
 
}