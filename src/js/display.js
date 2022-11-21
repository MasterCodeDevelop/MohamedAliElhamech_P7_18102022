/*###################### IMPORTS ######################*/
import { getCloneTemplate } from './get.js';

/*###################### CONST ######################*/
const search = document.getElementById('search'),
searchLabel = document.getElementById('searchLabel'),
recipes = document.getElementById('recipes'),
filters = document.getElementById('filters').children,
tagsHTML = document.getElementById('tags');


/*###################### VAR ######################*/
var data, filteredRecipes, tags = {}, sortedTags = {}, 
tagsSelected = {ingredient:[], appliance:[], ustensil:[]};

/*###################### FUNCTION ######################*/

/**
 * if the input is filled,  search the recipes
 */
function searchBar() {
    const {value} = search;

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
    filteredRecipes.forEach(recipe => {
        const { name, description, ingredients } = recipe;
        if (isIncludes(name, value) || ingredients.find(({ingredient}) => isIncludes(ingredient, value)) || isIncludes(description, value) ) {
            recipes.push(recipe);
        } 
    });
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
    for (let i = 0;i < dataRecipes.length; i++) {
        // CONST
        const { name, time, ingredients, description } = dataRecipes[i],
        recipe = getCloneTemplate('template-recipe-card'),
        h2 = recipe.querySelector('h2'),
        strong = recipe.querySelector('strong'),
        ul = recipe.querySelector('ul'),
        p = recipe.querySelector('p');

        // UPDATE
        h2.textContent = name; // title
        strong.textContent = time+' min' // time
        for (let i = 0; i < ingredients.length; i++) {
            const { ingredient, quantity, unit } = ingredients[i];
            const li = document.createElement('li');
            li.innerHTML = `<strong>${ingredient}:&nbsp;</strong> ${unit?quantity+unit:quantity}`;
            ul.appendChild(li);
        } // ingredients
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
    for (let i = 0; i < filteredRecipes.length; i++) {
        const { ingredients, appliance, ustensils } = filteredRecipes[i];
        // ingredients
        for (let i = 0; i < ingredients.length; i++) {
            singleAdd(ingredients[i].ingredient, ingredientsTags);
        }
        // appliance
        singleAdd(appliance, applianceTags);
        //ustensil
        for (let i = 0; i < ustensils.length; i++) {
            singleAdd(ustensils[i], ustensilsTags);
        }
    }

    /*######### UPDATE tags/sortedTags #########*/
    tags = {
        ingredient: ingredientsTags.sort(sortByLetter),
        appliance: applianceTags.sort(sortByLetter),
        ustensil: ustensilsTags.sort(sortByLetter)
    }
    sortedTags = tags;
}
/**
 * returns a number indicating whether a reference string comes before, or after, 
 * or is the same as the given string in sort order.
 * @param {String} a 
 * @param {String} b 
 * @returns {String}
 */
function sortByLetter(a,b) {
    return a.localeCompare(b)
}
/**
 * sorts the tags 
 * @param {String} tag
 * @param {Array} data
 */
function singleAdd(tag, data) {
    const value = tag.toLowerCase();
    if (!data.includes(value)) data.push(value);
}
/**
 * update the new tags in the filters list
 */
 function updateTags() {
    resetTags();

    for (let i = 0; i < filters.length; i++) {
        /*######### CONST #########*/
        const id = filters[i].querySelector('input').id,
        list = filters[i].querySelector('ul');

        // RESET LIST
        list.innerHTML = ''; 
        // UPDATE TAGS LIST
        for (let i = 0; i < sortedTags[id].length; i++) createItem(id, sortedTags[id][i], list);
    }
}
/**
 * create a new item and add it to the list with its filter given in the id.
 * @param {String} id (ingredient or appliance or ustensil)
 * @param {String} tag is the name Tag
 * @param {Element} list
 */
function createItem(id, tag, list ) {
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
    const { id, value } = e.target,
    list = document.getElementById(id+'List');
    
    /*######### FILTER TAGS #########*/
    const sort = (!value || !value.length)
    ?   tags[id]
    :   filterTags(value, tags[id]);

    /*######### UPDATE ITEMS #########*/
    list.innerHTML = '';
    for (let i = 0; i < sort.length; i++) createItem(id, sort[i], list);
}
/**
 * searches for tags that include search input
 * @param {string} value
 * @param {array} tags
 * @returns {array} tags is filtred
 */
function filterTags(value, tags) {
    let sortTags = [];
    for (let i = 0; i < tags.length; i++) {
        if (isIncludes(tags[i], value)) sortTags.push(tags[i]);
    }
    return sortTags;
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
    close.addEventListener('click', e => removeTag({e, id, value}));

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
function removeTag({e, id, value}) {
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
    for (let i = 0; i < tagsSelected[id].length; i++) {
        const value = tagsSelected[id][i];
        let recipes = [];
        for (let i = 0; i < filteredRecipes.length; i++) {
            const recipe = filteredRecipes[i],
            { ingredients, appliance, ustensils} = recipe;
            
            const isRecipe = 
                (id == 'ingredient')?   ingredients.find(({ingredient}) => isIncludes(ingredient, value) )
                :(id == 'appliance')?   isIncludes(appliance, value)
                :/*ustensil*/           ustensils.find(e => isIncludes(e, value) );
                
            if(isRecipe) recipes.push(recipe);
        }
        filteredRecipes = recipes;
    }
}
/**
 * determines whether a string (value) contains the given characters (e) within it or not.
 * @param {String} e 
 * @param {String} value 
 * @returns Boolean
 */
function isIncludes(e, value) {
    return e.toLowerCase().includes(value.toLowerCase())
}

/*###################### EXPORT ######################*/
export function display(dataRecipes) {
    data = dataRecipes;

    displayRecipes(data);
    updateTags()

    /*########### EventListener ###########*/
    search.addEventListener('input', searchBar);
    searchLabel.addEventListener('click', searchBar);
    for (let i = 0; i < filters.length; i++) displayFilters(filters[i]);
}