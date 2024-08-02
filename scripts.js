// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const treeView = document.getElementById('treeView');
    const fileView = document.getElementById('fileView');
    const createFileBtn = document.getElementById('createFile');
    const createDirBtn = document.getElementById('createDir');
    const renameBtn = document.getElementById('rename');
    const deleteBtn = document.getElementById('delete');
    
    let selectedNode = null;
  
    // Sample data structure for the file tree
    const fileSystem = {
      'root': {
        'file1.txt': null,
        'folder1': {
          'file2.txt': null,
          'subfolder1': {}
        }
      }
    };
  
    // Render file tree recursively
    function renderTree(node, parentElement) {
      const ul = document.createElement('ul');
      for (const key in node) {
        const li = document.createElement('li');
        li.textContent = key;
        li.addEventListener('click', (event) => {
          event.stopPropagation();
          selectedNode = key;
          updateFileView(node[key]);
        });
        ul.appendChild(li);
  
        if (typeof node[key] === 'object') {
          renderTree(node[key], li);
        }
      }
      parentElement.appendChild(ul);
    }
  
    function updateFileView(node) {
      fileView.innerHTML = '';
      if (typeof node === 'object') {
        for (const key in node) {
          const div = document.createElement('div');
          div.textContent = key;
          fileView.appendChild(div);
        }
      } else {
        fileView.textContent = 'No files or directories.';
      }
    }
  
    // Initial rendering
    renderTree(fileSystem, treeView);
  
    // Create new file or directory
    function createNode(type) {
      if (selectedNode) {
        const name = prompt(`Enter ${type} name:`);
        if (name) {
          const parts = selectedNode.split('/');
          let current = fileSystem;
          for (const part of parts) {
            if (!current[part]) return;
            current = current[part];
          }
          if (type === 'file') {
            current[name] = null;
          } else {
            current[name] = {};
          }
          treeView.innerHTML = '';
          renderTree(fileSystem, treeView);
        }
      } else {
        alert('Please select a directory to add the new item.');
      }
    }
  
    createFileBtn.addEventListener('click', () => createNode('file'));
    createDirBtn.addEventListener('click', () => createNode('directory'));
  
    // Rename file or directory
    renameBtn.addEventListener('click', () => {
      if (selectedNode) {
        const newName = prompt('Enter new name:');
        if (newName) {
          const parts = selectedNode.split('/');
          const oldName = parts.pop();
          let current = fileSystem;
          for (const part of parts) {
            if (!current[part]) return;
            current = current[part];
          }
          current[newName] = current[oldName];
          delete current[oldName];
          treeView.innerHTML = '';
          renderTree(fileSystem, treeView);
        }
      } else {
        alert('Please select a file or directory to rename.');
      }
    });
  
    // Delete file or directory
    deleteBtn.addEventListener('click', () => {
      if (selectedNode) {
        const parts = selectedNode.split('/');
        const name = parts.pop();
        let current = fileSystem;
        for (const part of parts) {
          if (!current[part]) return;
          current = current[part];
        }
        delete current[name];
        treeView.innerHTML = '';
        renderTree(fileSystem, treeView);
        fileView.innerHTML = 'No files or directories.';
      } else {
        alert('Please select a file or directory to delete.');
      }
    });
  });
  