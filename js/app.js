const monthSelect = document.getElementById("month-select");
const generateBtn = document.getElementById("generate-btn");
const recipesContainer = document.getElementById("recipes");
const seasonInfo = document.getElementById("season-info");

// Ingredienser per månad
const seasonalIngredients = {
  1: ["Carrot", "Potato", "Cabbage"],
  2: ["Carrot", "Potato", "Cabbage"],
  3: ["Asparagus", "Spinach", "Strawberries"],
  4: ["Asparagus", "Spinach", "Strawberries"],
  5: ["Strawberries", "Spinach", "Zucchini"],
  6: ["Strawberries", "Spinach", "Zucchini"],
  7: ["Tomato", "Cucumber", "Zucchini"],
  8: ["Tomato", "Cucumber", "Zucchini"],
  9: ["Pumpkin", "Apple", "Mushroom"],
  10: ["Pumpkin", "Apple", "Mushroom"],
  11: ["Carrot", "Cabbage", "Potato"],
  12: ["Carrot", "Cabbage", "Potato"]
};

/**
 * Hämtar och visar recept för en viss månad
 * @param {number} month - Månad 1-12
 */
const showRecipesForMonth = (month) => {
  const ingredients = seasonalIngredients[month];
  seasonInfo.textContent = `Seasonal ingredients this month: ${ingredients.join(", ")}`;

  recipesContainer.innerHTML = "";
  const addedMeals = new Set();

  ingredients.forEach((ingredient) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.meals) {
          data.meals.forEach((meal) => {
            if (!addedMeals.has(meal.idMeal)) {
              addedMeals.add(meal.idMeal);

              const card = document.createElement("div");
              card.classList.add("recipe-card");
              card.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="card-content">
                  <h3>${meal.strMeal}</h3>
                  <p>Ingrediens: ${ingredient}</p>
                  <a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank" rel="noopener noreferrer">Open recipe</a>
                </div>
              `;
              recipesContainer.appendChild(card);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Fel vid hämtning:", error);
      });
  });
};

// Visa recept för aktuell månad direkt vid laddning
const today = new Date();
monthSelect.value = today.getMonth() + 1;
showRecipesForMonth(today.getMonth() + 1);

// Uppdatera när användaren klickar på knappen
generateBtn.addEventListener("click", () => {
  showRecipesForMonth(parseInt(monthSelect.value, 10));
});
