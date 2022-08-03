let todoArray, id = 1;
retrieveTasks();

function addTask(objective) {
  if(!objective.check) {
    const insertAt = firstCheckedIndex();
    if(insertAt === -1) {
      todoArray.push(objective);
    }
    else {
      todoArray.splice(insertAt, 0, objective);
    }
    updateAdd(insertAt);
  }
  else {
    todoArray.push(objective);
    updateAdd(-1);
  }
}

function change(checkbox) {
  const todo = checkbox.parentElement.parentElement;
  removeTaskId(todo.dataset.id);
  addTask({ "task": todo.getElementsByTagName("P")[0].textContent, "check": checkbox.checked, "id": todo.dataset.id });
}
  

function removeTaskId(id) {
  const index = indexById(id);
  todoArray.splice(index, 1);
  updateRemove(index);
}

function removeTaskIn(index) {
  todoArray.splice(index, 1);
  updateRemove(index);
}

function editTask(taskContainer) {
  document.getElementById("add").disabled = true;
  const edit = document.createElement("input");
  edit.type = "text";
  edit.value = taskContainer.innerText;
  edit.dataset.oldValue = taskContainer.innerText;
  edit.addEventListener("keydown", doneEdit);
  edit.addEventListener("blur", blur);
  taskContainer.replaceWith(edit);
  edit.select();
}

function doneEdit(event) {
  const taskContainer = document.createElement("p");
  taskContainer.classList.add("task");
  if(event.key === "Enter") {
    todoArray[indexById(event.target.parentElement.dataset.id)].task = event.target.value;
    taskContainer.innerText = event.target.value;
    event.target.removeEventListener("blur", blur);
    event.target.replaceWith(taskContainer);
    document.getElementById("add").disabled = false;
    storeTasks();
  }
  else {
    if(event.key === "Escape") {
      taskContainer.innerText = event.target.dataset.oldValue;
      event.target.removeEventListener("blur", blur);
      event.target.replaceWith(taskContainer);
      document.getElementById("add").disabled = false;
      storeTasks();
    }
  }
}

function blur(event) {
    const taskContainer = document.createElement("p");
    taskContainer.innerText = event.target.dataset.oldValue;
    taskContainer.classList.add("task");
    event.target.replaceWith(taskContainer);
    document.getElementById("add").disabled = false;
    storeTasks();
}

function todoById(id) {
  return document.getElementById("listContainer").children[indexById(id)];
}

function indexById(id) {
  return todoArray.findIndex(objective => objective.id === parseInt(id));
}

function firstCheckedIndex() {
  return todoArray.findIndex(checkedObjective => checkedObjective.check);
}

function updateAdd(index) {
  const listContainer = document.getElementById("listContainer");
  if(index !== -1) {
    listContainer.insertBefore(createNewNode(todoArray[index]), listContainer.children[index]);
  }
  else {
    listContainer.appendChild(createNewNode(todoArray[todoArray.length - 1]));
  }
  storeTasks();
}

function updateRemove(index) {
  const listContainer = document.getElementById("listContainer");
  listContainer.removeChild(listContainer.children[index]);
  if(todoArray.length === 0) {
    id = 1;
  }
  storeTasks();
}

function clearTasks() {
  for(let i = todoArray.length - 1; i >= 0; i--) {
    removeTaskIn(i)
  }
}

function clearChecked() {
  const firstChecked = firstCheckedIndex();
  if(firstChecked >= 0) {
    for(let i = todoArray.length - 1; i >= firstChecked; i--) {
      removeTaskIn(i)
    }
  }
}

function buttonAdd() {
  const listContainer = document.getElementById("listContainer");
  let index = firstCheckedIndex();
  addTask({"task": "", "check": false, "id": id});
  if(index === -1) {
    index = todoArray.length;
  }
  index--;
  editTask(listContainer.children[index].getElementsByTagName("P")[0]);
  storeTasks();
  id++;
}

function mouseEnter(todo) {
  if(todo.getAttribute("id") !== "selected") {
    todo.setAttribute("id", "hover");
  }
}

function mouseLeave(todo) {
  todo.removeAttribute("id");
}

function addGap(event) {
  if(document.getElementById("gap") === null) {
    const gap = makeGap();
    todoArray.splice(indexById(event.currentTarget.dataset.id), 0, {"id": 0});
    document.getElementById("listContainer").insertBefore(gap, event.currentTarget);
  }
}

function addEndGap() {
  if(document.getElementById("gap") === null) {
    const gap = makeGap();
    todoArray.push({"id": 0});
    document.getElementById("listContainer").appendChild(gap);
  }
}

function makeGap() {
  const gap = document.createElement("div");
  gap.setAttribute("id", "gap");
  gap.addEventListener("dragleave", removeGap);
  gap.addEventListener("dragover", event => { event.preventDefault() });
  gap.addEventListener("drop", drop);
  return gap;
}

function removeGap(iDoNothing) {
  removeTaskId(0);
}

function drop() {
  // Drops the dragged element in the gap
  const gap = document.getElementById("gap"),
        move = document.getElementById("selected"),
        indexMove = indexById(move.dataset.id), indexGap = indexById(0),
        separationIndex = firstCheckedIndex() - 1,
        switchData = {gap, move, indexGap, indexMove};
  if(separationIndex >= 0) {
    if(todoArray[indexMove].check) {
      if(separationIndex <= indexGap) {
        dropInGap(switchData);
      }
      else {
        gap.remove();
        todoArray.splice(indexGap, 1);
      }
    }
    else {
      if(separationIndex >= indexGap) {
        dropInGap(switchData);
      }
      else {
        gap.remove();
        todoArray.splice(indexGap, 1);
      }
    }
  }
  else {
    dropInGap(switchData);
  }
  storeTasks();
}

function dropInGap(switchData) {
  switchData.gap.replaceWith(switchData.move);
  todoArray[switchData.indexGap] = todoArray[switchData.indexMove];
  todoArray.splice(switchData.indexMove, 1);
}

function createNewNode(objective) {
  let todo = document.createElement("div"), label = document.createElement("label"),
      checkbox = document.createElement("input"), task = document.createElement("p"),
      edit = document.createElement("button"), remove = document.createElement("button");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");
  checkbox.checked = objective.check;
  checkbox.addEventListener("change", event => { change(event.target) });
  label.classList.add("checkbox");
  label.appendChild(checkbox);
  task.innerText = objective.task;
  task.classList.add("task");
  edit.textContent = "edit";
  edit.classList.add("edit");
  edit.addEventListener("click", event => { editTask(event.target.previousSibling) });
  remove.textContent = "remove";
  remove.classList.add("remove");
  remove.addEventListener("click", event => { removeTaskId(event.target.parentElement.dataset.id) });
  todo.draggable = true;
  todo.dataset.id = objective.id;
  todo.classList.add("todo");
  todo.appendChild(label);
  todo.appendChild(task);
  todo.appendChild(edit);
  todo.appendChild(remove);
  todo.addEventListener("mouseenter", event => { mouseEnter(event.target) });
  todo.addEventListener("mouseleave", event => { mouseLeave(event.target) });
  todo.addEventListener("drag", event => { event.target.setAttribute("id", "selected") })
  todo.addEventListener("dragstart", event => { event.dataTransfer.dropEffect = "move" });
  todo.addEventListener("dragenter", addGap);
  return todo;
}

function storeTasks() {
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
}

function retrieveTasks() {
  todoArray = JSON.parse(localStorage.getItem("todoArray")) || [];
  const gapIndex = indexById(0);
  if(gapIndex !== -1) {
    todoArray.splice(gap, 1);
  }
  todoArray.forEach(objective => { objective.id = id;
                              id++; });
  renderTodoArray();
}

function renderTodoArray() {
  const listContainer = document.getElementById("listContainer");
  todoArray.forEach(objective => { listContainer.appendChild(createNewNode(objective)) });
}