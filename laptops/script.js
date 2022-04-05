//Funktion för att hämta data från Strapi CMS
async function getDataFromStrapi() {
  //Url till Strapi.js API för att hämta alla Pokemons
  let url = "http://localhost:1337/api/laptops";

  //Hämtar JSON från API och konverterar det till JS objekt
  let stringResponse = await fetch(url);
  let myObject = await stringResponse.json();

  console.log(myObject);

  let output = "";

  //Checkar om det är ett eller flera objekt som hämtas
  //Kan undvikas genom flera funktioner; en för alla och en för unik
  if (Array.isArray(myObject.data)) {
    //Skapar en ForEach loop för varje elemet i Data-arrayen
    myObject.data.forEach((element) => {
      //Gör en pekare till attribut objektet
      let obj = element.attributes;

      for (x in obj) {
        console.log(x + ": " + obj[x]);
      }

      //Skriver Output string
      //document.write(`Namn: ${attr.name}`);
      output += `<div>Title: ${obj.title}</div>`;
    });
  } else {
    //Gör en pekare till attribut objektet
    let obj = myObject.data.attributes;
    for (x in obj) {
      console.log(x + ": " + obj[x]);
    }

    //Skriver Output string
    output += `<div>Title: ${obj.title}</div>`;
  }

  //Skriver ut Output string till div-element
  //document.write(output);
  document.getElementById("laptopFetched").innerHTML = output;
}

//Funktion för att hämta Token för användare
//Om en Token hämtas så betyder det att user/password är korrekt skrivet
async function getToken() {
  /*
    1. Göra ett inloggningsförsök för att få en Token returnerad
    2. Sammla data och skapa ett objekt av dessa
    3. Skicka iväg JSON till API
    */

    let valid = true;

    //Validera användarnamn och lösenord!
    if (!validateLogin()) valid = false;

    if (!valid) return null;

  //Url till Strapi.js UserList
  const urlUser = "http://localhost:1337/api/auth/local/";

  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  //Skapar ett objekt av det användarnamn och lösenord som user har skrivit in i fält.
  let userObject = {
    identifier: user,
    password: pass,
  };

  //Anropar API med inloggningsdata.
  //Inkluderar Method och Headers
  let userResponse = await fetch(urlUser, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObject),
  });

  //Konverterar API response JSON string till ett objekt
  let userJson = await userResponse.json();
  console.log(userJson);

  //Kontrollerar om objektet har Token.
  //Token ligger under attribut jwt
  //Om så; inloggning är korrekt. Fortsätt till funktion postData med token som parameter.
  if (userJson.jwt) postData(userJson.jwt);
  else {
    //Inloggningen har misslyckats. Skriv ut errormeddelande från Strapi.js
    let errMessage = userJson.error.message;

    document.getElementById("userError").innerText = errMessage;

    return null;
  }
}

async function postData(token) {
  //URL till Strapi Pokemon collection.
  const urllaptop = "http://localhost:1337/api/laptops/";

  // Hämtar data från fält
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const qty = document.getElementById("qty").value;

  //Skapa ett objekt med data inkluderat.
  let laptopObject = {
    data: {
      title: title,
      description: description,
      price: price,
      qty: qty,
    },
  };

  //Anropar API med pokemonObjekt
  let laptopResponse = await fetch(urllaptop, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, //Inkluderar Token från inloggning tidigare.
    },
    body: JSON.stringify(laptopObject),
  });

  let laptopJson = await laptopResponse.json();

  console.log(laptopJson);
}

//Funktioner för validering
//Validering av User Input
function userValidate(comp) {
    // 1. Fältet måste vara ifyllt

    let valid = true;

    if (comp.value.length == 0) {
        //Misslyckad validering
        valid = false;
    }

    //Check on lyckad validering
    if (!valid) {
        document.getElementById("userError").innerText = "Du måste fylla i ett användarnamn!";
        return false;
    } else {
        document.getElementById("userError").innerText = "";
        return true;
    }
}

//Validering av Password input
function passValidate(comp) {
    // 1. Fältet måste vara minst 5 tecken eller längre

    let valid = true;

    if (comp.value.length <= 4) {
        //Misslyckad validering
        valid = false;
    }

    //Check on lyckad validering
    if (!valid) {
        document.getElementById("passwordError").innerText = "Lösenordet måste vara minst 5 tecken långt!";
        return false;
    } else {
        document.getElementById("passwordError").innerText = "";
        return true;
    }
}

//funktion för validering av inloggninfsförsök
function validateLogin() {
    //Variabel
    let valid = true;

    //Validate Användarnamn
    if (!userValidate(document.getElementById("user"))) {
        valid = false;
    }

    //Validate Password
    if (!passValidate(document.getElementById("pass"))) {
        valid = false;
    }

    return valid;
}
