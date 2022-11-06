/*###################### IMPORTS ######################*/
import { getCloneTemplate } from './get.js';

/*###################### CONST ######################*/
const search = document.getElementById('search'),
recipes = document.getElementById('recipes'),
filters = document.getElementsByClassName('filter');


/*###################### VAR ######################*/
var data, filteredRecipes, tags = {}, sortedTags = {};

/*###################### FUNCTION ######################*/

/**
 * if the input is filled,  search the recipes
 * @param {*} e event handling.
 */
function searchRecipes(e) {
    const value = e.target.value.toLowerCase();

    if(!value || !value.length) {
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
 * Close the select filter
 * @param {Element} nav 
 */
function closeFilter(nav) {
    nav.classList.remove('is-open');
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
    // sort ingredients
    const ingredientsRecipes = data.map((recipe) => recipe.ingredients),
    ingredientsTags = ingredientsRecipes.map(([{ ingredient }]) => ingredient);
    tags.ingredient = sort(ingredientsTags);
    sortedTags.ingredient = sort(ingredientsTags);

    // sort appliance
    const applianceTags = data.map((recipe) => recipe.appliance);
    tags.appliance = sort(applianceTags);
    sortedTags.appliance = sort(applianceTags);

    // sort ustensils
    const ustensilsRecipes = data.map((recipe) => recipe.ustensils),
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
        const id = filter.querySelector('input').id,
        label = filter.querySelector('label'),
        close = filter.querySelector('span'),
        list = filter.querySelector('ul');
        
        label.addEventListener('click', e => {
            const parentElement = e.target.parentElement;
            parentElement.classList.add('is-open');
        });
        close.addEventListener('click', e =>closeFilter(e.target.parentElement));

        for (const tag of sortedTags[id]) {
            const li = document.createElement('li');
            li.textContent = tag;
            list.appendChild(li);            
        }
    }
}









/*###################### EXPORT ######################*/
export function display(dataRecipes) {
    data = dataRecipes;

    displayRecipes(data);
    displayFilters();

    /*########### EventListener ###########*/
    search.addEventListener('input', searchRecipes)
 
}