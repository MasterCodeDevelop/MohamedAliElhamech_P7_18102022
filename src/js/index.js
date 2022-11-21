/*###################### IMPORTS ######################*/
import { getRecipes, getCloneTemplate } from './get.js';
import { display } from './display.js';

/*###################### CONST ######################*/
const recipes = document.getElementById('recipes');

/*###################### FUNCTION ######################*/
/**
 * Init the page and display all élements
 */
async function init() {
	try {
		const dataRecipes = await getRecipes();
		display(dataRecipes);
	
	} catch (error) {
		// Display a error message in the main main page
		const messageError = getCloneTemplate('template-message-fetch-error');
		recipes.innerHTML = '';
		recipes.append(messageError);
	}
}
/*###################### EXECUT ######################*/
init();