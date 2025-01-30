const userID = JSON.parse(localStorage.getItem("user"));

const fetchUserInfo = async (id) => {
  const url = `http://localhost:5223/Browser/client/${id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const updateUserInfo = async (id, user) => {
  const url = `http://localhost:5223/api/Clients/edit-client/${id}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        Name: `${user.name}`,
        LastName: `${user.lastName}`,
        Email: `${user.email}`,
        Birthday: `${user.birthday}`,
        Username: `${user.username}`,
        Password: `${user.password}`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);  // Throwing an error if the response is not successful
    }
    return true;  // Returning the response if it's successful
  } catch (error) {
    console.error('Failed to update user info:', error);  // Logging the error to the console
    return false;  // Optionally, return null or a custom error object/message
  }
};


const fetchBooks = async () => {
  const url = `http://localhost:5223/Browser/books`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return null;
  }
};

function logoutAction() {
  const decision = confirm("Are you sure?");

  console.log(decision);

  if (decision) {
    console.log("Client logged out");
    window.location.href = "index.html";
  }
}

async function showClientInfo() {
  const container = document.getElementById("welcomeClient-container");
  container.innerHTML = "";

  let client = await fetchUserInfo(userID);
  console.log(client);
  if (!client) {
    container.innerHTML = `<p>Error: No client data found. Please try again later.</p>`;
    return;
  }

  const { name, surname, username, email, birthday, password } = client;

  container.innerHTML = `
      <div class="text-center">
    <h3>
      <strong>Name:</strong> 
      <span contenteditable="true" class="editable" id="name">${name}</span>
    </h3>
    <h3>
      <strong>Last Name:</strong> 
      <span contenteditable="true" class="editable" id="lastName">${surname}</span>
    </h3>
    <p>
      <strong>UserName:</strong> 
      <span contenteditable="true" class="editable" id="username">${username}</span>
    </p>
    <p>
      <strong>Email:</strong> 
      <span contenteditable="true" class="editable" id="email">${email}</span>
    </p>
    <p>
      <strong>Birthday:</strong> 
      <span contenteditable="true" class="editable" id="birthday">${birthday}</span>
    </p>
    <p>
      <strong>Password:</strong> 
      <span contenteditable="true" class="editable" id="password">${password}</span>
    </p>
    <button class="save-button" id="save-button-client">Save Changes</button>
  </div>
    `;

  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", logoutAction);

  document.getElementById("save-button-client").addEventListener("click", saveChanges);
}

async function updateStats() {
  const books = await fetchBooks();

  const totalBooks = books.length;

  document.getElementById("bookCount").textContent = totalBooks;
}

async function saveChanges() {
  let user = {
    name: document.getElementById("name").innerText,
    lastName: document.getElementById("lastName").innerText,
    username: document.getElementById("username").innerText,
    email: document.getElementById("email").innerText,
    birthday: document.getElementById("birthday").innerText,
    password: document.getElementById("password").innerText
  };

  const response = await updateUserInfo(userID, user);

  if(response) {  // This checks if the HTTP status code is 200-299
    alert("Changes made successfully");
  } else {
    alert("Something went wrong");
  }
}

function navigateTo(page) {
  window.location.href = page;
}

function initializeWelcomePage() {
  showClientInfo();
  updateStats();
}

window.onload = initializeWelcomePage;

export { navigateTo };
