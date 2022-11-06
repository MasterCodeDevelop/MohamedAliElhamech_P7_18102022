/*###################### IMPORTS ######################*/
import { getCloneTemplate } from './get.js';

/*###################### CONST ######################*/
const search = document.getElementById('search'),
recipes = document.getElementById('recipes');

/*###################### VAR ######################*/
var data, filteredRecipes;

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
export function displayRecipes(dataRecipes) {
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
/*###################### EXPORT ######################*/
export function display(dataRecipes) {
    data = dataRecipes;

    displayRecipes(data);

    /*########### EventListener ###########*/
    search.addEventListener('input', searchRecipes)
 
}