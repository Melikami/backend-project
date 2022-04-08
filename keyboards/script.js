//Function to fetch data from Strapi
async function getDataFromStrapi() {

  //Url to Strapi API to fetch all keyboard objects
  let url = "http://localhost:1337/api/keyboards";

  //Fetches JSON from SPI and convert to JS object
  let stringReply = await fetch(url);
  let myObject = await stringReply.json();

  console.log(myObject);

  let output = "";

  //Checks if one or more objects are fetched
  if (Array.isArray(myObject.data)) {
    
    //Loops through every element in array
    myObject.data.forEach((element) => {

      //A pointer to attributes
      let obj = element.attributes;

      for (x in obj) {
        console.log(x + ": " + obj[x]);
      }

      //Output to string
      output += `<div>Title: ${obj.title}</div>`;
    });

  } else {
    //Pointer
    let obj = myObject.data.attributes;
    for (x in obj) {
      console.log(x + ": " + obj[x]);
    }

    //Output to string
    output += `<div>Title: ${obj.title}</div>`;
  }

  //Output string to div
  document.getElementById("keyboardFetch").innerHTML = output;
}

//Fetches token if user and pass is correct
async function getToken() {

    let valid = true;

    //Validate user and pass
    if (!validateLogin()) valid = false;

    if (!valid) return null;

  //Url to Strapi.js UserList
  const userUrl = "http://localhost:1337/api/auth/local/";

  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  //object created from user and pass
  let userObject = {
    identifier: user,
    password: pass,
  };

  //Calls API with login data
  let userReply = await fetch(userUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObject),
  });

  //Converts API response JSON string to object
  let userJson = await userReply.json();
  console.log(userJson);

  //Checks if object has Token.
  if (userJson.jwt) postData(userJson.jwt);
  else {
    
    //Failed login = error message
    let errMess = userJson.error.message;

    document.getElementById("userErr").innerText = errMess;

    return null;
  }
}

async function postData(token) {

  //URL to Strapi database
  const keyboardUrl = "http://localhost:1337/api/keyboards/";

  //Fetches data from input
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const qty = document.getElementById("qty").value;

  //Creates object from data
  let keyboardObject = {
    data: {
      title: title,
      description: description,
      price: price,
      qty: qty,
    },
  };

  //Calls API with object
  let keyboardReply = await fetch(keyboardUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, 
      //Includes token from login

    },
    body: JSON.stringify(keyboardObject),
  });

  let keyboardJson = await keyboardReply.json();

  console.log(keyboardJson);
}

//Validation
function userValidate(comp) {
    //Must have input

    let valid = true;

    if (comp.value.length == 0) {
        //Failed validation
        valid = false;
    }

    //Error message
    if (!valid) {
        document.getElementById("userErr").innerText = "You have to enter a username";
        return false;
    } else {
        document.getElementById("userErr").innerText = "";
        return true;
    }
}

//Validation password
function passValidate(comp) {
    //Must be longer than 5

    let valid = true;

    if (comp.value.length <= 4) {
        //Failed validation
        valid = false;
    }

    //Error message
    if (!valid) {
        document.getElementById("passErr").innerText = "The password needs to be at least 5 characters long";
        return false;
    } else {
        document.getElementById("passErr").innerText = "";
        return true;
    }
}

//Validate login
function validateLogin() {

    let valid = true;

    //Validate user
    if (!userValidate(document.getElementById("user"))) {
        valid = false;
    }

    //Validate password
    if (!passValidate(document.getElementById("pass"))) {
        valid = false;
    }

    return valid;
}
