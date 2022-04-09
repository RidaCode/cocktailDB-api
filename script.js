//fetch list of non alcohlic drinks

fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic")
  .then((res) => res.json())
  .then((data) => {
    let drinksData = data.drinks;

    // console.log("~ drinksThumbs", drinksThumbs);

    //Loop thorugh drinks data and pass values to renderDrink()
    for (let index = 0; index < drinksData.length; index++) {
      const url = drinksData[index].strDrinkThumb;
      const name = drinksData[index].strDrink;
      // const id = drinksData[index].idDrink;
      renderDrink(url, name, ".drinks-container");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Create elements by passing in targetSelector and data
function renderDrink(url, drinkName, targetSelector) {
  const li = document.createElement("li");
  const img = document.createElement("img");
  const span = document.createElement("span");
  const selector = document.querySelector(targetSelector);
  img.src = url;
  span.textContent = drinkName;
  selector.appendChild(li).appendChild(img);
  selector.appendChild(li).appendChild(span);
}
