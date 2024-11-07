function formEvaluation(event) {
    event.preventDefault();

    let name = document.getElementById("name-input-register").value;
    let lastName = document.getElementById("lastname-input-register").value;
    let username = document.getElementById("username-input-register").value;
    let password = document.getElementById("password-input-register").value;
    let email = document.getElementById("email-input-register").value; 
    let date = document.getElementById("date-input-register").value;

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

    let isValid = true;

    let client = JSON.parse(localStorage.getItem("client")) || []; 

    const rulesParagraphs = document.getElementById('rules-container-register').getElementsByTagName('p');

    let existingUser = client.find(user => username.toLowerCase().trim() === user.Username.toLowerCase().trim());
    if (existingUser || username.trim() =="") {
        rulesParagraphs[0].innerHTML = "❌ Username must be unique";
        document.getElementById("username-input-register").focus();
        console.log("Username Already Exists");
        isValid = false;
    } else {
        setTimeout(()=>{
            rulesParagraphs[0].innerHTML = "✅ Username must be unique";
        },100);
    }

    if (password.length < 5 || password.length > 12) {
        rulesParagraphs[1].innerHTML = "❌ Password must be from 5 to 12 characters long";
        document.getElementById("password-input-register").focus();
        console.log("Password not within the correct range");
        isValid = false;
    } else {
        setTimeout(()=>{
            rulesParagraphs[1].innerHTML = "✅ Password must be from 5 to 12 characters long";
        },200);
    }

    existingUser = client.find(user => user.Email.toLowerCase().trim() === email.toLowerCase().trim());
    if (existingUser || email.trim() == "") {
        rulesParagraphs[2].innerHTML = "❌ Email must not already be in use";
        document.getElementById("email-input-register").focus();
        console.log("Email is not unique");
        isValid = false;
    } else {
        setTimeout(()=>{
            rulesParagraphs[2].innerHTML = "✅ Email must not already be in use";
        },300);
    }

    if (age < 18 || date.trim() == "") {
        rulesParagraphs[3].innerHTML = "❌ You must be 18+";
        document.getElementById("date-input-register").focus();
        console.log("User under 18");
        isValid = false;
    } else {
        setTimeout(()=> {
            rulesParagraphs[3].innerHTML = "✅ You must be 18+";
        },400);
        
    }

    if (name.trim() == "" || lastName.trim() == "") {
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

        const newClient = {
            "Name": name,
            "LastName": lastName,
            "Email": email,
            "Birthday": date,
            "Username": username,
            "Password": password,
            "ID": client.length > 0 ? (client[client.length - 1].ID + 1) : 1,
            "Books-liked": [],
            "Books-purchased": []
        };

        console.log(newClient);

        client.push(newClient);

        localStorage.setItem("client", JSON.stringify(client));

        setTimeout(() => {
            alert("Registration success :)");
        }, 500)

    } else {
        alert("Follow the set of conditions !!!");
    }
}

document.getElementById("form-register").addEventListener("submit", formEvaluation);
