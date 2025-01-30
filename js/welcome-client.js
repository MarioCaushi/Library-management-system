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
  return response.json();
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
    <button class="save-button" onclick="saveChanges()">Save Changes</button>
  </div>
    `;

  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", logoutAction);
}

async function updateStats() {
  const books = await fetchBooks();

  const totalBooks = books.length;

  document.getElementById("bookCount").textContent = totalBooks;
}

async function saveChanges() {
  let user;
  user.name = $(document.getElementById("name")).value;
  user.lastName = $(document.getElementById("lastName")).value;
  user.username = $(document.getElementById("username")).value;
  user.email = $(document.getElementById("email")).value;
  user.birthday = $(document.getElementById("birthday")).value;
  user.password = $(document.getElementById("password")).value;

  await updateUserInfo(userID, user);
}

function navigateTo(page) {
  window.location.href = page;
}

export { navigateTo };

function initializeWelcomePage() {
  showClientInfo();
  updateStats();
}

window.onload = initializeWelcomePage;
