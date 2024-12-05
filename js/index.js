// Fetching the Data from the JSON file and separating it into lists for easier access
function fetchData() {
    fetch("json/data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Fetching data from JSON file went wrong");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);

        // Storing the data in local storage
        localStorage.setItem("client", JSON.stringify(data.clients));
        localStorage.setItem("book", JSON.stringify(data.books));
        localStorage.setItem("manager",JSON.stringify(data.manager))
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

// Function to evaluate the login-form input 
function evaluateLogin() {
    let username = document.getElementById("username-login").value;
    let password = document.getElementById("password-login").value;
    
    document.getElementById("username-login").value = "";
    document.getElementById("password-login").value = "";

    let manager=JSON.parse(localStorage.getItem("manager"));

    if (username === manager.Username) {
        if (manager.Password !== password) {
            console.log("Password not correct");
            document.getElementById("login-evaluation").innerHTML = "<p class='text-danger small'>Password not correct for manager!</p>";
            return; 
        }
        //If manager credentials added successfull then you need to redirct to your own page
        console.log("Manager logged in successfully!");

        window.location.href = "welcome-admin.html";
    } else {
        let client=JSON.parse(localStorage.getItem("client"));
        const user = client.find(user => user.Username === username);
        if (user) {
            if (user.Password !== password) {
                console.log("Password not correct");
                document.getElementById("login-evaluation").innerHTML = "<p class='text-danger small'>Password not correct!</p>";
                return; 
            }
            //If user credentials added successfull then you need to redirct to your own page
            console.log("User logged in successfully!");
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "welcome-client.html";
        } else {
            document.getElementById("login-evaluation").innerHTML = "<p class='text-danger small'>User does not exist!</p>";
        }
    }
}

// Evaluating the login input
document.addEventListener("DOMContentLoaded", () => {
    // Fetching the actual data
    if (localStorage.length === 0) {
        fetchData();
    }

    const loginButton = document.getElementById("login-button");
    if (loginButton) {
        loginButton.addEventListener("click", evaluateLogin);
    } else {
        console.error("Login button not found!");
    }
});
//exporting the fetchData function so it can be used in other files
export {fetchData};