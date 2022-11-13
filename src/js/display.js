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
function displayFilters(filter) {
    // CONST 
    const input = filter.querySelector('input'),
    label = filter.querySelector('label');

    // EventListener
    input.addEventListener('input', searchTags)
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
    let ingredientsTags = [], applianceTags = [], ustensilsTags = [];
    // reset data
    if(!filteredRecipes) filteredRecipes = data;
    // filtres
    filteredRecipes.map( ({ ingredients, appliance, ustensils }) => {
        ingredients.map(
            ({ingredient}) => sort(ingredient, ingredientsTags)
        )
        sort(appliance, applianceTags)
        ustensils.map(
            (ustensil) => sort(ustensil, ustensilsTags)
        )
    });
    // Sort by Alphabetically
    ingredientsTags.sort( (a, b) =>  a.localeCompare(b));
    applianceTags.sort( (a, b) =>  a.localeCompare(b));
    ustensilsTags.sort( (a, b) =>  a.localeCompare(b));
    // reset tags
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
    if (index == -1) {
        data.push(tag.toLowerCase());
    }
}
/**
 * update the new tags in the list
 * @param {string} id 
 * @param {element} list 
 */
 function updateTags() {
    resetTags();

    for (const filter of filters) {
        // CONST 
        const id = filter.querySelector('input').id,
        list = filter.querySelector('ul');

        list.innerHTML = '';

        for (const tag of sortedTags[id]) createItem({id, tag, list});
    }
}
/**
 * create a new item and add it to the list with its filter given in the id.
 * @param {String} id (ingredient or appliance or ustensil)
 * @param {String} tag is the name Tag
 * @param {Element} list
 */
function createItem({id, tag}) {
    const list = document.getElementById(id+'List'),
    index = tagsSelected[id].indexOf(tag.toLowerCase()),
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
    // Const
    const id = e.target.id,
    value = e.target.value.toLowerCase(),
    list = e.target.parentElement.querySelector('ul');
    // filter tags
    if(!value || !value.length) {
        sortedTags[id] = tags[id];
    } else {
        sortedTags[id] = filterTags(value, tags[id]);
    }
    // update items
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
    nav = e.target.parentElement.parentElement,
    input = nav.querySelector('input'),
    newTag = getCloneTemplate('template-tag'),
    title = newTag.querySelector('span'),
    close = newTag.querySelector('button');

    
    nav.classList.remove('is-open');// close the dropdown
    input.value = ''; // reset the input tag search
    newTag.classList.add(id);
    title.textContent = value;
    close.addEventListener('click', () => {
        const index = tagsSelected[id].indexOf(value.toLowerCase());
  
        tagsSelected[id].splice(index,1);
        newTag.remove();
        
        // update reccipes
        filterRecipesByTags();
        searchRecipes();

    });

    tagsSelected[id].push(value.toLowerCase());
    tagsHTML.appendChild(newTag);

    // update reccipes
    filterRecipesByTags();
    searchRecipes();

}
/**
 * filters the recipes and sends the elements that are found an array
 * @param {string} value 
 * @returns {Array} recipes -> the new recipes (filtred)
 */
 function filterRecipesByTags() {
    // reset
    filteredRecipes = data;
    resetTags();

    // update
    sortTags('ingredient');
    sortTags('appliance');
    sortTags('ustensil');
    updateTags();
    
    // display
    displayRecipes(filteredRecipes)
}
/**
 * 
 * @param {*} value 
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
function sortTags(id) {
    
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
    search.addEventListener('input', searchRecipes);
    searchLabel.addEventListener('click', searchRecipes);
    for (const filter of filters)  displayFilters(filter);
 
}