/**
 *  Fetches the data recipes
 * @returns  {promise} object Json
 */
 export async function getRecipes() {
    const response = await fetch('./src/data/recipes.json');
    return await response.json();
}
/**
 * Get to clone the template present with ID in the HTML page
 * @param {string} ID 
 * @returns {DocumentFragment}
 */
 export function getCloneTemplate(ID) {
    return document.getElementById(ID).content.cloneNode(true).firstElementChild;
}