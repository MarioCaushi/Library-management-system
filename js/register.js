// Function to check username validity
async function checkUsernameValidity(username) {

    const url = 'http://localhost:5223/Register/check-validity';

    const userData = {
        Type: "Username",
        Content: username,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        return response.ok;
    } catch (error) {

        console.error('Failed to check username validity:', error);
        return false;
    }
}

// Function to check email validity
async function checkEmailValidity(email) {

    const url = 'http://localhost:5223/Register/check-validity';

    const userData = {
        Type: "Email",
        Content: email,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        return response.ok;
    } catch (error) {

        console.error('Failed to check email validity:', error);
        return false;
    }
}

//Function to register the new client
async function register(client) {

    const url = 'http://localhost:5223/Register/register';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(client)
        });

        return response.ok;
    } catch (error) {

        console.error('Failed to register'+ error);
        return false;
    }
}


async function formEvaluation(event) {
    event.preventDefault();

    let name = document.getElementById("name-input-register").value.trim();
    let lastName = document.getElementById("lastname-input-register").value.trim();
    let username = document.getElementById("username-input-register").value.trim();
    let password = document.getElementById("password-input-register").value.trim();
    let email = document.getElementById("email-input-register").value.trim();
    let date = document.getElementById("date-input-register").value.trim();

    console.log("Name:", name);
    console.log("Last Name:", lastName);
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Email:", email);
    console.log("Date:", date);

    let birthDate = new Date(date);
    let age = new Date().getFullYear() - birthDate.getFullYear();
    let monthDiff = new Date().getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < birthDate.getDate())) {
        age--;
    }

    let isoDate = birthDate.toISOString(); // Convert to ISO 8601 or DotNet format

    let isValid = true;

    const rulesParagraphs = document.getElementById('rules-container-register').getElementsByTagName('p');

    let existingUser = await checkUsernameValidity(username);
    if (!existingUser) {
        rulesParagraphs[0].innerHTML = "❌ Username must be unique";
        document.getElementById("username-input-register").focus();
        console.log("Username Already Exists");
        isValid = false;
    } else {
        setTimeout(() => {
            rulesParagraphs[0].innerHTML = "✅ Username must be unique";
        }, 100);
    }

    if (password.length < 5 || password.length > 12) {
        rulesParagraphs[1].innerHTML = "❌ Password must be from 5 to 12 characters long";
        document.getElementById("password-input-register").focus();
        console.log("Password not within the correct range");
        isValid = false;
    } else {
        setTimeout(() => {
            rulesParagraphs[1].innerHTML = "✅ Password must be from 5 to 12 characters long";
        }, 200);
    }

    existingUser = checkEmailValidity(email);
    if (!existingUser) {
        rulesParagraphs[2].innerHTML = "❌ Email must not already be in use";
        document.getElementById("email-input-register").focus();
        console.log("Email is not unique");
        isValid = false;
    } else {
        setTimeout(() => {
            rulesParagraphs[2].innerHTML = "✅ Email must not already be in use";
        }, 300);
    }

    if (age < 18 || date == "") {
        rulesParagraphs[3].innerHTML = "❌ You must be 18+";
        document.getElementById("date-input-register").focus();
        console.log("User under 18");
        isValid = false;
    } else {
        setTimeout(() => {
            rulesParagraphs[3].innerHTML = "✅ You must be 18+";
        }, 400);

    }

    if (name == "" || lastName == "") {
        console.log("Name or Last Name is empty");
        isValid = false;
        alert("Name and Last Name cannot be empty!");
        return;
    }

    if (isValid) {

        document.getElementById("name-input-register").value = "";
        document.getElementById("lastname-input-register").value = "";
        document.getElementById("username-input-register").value = "";
        document.getElementById("password-input-register").value = "";
        document.getElementById("email-input-register").value = "";
        document.getElementById("date-input-register").value = "";

        let idManagerValue = localStorage.getItem("manager");
        const newClient = {
            Name: name,
            LastName: lastName,
            Email: email,
            Birthday: isoDate,
            Username: username,
            Password: password,
            IdManager: idManagerValue ? JSON.parse(idManagerValue) : 1,
        };

        const registered = await register(newClient);

        console.log(newClient);
        console.log(registered);

        if (registered) {
            setTimeout(() => {
                alert("Registration success :)");
            }, 500)
        }
        else {
            setTimeout(() => {
                alert("Registration not success :(");
            }, 500)
        }

    } else {
        alert("Follow the set of conditions !!!");
    }
}

document.getElementById("form-register").addEventListener("submit", formEvaluation);
