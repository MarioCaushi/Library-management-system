
function logoutAction() {
  const decision = confirm("Are you sure?");

  console.log(decision);

  if (decision) {
    console.log("Manager logged out");
    window.location.href = "index.html";
  }
}


async function getManagerInfoById(id) {

  const url =`http://localhost:5223/api/Manager/get-manager-by-id/${id}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }

    });

    if(!response.ok){
      alert("Manager Info could not be fetched");
      return null;
    }

    return response.json();
  }catch(error){
    console.error("Manager Info could not be fetched", error);
  }
}


async function showManagerInfo() {

  const container = document.getElementById("welcomeAdmin-container");
  container.innerHTML = "";

  const managerId = Number(JSON.parse(localStorage.getItem("manager")));

  const  manager = await getManagerInfoById(managerId);
  console.log(manager);
  if (!manager) {
    container.innerHTML = `<p>Error: No manager data found. Please try again later.</p>`;
    return;
  }

  const { name, lastName, email, birthday, username, totalBooks, totalClients } = manager;

  container.innerHTML = `
      <div class="text-center">
        <h3>${name} ${lastName}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Birthday:</strong> ${birthday.slice(0,10)}</p>
        <p><strong>Username:</strong> ${username}</p>
      </div>
    `;

    document.getElementById("bookCount").textContent = totalBooks;
    document.getElementById("clientCount").textContent = totalClients;
  
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", logoutAction);
  }


function initializeWelcomePage() {
  showManagerInfo();
}

window.onload = initializeWelcomePage;
