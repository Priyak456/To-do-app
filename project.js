// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', document.getElementById('taskList').innerHTML);
}

// Function to load tasks from local storage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        document.getElementById('taskList').innerHTML = savedTasks;
        // Re-attach functionality to all tasks after loading
        attachEventListeners();
    }
}

// Function to attach all event listeners to new and loaded tasks
function attachEventListeners() {
    // Re-attach delete button functionality
    document.querySelectorAll('#taskList li .delete-btn').forEach(button => {
        button.onclick = function() {
            this.parentElement.remove();
            saveTasks();
        };
    });

    // Re-attach edit button functionality
    document.querySelectorAll('#taskList li .edit-btn').forEach(button => {
        button.onclick = function() {
            toggleEditMode(this.parentElement);
        };
    });

    // Re-attach click event to each list item for toggling 'completed' class
    document.querySelectorAll('#taskList li').forEach(listItem => {
        listItem.onclick = function(event) {
            // Prevent the click event from firing if the delete or edit buttons are clicked
            if (event.target.classList.contains('delete-btn') || event.target.classList.contains('edit-btn')) {
                return;
            }
            this.classList.toggle('completed');
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            saveTasks();
        };
    });
}

// Function to add a new task
function addTask() {
    const inputTask = document.getElementById('inputTask');
    if (inputTask.value === "") {
        alert("You must write something!");
        return;
    }

    const taskList = document.getElementById('taskList');
    const newTask = document.createElement('li');
    
    // Create the checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    
    // Create the task text span
    const taskText = document.createElement('span');
    taskText.textContent = inputTask.value;
    
    newTask.appendChild(checkbox);
    newTask.appendChild(taskText);
    
    newTask.onclick = function(event) {
        if (event.target.classList.contains('delete-btn') || event.target.classList.contains('edit-btn')) {
            return;
        }
        this.classList.toggle('completed');
        const checkbox = this.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
        }
        saveTasks();
    };

    taskList.appendChild(newTask);
    inputTask.value = "";
    
    addEditButton(newTask);
    deleteTask(newTask);
    saveTasks();
}

// New function to add the edit button to a task
function addEditButton(newTask) {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    newTask.appendChild(editBtn);
    editBtn.onclick = function() {
        toggleEditMode(newTask);
    };
}

// New function to toggle between edit and display mode for a task
function toggleEditMode(taskItem) {
    const taskText = taskItem.querySelector('span');
    const editBtn = taskItem.querySelector('.edit-btn');
    
    if (editBtn.textContent === 'Edit') {
        // Switch to edit mode
        editBtn.textContent = 'Save';
        
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = taskText.textContent;
        editInput.className = 'edit-input';
        
        taskItem.insertBefore(editInput, taskText);
        taskItem.classList.add('editing'); // Add a class for styling purposes
        taskText.style.display = 'none';
        editInput.focus();
    } else {
        // Switch back to display mode
        editBtn.textContent = 'Edit';
        const editInput = taskItem.querySelector('.edit-input');
        
        taskText.textContent = editInput.value;
        taskText.style.display = 'inline-block';

        editInput.remove();
        taskItem.classList.remove('editing');
        saveTasks();
    }
}

// Function to add the delete button to a task
function deleteTask(newTask) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn"; // Add a class for easier selection
    newTask.appendChild(deleteBtn);
    deleteBtn.onclick = function() {
        newTask.remove();
        saveTasks();
    };
}

// Function to clear all completed tasks
function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('#taskList li.completed');
    completedTasks.forEach(task => {
        task.remove();
    });
    saveTasks(); // Save the updated list after clearing
}

// Call loadTasks when the page first loads
window.onload = loadTasks;