// File structure data
let fileStructure = {
  root: {
    type: "directory",
    children: {
      Cprograming: { type: "directory", children: {} },
      Java: { type: "directory", children: {} },
      MySql: { type: "directory", children: {} },
      Images: { type: "directory", children: {} },
      Sandwich: { type: "directory", children: {} },
      Drinks: { type: "directory", children: {} },
    },
  },
};

let currentPath = ["root"];

// Function to render the file structure
function renderFileStructure() {
  const detailWrapper = document.querySelector(".detail-wrapper");
  detailWrapper.innerHTML = "";

  let currentDir = fileStructure.root;
  for (let dir of currentPath.slice(1)) {
    currentDir = currentDir.children[dir];
  }

  for (let item in currentDir.children) {
    const itemData = currentDir.children[item];
    const itemElement = document.createElement("div");
    itemElement.className = "detail-card";
    itemElement.innerHTML = `
      <img class="detail-img" alt="${itemData.type}" src="images/folder.jpg" />
      <div class="detail-desc">
        <div class="detail-name">
          <h4>${item}</h4>
          <p class="detail-sub">${itemData.type}</p>
          <p class="price">${
            itemData.type === "directory" ? "Folder" : "File"
          }</p>
        </div>
        <ion-icon class="detail-favourites" name="bookmark-outline"></ion-icon>
      </div>
    `;
    detailWrapper.appendChild(itemElement);
  }
}

// Function to create a new item
function createNewItem(name, type) {
  let currentDir = fileStructure.root;
  for (let dir of currentPath.slice(1)) {
    currentDir = currentDir.children[dir];
  }

  if (currentDir.children[name]) {
    alert("An item with this name already exists!");
    return;
  }

  currentDir.children[name] = {
    type: type,
    children: type === "directory" ? {} : null,
  };

  renderFileStructure();
  saveData();
}

// Function to rename an item
function renameItem(oldName, newName) {
  let currentDir = fileStructure.root;
  for (let dir of currentPath.slice(1)) {
    currentDir = currentDir.children[dir];
  }

  if (!currentDir.children[oldName]) {
    alert("The item you want to rename does not exist!");
    return;
  }

  if (currentDir.children[newName]) {
    alert("An item with this name already exists!");
    return;
  }

  currentDir.children[newName] = currentDir.children[oldName];
  delete currentDir.children[oldName];

  renderFileStructure();
  saveData();
}

// Function to delete an item
function deleteItem(name) {
  let currentDir = fileStructure.root;
  for (let dir of currentPath.slice(1)) {
    currentDir = currentDir.children[dir];
  }

  if (!currentDir.children[name]) {
    alert("The item you want to delete does not exist!");
    return;
  }

  delete currentDir.children[name];

  renderFileStructure();
  saveData();
}

// Function to save data to the server
function saveData() {
  fetch("http://localhost:3000/api/file-structure", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fileStructure),
  })
    .then((response) => response.json())
    .then((data) => console.log(data.message))
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to load data from the server
function loadData() {
  fetch("http://localhost:3000/api/file-structure")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        fileStructure = data;
        renderFileStructure();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Event listeners implementation
document.addEventListener("DOMContentLoaded", () => {
  loadData();

  // File action buttons here
  const fileCards = document.querySelectorAll(".filter-card");

  fileCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const action = card.querySelector("p").textContent.toLowerCase();

      switch (action) {
        case "file":
          const fileName = prompt("Enter file name:");
          if (fileName) createNewItem(fileName, "file");
          break;
        case "folder":
          const folderName = prompt("Enter folder name:");
          if (folderName) createNewItem(folderName, "directory");
          break;
        case "delete":
          const deleteName = prompt("Enter the name of the item to delete:");
          if (deleteName) deleteItem(deleteName);
          break;
        case "rename":
          const oldName = prompt("Enter the name of the item to rename:");
          const newName = prompt("Enter the new name:");
          if (oldName && newName) renameItem(oldName, newName);
          break;
      }
    });
  });

  // Search functionality added for better experince
  const searchInput = document.querySelector(".search input");
  const searchBtn = document.querySelector(".search-btn");

  searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const detailCards = document.querySelectorAll(".detail-card");

    detailCards.forEach((card) => {
      const itemName = card.querySelector("h4").textContent.toLowerCase();
      if (itemName.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  // Initial render here
  renderFileStructure();
});
