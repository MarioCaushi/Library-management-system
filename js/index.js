// Function to call the API for authentication 
function authenticate(data) {
  fetch('http://localhost:5223/Authentication/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        return null;
      }
      return response.json();
    })
    .then(data => {

      console.log('Success:', data);

      if (data == null) {
        console.log("Credentials not right ");
        document.getElementById("login-evaluation").innerHTML =
          "<p class='text-danger small'>Credentials are not correct!</p>";
        return;
      }

      if (data["Role"] == "Manager") {

        localStorage.setItem("manager", JSON.stringify(Number(data["Id"])));
        //If manager credentials added successful then you need to redirect to your own page

        console.log("Manager logged in successfully!");
        window.location.href = "welcome-admin.html";
      } else {
        localStorage.setItem("user", JSON.stringify(Number(data["Id"])));

        //If user credentials added successful then you need to redirect to your own page
        console.log("User logged in successfully!");
        window.location.href = "./welcome-client.html";
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to evaluate the login-form input
function evaluateLogin() {
  const username = document.getElementById("username-login").value;
  const password = document.getElementById("password-login").value;

  document.getElementById("username-login").value = "";
  document.getElementById("password-login").value = "";

  const dataToSend = {
    Username: username,
    Password: password
  };

  authenticate(dataToSend);
}

// Evaluating the login input
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");
  if (loginButton) {
    loginButton.addEventListener("click", evaluateLogin);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === "Return") {
        event.preventDefault(); 
        evaluateLogin();
      }
    });

  } else {
    console.error("Login button not found!");
  }
});



