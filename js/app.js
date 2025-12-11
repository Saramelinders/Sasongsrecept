// =====================
// HÄR HÄMTAR VI ALLA VIKTIGA ELEMENT FRÅN HTML
// =====================

// Dropdown där användaren väljer månad
const monthSelect = document.getElementById("month-select");
// Knappen som man klickar på för att generera recept
const generateBtn = document.getElementById("generate-btn");
// Container där alla receptkort ska visas
const recipesContainer = document.getElementById("recipes");
// Textfält som säger vilka ingredienser som är i säsong
const seasonInfo = document.getElementById("season-info");

// =====================
// HÄR DEFINIERAR VI INGREDIENSER PER MÅNAD
// =====================
// Tänkte att det är lättare att bara ha en lista med ingredienser
// för varje månad så vi kan loopa igenom dem och hämta recept.
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

// =====================
// HJÄLPFUNKTION FÖR ATT HÄMTA RECEPT FRÅN API
// =====================
// Jag gjorde en egen funktion för detta så koden blir renare
// och jag slipper skriva samma fetch-loop flera gånger.
const fetchMealsByIngredient = (ingredient, addedMeals) => {
  // fetch hämtar data från TheMealDB API
  return fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then((res) => res.json()) // omvandla svaret till JSON
    .then((data) => {
      if (!data.meals) return; // om inga recept hittas, gör inget
      // loopa igenom alla måltider vi fick tillbaka
      data.meals.forEach((meal) => {
        // här kollar vi om vi redan har lagt till detta recept
        if (!addedMeals.has(meal.idMeal)) {
          addedMeals.add(meal.idMeal); // lägg till i set så vi inte dubblar

          // skapa ett nytt div-element som blir kortet
          const card = document.createElement("div");
          card.classList.add("recipe-card"); // ge det rätt CSS-klass
          card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="card-content">
              <h3>${meal.strMeal}</h3>
              <p>Ingrediens: ${ingredient}</p>
              <a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank" rel="noopener noreferrer">Open recipe</a>
            </div>
          `;
          // lägg kortet i DOM:en så användaren ser det
          recipesContainer.appendChild(card);
        }
      });
    })
    // om fetch går fel så loggar vi felet i console
    .catch((err) => console.error("Fel vid hämtning:", err));
};

// =====================
// FUNKTION FÖR ATT VISA RECEPT FÖR EN MÅNAD
// =====================
const showRecipesForMonth = (month) => {
  // hämta ingredienser för vald månad
  const ingredients = seasonalIngredients[month];

  // uppdatera textfältet som visar säsongsingredienser
  seasonInfo.textContent = `Seasonal ingredients this month: ${ingredients.join(", ")}`;

  // töm tidigare kort innan vi visar nya
  recipesContainer.innerHTML = "";

  // set för att hålla reda på unika recept, så vi inte dubblar
  const addedMeals = new Set();

  // loopa igenom alla ingredienser och hämta recept via API
  ingredients.forEach((ingredient) => fetchMealsByIngredient(ingredient, addedMeals));
};

// =====================
// INIT - VISA RECEPT FÖR NUVARANDE MÅNAD DIREKT VID LADDNING
// =====================
const today = new Date(); // ny Date() ger dagens datum
monthSelect.value = today.getMonth() + 1;
// kalla vår funktion med dagens månad
showRecipesForMonth(today.getMonth() + 1);

// =====================
// EVENTLISTENER PÅ KNAPP
// =====================
// när användaren klickar på generate knappen så ska nya recept hämtas
generateBtn.addEventListener("click", () => {
  // hämta valt värde från dropdown
  const selectedMonth = parseInt(monthSelect.value, 10);
  // kalla funktionen med vald månad
  showRecipesForMonth(selectedMonth);
});

