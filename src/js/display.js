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
function searchRecipes() {
    const value = search.value.toLowerCase();

    if((!value || !value.length) && !filteredRecipes) {
        filteredRecipes = data;
    } else {
        filteredRecipes = filterRecipes(value);
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
    for (const recipe of data) {

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
    recipes.innerHTML = '';
    for (const dataRecipe of dataRecipes) displayRecipe(dataRecipe);
}
/**
 * Adds the recipe with its own data
 * @param {Object} data 
 */
function displayRecipe(data) {
    /*######### CONST #########*/
    const { name, time, ingredients, description } = data,
    recipe = getCloneTemplate('template-recipe-card'),
    h2 = recipe.querySelector('h2'),
    strong = recipe.querySelector('strong'),
    ul = recipe.querySelector('ul'),
    p = recipe.querySelector('p');

    /*######### UPDATE #########*/
    h2.textContent = name; // title
    strong.textContent = time+' min' // time
    ingredients.forEach(ing => {
        const { ingredient, quantity, unit } = ing;
        const li = document.createElement('li');
        li.innerHTML = `<strong>${ingredient}:&nbsp;</strong> ${unit?quantity+unit:quantity}`;
        ul.appendChild(li);
    }); // ingredients
    p.textContent = description; //description
    

    /*######### APPEND #########*/
    recipes.appendChild(recipe)
}
/**
 * Displays all elements for all filters
 */
function displayFilters() {
    resetTags()
    updateFilters()
}
/**
 * reset all tags and sort them well
 */
function resetTags() {
    if(!filteredRecipes) filteredRecipes = data;
    // sort ingredients
    const ingredientsRecipes = filteredRecipes.map((recipe) => recipe.ingredients),
    ingredientsTags = ingredientsRecipes.map(([{ ingredient }]) => ingredient);
    tags.ingredient = sort(ingredientsTags);
    sortedTags.ingredient = sort(ingredientsTags);

    // sort appliance
    const applianceTags = filteredRecipes.map((recipe) => recipe.appliance);
    tags.appliance = sort(applianceTags);
    sortedTags.appliance = sort(applianceTags);

    // sort ustensils
    const ustensilsRecipes = filteredRecipes.map((recipe) => recipe.ustensils),
    ustensilsTags = ustensilsRecipes.map(([ustensil]) => ustensil).sort((a, b) => a.localeCompare(b));
    tags.ustensil = sort(ustensilsTags);
    sortedTags.ustensil = sort(ustensilsTags);
}
/**
 * sorts the tags so as not to have several same tags
 * @param {array} $tags 
 * @returns {array} tags sorted
 */
const sort = ($tags) => {
    let newTags = [];
    for (const tag of $tags) {
        const index = newTags.indexOf(tag.toLowerCase());
        if (index == -1) {
            newTags.push(tag.toLowerCase());
        }
    }
    return newTags
}
/**
 * update all tags in their filter beds
 */
function updateFilters() {
    for (const filter of filters) {
        // CONST 
        const label = filter.querySelector('label');
        
        label.addEventListener('click', e => {
            const parentElement = e.target.parentElement,
            lastOpen = document.querySelector('.filter.is-open');

            if(lastOpen && lastOpen != parentElement) {
                lastOpen.classList.remove('is-open')
            }
            parentElement.classList.toggle('is-open');
        });
    }
    updateTags();
}
/**
 * update the new tags in the list
 * @param {string} id 
 * @param {element} list 
 */
function updateTags() {
    for (const filter of filters) {
        // CONST 
        const id = filter.querySelector('input').id,
        list = filter.querySelector('ul');

        list.innerHTML = '';
        resetTags();
        for (const tag of sortedTags[id]) createItem({id, tag, list});
    }
}
/**
 * create a new item and add it to the list with its filter given in the id.
 * @param {String} id (ingredient or appliance or ustensil)
 * @param {String} tag is the name Tag
 * @param {Element} list
 */
function createItem({id, tag, list}) {
    const index = tagsSelected[id].indexOf(tag.toLowerCase()),
    li = document.createElement('li');

    if (index == -1) {
        li.textContent = tag;
        li.addEventListener('click', e => addTag({e, id}))
        list.appendChild(li);   
    }

}
/**
 * if the input is filled,  search the tags
 * @param {*} e event handling.
 */
function searchTags(e) {
    const id = e.target.id,
    value = e.target.value.toLowerCase();
    if(!value || !value.length) {
        sortedTags[id] = tags[id];
    } else {
        sortedTags[id] = filterTags(value, tags[id]);
    }
    
    const list = e.target.parentElement.querySelector('ul');
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
    // CONST
    const value = e.target.textContent,
    newTag = getCloneTemplate('template-tag'),
    title = newTag.querySelector('span'),
    close = newTag.querySelector('button');

    newTag.classList.add(id);
    title.textContent = value;
    close.addEventListener('click', () => {
        const index = tagsSelected[id].indexOf(value.toLowerCase());

        tagsSelected[id].splice(index,1)
        newTag.remove();
        filteredRecipes = data;
        filterRecipesByTags(id);
    });

    tagsSelected[id].push(value.toLowerCase());
    tagsHTML.appendChild(newTag);
    filterRecipesByTags(id)
}
/**
 * filters the recipes and sends the elements that are found an array
 * @param {string} value 
 * @returns {Array} recipes -> the new recipes (filtred)
 */
 function filterRecipesByTags(id) {
    if(!filteredRecipes || filterRecipes.length == 0 || tagsSelected[id].length ===0) filteredRecipes = data;

    for (const tag of tagsSelected[id]) {
        filteredRecipes = sortTags(tag.toLowerCase(), id, filteredRecipes);
    }
    displayRecipes(filteredRecipes)
    updateTags();
}
function sortTags(value, id, data) {
    let recipes = [];

    if(id == 'ingredient') {
        for (const recipe of data) {
            const findIngredients = recipe.ingredients.find((ing) => ing.ingredient.toLowerCase().includes(value));
            if(findIngredients) recipes.push(recipe);
        }
    }else if(id == 'appliance') {
        for (const recipe of data) {
            const findAppliance = recipe.appliance.toLowerCase().includes(value);
            if(findAppliance) recipes.push(recipe);
        }
    }else if(id == 'ustensil') {
        for (const recipe of data) {
            const findUstensil = recipe.ustensils.find((ustensil) => ustensil.toLowerCase().includes(value));
            if(findUstensil) recipes.push(recipe);
        }
    }
    return recipes
}

/*###################### EXPORT ######################*/
export function display(dataRecipes) {
    data = dataRecipes;

    displayRecipes(data);
    displayFilters();

    /*########### EventListener ###########*/
    search.addEventListener('input', searchRecipes);
    searchLabel.addEventListener('click', searchRecipes);
    for (const filter of filters) {
        const input = filter.querySelector('input');
        input.addEventListener('input', searchTags)
    }
 
}