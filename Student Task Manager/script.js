
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("campusTasks")) || [];

let currentFilter = "all";

// Save tasks in browser
function saveTasks() {
    localStorage.setItem("campusTasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const text = document.createElement("span");
        text.textContent = task.title + " (" + task.category + ")";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            displayTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateStats();
}

// Add task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        category: category.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
});

// Update dashboard statistics
function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    document.getElementById("total").textContent = total;

    document.getElementById("completed").textContent = completed;

    document.getElementById("pending").textContent = pending;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressFill").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "% Completed";
}

// Task filters
document.querySelectorAll(".filters button").forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        displayTasks();
    });

});

// Dark Mode
document.getElementById("themeBtn").addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const darkMode = document.body.classList.contains("dark");

    document.getElementById("themeBtn").textContent =
        darkMode ? "☀ Light Mode" : "🌙 Dark Mode";

});

// Initial display
displayTasks();
