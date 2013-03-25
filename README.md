halve_your_cake
===============

Halve your cake, and eat it too

check out the live demo at:
Dr-Ace.github.com/halve_your_cake

Enter a recipe, and chose the amount you would like to multiply it by.
The recipe is parsed for quantity value and unit of measurement.
All formats of Imperial system units are accepted in parsing.
Quantities without a known Imperial unit are processed as numbers only.
Imperial system volumetric units of measurements are converted accordingly when multiplied (e.g. 3 teaspoons is a tablespoon).
Quantity values and units of measurement are highlighted in the text input for clarity.
Results are displayed on the screen in real time.

All conversion functionality is in app.js. All UI and display functionality is in script.js.
Only the multiplyRecipe function needs to be called on the recipe. 
The quantity and unit of measurement is returned with multiplyIngredient.

