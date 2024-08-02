// File structure data
let fileStructure = {
    root: {
      type: 'directory',
      children: {}
    }
  };
  
  // Current directory path
  let currentPath = ['root'];
  
  // Function to render the file structure
  function renderFileStructure() {
    const fileList = document.querySelector('.detail-wrapper');
    fileList.innerHTML = '';
  
    let currentDir = fileStructure;
    for (let dir of currentPath) {
      currentDir = currentDir[dir].children;
    }
  
    for (let item in currentDir) {
      const itemData = currentDir[item];
      const itemElement = document.createElement('div');
      itemElement.className = 'detail-card';
      itemElement.innerHTML = `
        <img class="detail-img" alt="${itemData.type}" src="images/${itemData.type}.jpg" />
        <div class="detail-desc">
          <div class="detail-name">
            <h4>${item}</h4>
            <p class="detail-sub">${itemData.type}</p>
          </div>
          <ion-icon class="detail-favourites" name="bookmark-outline"></ion-icon>
        </div>
      `;
      fileList.appendChild(itemElement);
    }
  }
  
  // Function to render the tree structure
  function renderTreeStructure() {
    const treeContainer = document.querySelector('.sidebar-menus');
    treeContainer.innerHTML = ''; // Clear existing content
  
    function renderTree(structure, parent) {
      for (let item in structure) {
        const itemElement = document.createElement('a');
        itemElement.href = '#';
        itemElement.innerHTML = `<ion-icon name="${structure[item].type === 'directory' ? 'folder-outline' : 'document-outline'}"></ion-icon>${item}`;
        
        if (structure[item].type === 'directory') {
          itemElement.addEventListener('click', (e) => {
            e.preventDefault();
            currentPath = [...parent, item];
            renderFileStructure();
            renderTreeStructure();
          });
        }
        
        treeContainer.appendChild(itemElement);
  
        if (structure[item].type === 'directory') {
          renderTree(structure[item].children, [...parent, item]);
        }
      }
    }
  
    renderTree(fileStructure.root.children, ['root']);
  
    // Add buttons for creating new items
    const newFolderBtn = document.createElement('a');
    newFolderBtn.href = '#';
    newFolderBtn.innerHTML = '<ion-icon name="folder-outline"></ion-icon>New Folder';
    newFolderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = prompt('Enter folder name:');
      if (name) createNewItem(name, 'directory');
    });
    treeContainer.appendChild(newFolderBtn);
  
    const newFileBtn = document.createElement('a');
    newFileBtn.href = '#';
    newFileBtn.innerHTML = '<ion-icon name="document-outline"></ion-icon>New File';
    newFileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = prompt('Enter file name:');
      if (name) createNewItem(name, 'file');
    });
    treeContainer.appendChild(newFileBtn);
  }
  
  // Function to create a new item (file or directory)
  function createNewItem(name, type) {
    let currentDir = fileStructure;
    for (let dir of currentPath) {
      currentDir = currentDir[dir].children;
    }
    
    if (currentDir[name]) {
      alert('An item with this name already exists!');
      return;
    }
  
    currentDir[name] = {
      type: type,
      children: type === 'directory' ? {} : null
    };
  
    saveData();
    renderFileStructure();
    renderTreeStructure();
  }
  
  // Function to rename an item
  function renameItem(oldName, newName) {
    let currentDir = fileStructure;
    for (let dir of currentPath) {
      currentDir = currentDir[dir].children;
    }
  
    if (currentDir[newName]) {
      alert('An item with this name already exists!');
      return;
    }
  
    currentDir[newName] = currentDir[oldName];
    delete currentDir[oldName];
  
    saveData();
    renderFileStructure();
    renderTreeStructure();
  }
  
  // Function to delete an item
  function deleteItem(name) {
    let currentDir = fileStructure;
    for (let dir of currentPath) {
      currentDir = currentDir[dir].children;
    }
  
    delete currentDir[name];
  
    saveData();
    renderFileStructure();
    renderTreeStructure();
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
  
    // New File button
    document.querySelector('#new-file-btn').addEventListener('click', (e) => {
      e.preventDefault();
      const name = prompt('Enter file name:');
      if (name) createNewItem(name, 'file');
    });
  
    // Rename button
    document.querySelector('#rename-btn').addEventListener('click', (e) => {
      e.preventDefault();
      const oldName = prompt('Enter the name of the item to rename:');
      const newName = prompt('Enter the new name:');
      if (oldName && newName) renameItem(oldName, newName);
    });
  
    // Delete button
    document.querySelector('#delete-btn').addEventListener('click', (e) => {
      e.preventDefault();
      const name = prompt('Enter the name of the item to delete:');
      if (name) deleteItem(name);
    });
  
    // Initial render
    renderFileStructure();
    renderTreeStructure();
  });