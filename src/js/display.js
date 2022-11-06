/*###################### CONST ######################*/
const search = document.getElementById('search');

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
    console.log(filteredRecipes);

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

/*###################### EXPORT ######################*/
export function display(dataRecipes) {
    data = dataRecipes;

    /*########### EventListener ###########*/
    search.addEventListener('input', searchRecipes)
 
}