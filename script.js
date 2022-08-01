let TODO, id = 1;
retrieveTasks();

function addTask(objective) {
  if(!objective.check) {
    const insertAt = firstCheckedIndex();
    if(insertAt === -1) {
      TODO.push(objective);
    }
    else {
      TODO.splice(insertAt, 0, objective);
    }
    updateAT(insertAt, "add");
  }
  else {
    TODO.push(objective);
    updateAT(-1, "add");
  }
}

function change(checkbox) {
  const todo = checkbox.parentElement.parentElement;
  removeTaskId(todo.dataset.id);
  addTask({ "task": todo.getElementsByTagName("P")[0].textContent, "check": checkbox.checked, "id": todo.dataset.id });
}
  

function removeTaskId(id) {
  const index = indexById(id);
  TODO.splice(index, 1);
  updateAT(index, "remove");
}

function removeTaskIn(index) {
  TODO.splice(index, 1);
  updateAT(index, "remove");
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
  if(event.key == "Enter") {
    TODO[indexById(event.target.parentElement.dataset.id)].task = event.target.value;
    taskContainer.innerText = event.target.value;
    event.target.removeEventListener("blur", blur);
    event.target.replaceWith(taskContainer);
    document.getElementById("add").disabled = false;
    storeTasks();
  }
  else {
    if(event.key == "Escape") {
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
  return document.getElementById("TODOList").children[indexById(id)];
}

function indexById(id) {
  return TODO.findIndex(objective => objective.id == id);
}

function firstCheckedIndex() {
  return TODO.findIndex(checkedObjective => checkedObjective.check);
}

function updateAT(index, updateType) {
  const TODOList = document.getElementById("TODOList");
  switch(updateType) {
    case "add":
      if(index !== -1) {
        TODOList.insertBefore(createNewNode(TODO[index]), TODOList.children[index]);
      }
      else {
        TODOList.appendChild(createNewNode(TODO[TODO.length - 1]));
      }
      break;
    case "remove":
        TODOList.removeChild(TODOList.children[index]);
        if(TODO.length == 0) {
          id = 1;
        }
      break;
    case "edit":
      editTask(TODOList.children[index].getElementsByTagName("P")[0]);
      break;
  }
  storeTasks();
}

function clearTasks() {
  for(let i = TODO.length - 1; i >= 0; i--) {
    removeTaskIn(i)
  }
}

function clearChecked() {
  const firstChecked = firstCheckedIndex();
  if(firstChecked >= 0) {
    for(let i = TODO.length - 1; i >= firstChecked; i--) {
      removeTaskIn(i)
    }
  }
}

function buttonAdd() {
  addTask({"task": "", "check": false, "id": id});
  let index = firstCheckedIndex();
  if(index == -1) {
    index = TODO.length;
  }
  index--;
  updateAT(index, "edit");
  id++;
}

function mouseEnter(todo) {
  if(todo.getAttribute("id") != "selected") {
    todo.setAttribute("id", "hover");
  }
}

function mouseLeave(todo) {
  todo.removeAttribute("id");
}

function addGap(event) {
  if(document.getElementById("gap") === null) {
    const gap = document.createElement("div");
    gap.setAttribute("id", "gap");
    gap.addEventListener("dragleave", () => { removeTaskId(0) });
    gap.addEventListener("dragover", event => { event.preventDefault() });
    gap.addEventListener("drop", drop);
    TODO.splice(indexById(event.currentTarget.dataset.id), 0, {"id": 0});
    document.getElementById("TODOList").insertBefore(gap, event.currentTarget);
  }
}

function addEndGap() {
  if(document.getElementById("gap") === null) {
    const gap = document.createElement("div");
    gap.setAttribute("id", "gap");
    gap.addEventListener("dragleave", () => { removeTaskId(0) });
    gap.addEventListener("dragover", event => { event.preventDefault() });
    gap.addEventListener("drop", drop);
    TODO.push({"id": 0});
    document.getElementById("TODOList").appendChild(gap);
  }
}

function drop() {
  const gap = document.getElementById("gap"), move = document.getElementById("selected"),
        indexMove = indexById(move.dataset.id), indexGap = indexById(0),
        separationIndex = firstCheckedIndex() - 1,
        switchData = {gap, move, indexGap, indexMove};
  if(separationIndex >= 0) {
    if(TODO[indexMove].check) {
      if(separationIndex <= indexGap) {
        dropInGap(switchData);
      }
      else {
        gap.remove();
        TODO.splice(indexGap, 1);
      }
    }
    else {
      if(separationIndex >= indexGap) {
        dropInGap(switchData);
      }
      else {
        gap.remove();
        TODO.splice(indexGap, 1);
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
  TODO[switchData.indexGap] = TODO[switchData.indexMove];
  TODO.splice(switchData.indexMove, 1);
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
  localStorage.setItem("TODO", JSON.stringify(TODO));
}

function retrieveTasks() {
  TODO = JSON.parse(localStorage.getItem("TODO")) || [];
  TODO.forEach(objective => { objective.id = id;
                              id++; })
  renderTODO();
}

function renderTODO() {
  const TODOList = document.getElementById("TODOList");
  TODO.forEach(objective => { TODOList.appendChild(createNewNode(objective)) });
}