const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");

let editId;
let isEditedTask = false;
// getting data from localStorage
let todos = JSON.parse(localStorage.getItem("todo-list")) || [];

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      // if todo status is completed SET the isCompleted value b checked
      let isCompleted = todo.status === "completed" ? "checked" : "";
      if (filter === todo.status || filter === "all")
        li += `
          <li class="task">
            <label for="${id}">
                <input onclick="updatedStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                <p class="${isCompleted}">${todo.name}</p>
            </label>
            <div class="settings">
                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                <ul class="task-menu">
                    <li onclick="updateTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                    <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                </ul>
            </div>
          </li>
        `;
    });
  }
  // lw el li fady, INSERT this value inside taskbox else INSERT span
  taskBox.innerHTML = li || `<span>You don't have any task here</span>`;

  if (todos.length > 0) clearAll.classList.add("active");
  else clearAll.classList.remove("active");
}
showTodo("all");

function showMenu(selectedTask) {
  // GETTING task menu div
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    // REMOVING show class from the task menu on the document click
    if (e.target.tagName != "I" || e.target != selectedTask)
      taskMenu.classList.remove("show");
  });
}

function updateTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
  taskInput.focus();
}

function deleteTask(taskId) {
  // REMOVING selected task from todos[]
  todos.splice(taskId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}

clearAll.addEventListener("click", () => {
  // REMOVING all items from todos[]
  todos = [];
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
});

function updatedStatus(selectedTask) {
  // GETTING paragragh that contains task name
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    // UPDATING the status of selected task to completed
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    // if isEditedTask isn't true
    if (!isEditedTask) {
      if (!todos) todos = []; // if todos isn't exist, pass an empty array to todos

      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo); // ADDING new task to todos
    } else {
      todos[editId].name = userTask;
      isEditedTask = false;
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
    taskInput.value = "";
    showTodo("all");
  }
});
