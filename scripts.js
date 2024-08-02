// File structure data
let fileStructure = {
    root: {
      type: 'directory',
      children: {
        'Cprograming': { type: 'directory', children: {} },
        'Java': { type: 'directory', children: {} },
        'MySql': { type: 'directory', children: {} },
        'Images': { type: 'directory', children: {} },
        'Sandwich': { type: 'directory', children: {} },
        'Drinks': { type: 'directory', children: {} }
      }
    }
  };
  
  let currentPath = ['root'];
  
  // Function to render the file structure
  function renderFileStructure() {
    const detailWrapper = document.querySelector('.detail-wrapper');
    detailWrapper.innerHTML = '';
  
    let currentDir = fileStructure.root;
    for (let dir of currentPath.slice(1)) {
      currentDir = currentDir.children[dir];
    }
  
    for (let item in currentDir.children) {
      const itemData = currentDir.children[item];
      const itemElement = document.createElement('div');
      itemElement.className = 'detail-card';
      itemElement.innerHTML = `
        <img class="detail-img" alt="${itemData.type}" src="images/folder.jpg" />
        <div class="detail-desc">
          <div class="detail-name">
            <h4>${item}</h4>
            <p class="detail-sub">${itemData.type}</p>
            <p class="price">${item} ${itemData.type}</p>
          </div>
          <ion-icon class="detail-favourites" name="bookmark-outline"></ion-icon>
        </div>
      `;
      detailWrapper.appendChild(itemElement);
    }
  }
  
  // Function to create a new item (file or directory)
  function createNewItem(name, type) {
    let currentDir = fileStructure.root;
    for (let dir of currentPath.slice(1)) {
      currentDir = currentDir.children[dir];
    }
    
    if (currentDir.children[name]) {
      alert('An item with this name already exists!');
      return;
    }
  
    currentDir.children[name] = {
      type: type,
      children: type === 'directory' ? {} : null
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
  
    if (currentDir.children[newName]) {
      alert('An item with this name already exists!');
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
  
    delete currentDir.children[name];
  
    renderFileStructure();
    saveData();
  }
  
  // Function to save data to localStorage
  function saveData() {
    localStorage.setItem('fileStructure', JSON.stringify(fileStructure));
  }
  
  // Function to load data from localStorage
  function loadData() {
    const savedData = localStorage.getItem('fileStructure');
    if (savedData) {
      fileStructure = JSON.parse(savedData);
    }
  }
  
  // Event listeners
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
  
    // New Folder button
    document.querySelector('.sidebar-menus a:first-child').addEventListener('click', (e) => {
      e.preventDefault();
      const name = prompt('Enter folder name:');
      if (name) createNewItem(name, 'directory');
    });
  
    // Edit button (Rename functionality)
    document.querySelector('.sidebar-menus a:nth-child(2)').addEventListener('click', (e) => {
      e.preventDefault();
      const oldName = prompt('Enter the name of the item to rename:');
      const newName = prompt('Enter the new name:');
      if (oldName && newName) renameItem(oldName, newName);
    });
  
    // Delete button
    document.querySelector('.sidebar-menus a:nth-child(4)').addEventListener('click', (e) => {
      e.preventDefault();
      const name = prompt('Enter the name of the item to delete:');
      if (name) deleteItem(name);
    });
  
    // Search functionality
    const searchInput = document.querySelector('.search input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const detailCards = document.querySelectorAll('.detail-card');
      
      detailCards.forEach(card => {
        const itemName = card.querySelector('h4').textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  
    // Initial render
    renderFileStructure();
  });