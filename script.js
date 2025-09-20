const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasks");
const filters = document.querySelectorAll(".filters button");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const taskIndexInput = document.getElementById("taskIndex");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks(filter = "all") {
  tasksContainer.innerHTML = "";
  let filteredTasks = tasks;

  if (filter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (filteredTasks.length === 0) {
    tasksContainer.innerHTML = "<p>No tasks found.</p>";
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <div>
        <strong>${task.title}</strong> - <em>${task.subject}</em><br>
        <small>Due: ${task.dueDate} | Priority: ${task.priority}</small>
        <p>${task.description}</p>
      </div>
      <div class="actions">
        <button class="edit" onclick="editTask(${index})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="complete" onclick="toggleTask(${index})">
          <i class="fas fa-${task.completed ? "undo" : "check-circle"}"></i>
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button class="delete" onclick="deleteTask(${index})">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;

    tasksContainer.appendChild(li);
  });

  updateProgress();
}

function addOrUpdateTask(e) {
  e.preventDefault();
  const index = taskIndexInput.value;

  const taskData = {
    title: document.getElementById("title").value,
    subject: document.getElementById("subject").value,
    dueDate: document.getElementById("dueDate").value,
    priority: document.getElementById("priority").value,
    description: document.getElementById("description").value,
    completed: false
  };

  if (index === "") {
    // New task
    tasks.push(taskData);
  } else {
    // Update task
    tasks[index] = { ...tasks[index], ...taskData };
    taskIndexInput.value = "";
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskForm.reset();
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById("title").value = task.title;
  document.getElementById("subject").value = task.subject;
  document.getElementById("dueDate").value = task.dueDate;
  document.getElementById("priority").value = task.priority;
  document.getElementById("description").value = task.description;
  taskIndexInput.value = index;
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% Completed`;
}

taskForm.addEventListener("submit", addOrUpdateTask);

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

renderTasks();
