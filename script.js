//get drinks objects using MakeDrink class
fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic")
  .then((res) => res.json())
  .then(async (data) => {
    let drinksData = data.drinks;
    let drinksArr = [];
    // Loop thorugh drinks data
    // Create drink objects using MakeDrink constructor
    let promises = [];
    for (let i = 0; i < drinksData.length; i++) {
      let newDrink = new MakeDrink(drinksData[i]);
      promises.push(newDrink.init());
    }
    await Promise.all(promises).then((resolve) => {
      drinksArr.push(...resolve);
    });
    // console.log("~ drinksArr", drinksArr);

    // Render drinks to DOM in side class="drinks-container"
    // flipCard -> flipCardInner -> frontCard -> img and drinkName
    // flipCard ->  flipCardInner -> backCard -> img and drinkInstructions and drinkIngredients
    for (i = 0; i < drinksArr.length; i++) {
      let drink = drinksArr[i];
      let drinkName = drink.drinkName;
      let drinkImg = drink.drinkImage;
      let drinkInstructions = drink.drinkInstructions;
      let drinkMeasures = drink.drinkMeasures;
      let drinkIngredients = drink.drinkIngredients;

      // Create flip card
      let flipCard = document.createElement("div");
      let flipCardInner = document.createElement("div");

      // Create front card
      let frontCard = document.createElement("div");
      let drinkFrontName = document.createElement("span");
      let drinkFrontImg = document.createElement("img");

      // Create back card
      let backCard = document.createElement("div");
      let drinkBackImg = document.createElement("img");
      let drinkBackName = document.createElement("span");
      let drinkBackInstructionsContainer = document.createElement("div");
      let drinkBackInstructionsTitle = document.createElement("h3");
      let drinkBackInstructions = document.createElement("p");
      let drinkBackIngredientsConatiner = document.createElement("div");
      let drinkBackIngredientsTitle = document.createElement("h3");
      let drinkBackIngredients = document.createElement("ul");

      // Add classes to flipCard and flipCardInner
      flipCard.classList.add("flip-card");
      flipCardInner.classList.add("flip-card-inner");

      // Add classes to frontCard and backCard
      frontCard.classList.add("flip-card-front");
      backCard.classList.add("flip-card-back");

      // Add classes to drinkFrontName and drinkBackName
      drinkFrontName.classList.add("front-drink-name");
      drinkBackName.classList.add("back-drink-name");

      // Add classes to drinkFrontImg and drinkBackImg
      drinkFrontImg.classList.add("front-drink-img");
      drinkBackImg.classList.add("back-drink-img");

      // Add classes to drinkBackIngredientsConatiner and drinkBackIngredientsTitle
      drinkBackIngredientsConatiner.classList.add(
        "drink-ingredients-container"
      );
      drinkBackIngredientsTitle.classList.add("drink-ingredients-title");
      drinkBackIngredients.classList.add("drink-ingredients-list");

      // Add classes to drinkBackInstructions and drinkBackInstructionsTitle
      drinkBackInstructionsContainer.classList.add(
        "drink-instructions-container"
      );
      drinkBackInstructionsTitle.classList.add("drink-instructions-title");
      drinkBackInstructions.classList.add("drink-instructions");

      // Add text to drinkFrontName and drinkBackName
      drinkFrontName.textContent = drinkName;
      drinkBackName.textContent = drinkName;

      // Add img to drinkFrontImg and drinkBackImg
      drinkFrontImg.src = drinkImg;
      drinkBackImg.src = drinkImg;

      // Add text to drinkBackInstructions and drinkBackInstructionsTitle
      drinkBackInstructionsTitle.textContent = "Instructions";
      drinkBackInstructions.textContent = drinkInstructions;

      // Add text to drinkBackIngredientsTitle
      drinkBackIngredientsTitle.textContent = "Ingredients";

      // Create a list item for every Ingredient
      for (let i = 0; i < drinkIngredients.length; i++) {
        let li = document.createElement("li");
        li.classList.add("drink-ingredient");
        let drinkBackIngredientText = document.createTextNode(
          drinkIngredients[i] + " " + drinkMeasures[i]
        );
        li.appendChild(drinkBackIngredientText);
        drinkBackIngredients.appendChild(li);
      }

      // Append elements to DOM
      const drinksContainer = document.querySelector(".drinks-container");
      drinksContainer.appendChild(flipCard);
      flipCard.appendChild(flipCardInner);
      flipCardInner.appendChild(frontCard);
      frontCard.appendChild(drinkFrontName);
      frontCard.appendChild(drinkFrontImg);
      flipCardInner.appendChild(backCard);
      backCard.appendChild(drinkBackImg);
      backCard.appendChild(drinkBackName);
      backCard.appendChild(drinkBackInstructionsContainer);
      drinkBackInstructionsContainer.appendChild(drinkBackInstructionsTitle);
      drinkBackInstructionsContainer.appendChild(drinkBackInstructions);
      backCard.appendChild(drinkBackIngredientsConatiner);
      drinkBackIngredientsConatiner.appendChild(drinkBackIngredientsTitle);
      drinkBackIngredientsConatiner.appendChild(drinkBackIngredients);
    }

    //Toggle flipcards on click
    let flipCardSelector = document.querySelectorAll(".flip-card");
    flipCardSelector.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (card.firstChild.style.transform === "") {
          card.firstChild.style.transform = "rotateY(180deg)";
        }
      });
      //Close flipcards on scroll
      window.addEventListener("scroll", (event) => {
        let scrollY = this.scrollY;
        let scrollX = this.scrollX;
        if (scrollY || scrollX) {
          card.firstChild.style.transform = "";
        }
      });
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

//Search for drink by name
const input = document.querySelector('input[type="search"]');
input.addEventListener("input", () => {
  let inputVal = input.value.toLowerCase();
  if (inputVal) {
    //hide all drinks and show only matching drinks in input, search by name
    let drinks = document.querySelectorAll(".flip-card");
    drinks.forEach((drink) => {
      drink.style.display = "none";
      if (drink.textContent.toLowerCase().includes(inputVal)) {
        drink.style.display = "block";
      }
    });
  } else {
    //show all drinks
    let drinks = document.querySelectorAll(".flip-card");
    drinks.forEach((drink) => {
      drink.style.display = "block";
    });
  }
});

// MakeDrink class
class MakeDrink {
  constructor(drinkData) {
    this.drinkID = drinkData.idDrink; //add drinkID to drink object
    this.drinkName = drinkData.strDrink; //add drinkName to drink object
    this.drinkImage = drinkData.strDrinkThumb; //add drinkImage to drink object
  }
  async init() {
    await this.getDrinkDetails();
    return this;
  }
  getDrinkDetails() {
    return fetch(
      `https://thecocktaildb.com/api/json/v1/1/lookup.php?i=${this.drinkID}`
    )
      .then((res) => res.json())
      .then((data) => {
        let drinkDetails = data.drinks[0];
        // console.log("~ drinkDetails", drinkDetails);
        let drinkInstructions = drinkDetails.strInstructions;
        this.drinkInstructions = drinkInstructions;
        // get all avialable ingredients for drink and store them in array
        let drinkIngredients = [];
        for (let i = 1; i <= 15; i++) {
          if (drinkDetails[`strIngredient${i}`]) {
            drinkIngredients.push(drinkDetails[`strIngredient${i}`]);
          }
        }
        this.drinkIngredients = drinkIngredients; //add ingredients to drink

        // get all avialable measures for this drink and store in array
        let drinkMeasures = [];
        for (let i = 1; i <= 15; i++) {
          if (drinkDetails[`strMeasure${i}`]) {
            drinkMeasures.push(drinkDetails[`strMeasure${i}`].trim());
          } else if (drinkDetails[`strMeasure${i}`] == null) {
            drinkMeasures.push("amount personal preference");
          }
        }
        //filter out extra N/A measures that doesn't has an ingredient
        drinkMeasures = drinkMeasures.slice(0, drinkIngredients.length);
        this.drinkMeasures = drinkMeasures; // add measures to drink
      });
  }
}
