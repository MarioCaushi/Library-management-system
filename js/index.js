//Declaring lists for clients and book to store and use throughout the application
let client=[];
let book=[];
let manager=null; //there is only one

//Fetching the Data from the JSON file and seperating it into lists for easier access
function fetchData() {
    fetch("json/data.json")
    .then(response => {
        if(!response.ok)
            {
                throw new Error("Fetching data from JSON file went wrong");
            }
            return response.json();
    })
    .then(data => {
        console.log(data);
        
        manager=data.manager;
        client=data.clients;
        book=data.books;

        //Storing the lists in local-storage so thet can be easily accessed throughout different files
        //and updated so the content is not lost when page loaded or whatever

        localStorage.setItem("client",JSON.stringify(client));
        localStorage.setItem("book",JSON.stringify(book));

    })
    .catch(Error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};

//Function to evaluate the login-form input 
function evaluateLogin() {
    let username = document.getElementById("username-login").value;
    let password = document.getElementById("password-login").value;
    console.log(username)
    console.log(password)

    document.getElementById("username-login").value = "";
    document.getElementById("password-login").value = "";

    if (username === manager.Username) {
        if (manager.Password !== password) {
            console.log("Password not correct");
            document.getElementById("login-evaluation").innerHTML = "<p class='text-danger small'>Password not correct for manager!</p>";
            return; 
        }
        //If manager credentials added successfull then you need to redirct to your own page
        console.log("Manager logged in successfully!");
        localStorage.setItem("manager",JSON.stringify(manager));
        window.location.href="manager-welcome.html";

    } else {
        
        const user = client.find(user => user.Username === username);
        if (user) {
            if (user.Password !== password) {
                console.log("Password not correct");
                document.getElementById("login-evaluation").innerHTML = "<p class='text-danger small'>Password not correct!</p>";
                return; 
            }
              //If user credentials added successfull then you need to redirct to your own page
              console.log("User logged in successfully!");
              localStorage.setItem("user",JSON.stringify(user));
              window.location.href="client-welcome.html";

        } else {
            document.getElementById("login-evaluation").innerHTML = "<p class='text-danger small'>User does not exist!</p>";
        }
    }
}


//Fetching the actual data
fetchData();

//Evaluating the login input
document.getElementById("login-btn").addEventListener("click", evaluateLogin);