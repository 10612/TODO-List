// function transferItem(from, to, item) {
//   from.removeChild(item);
//   to.appendChild(item);
//   storeTasks();
// }

// function addTask(task) {
//   if(task.value != "") {
//     document.getElementById("todoList").appendChild(createNewNode(task.value));
//     task.value = "";
//     storeTasks();
//   }
// }

// function change() {
//   if(this.checked) {
//     transferItem(document.getElementById("todoList"), document.getElementById("doneList"), this.parentElement.parentElement);
//   }
//   else {
//     transferItem(document.getElementById("doneList"), document.getElementById("todoList"), this.parentElement.parentElement);
//   }
// }

// function doneEdit(event) {
//   const taskText = document.createElement("selection");
//   if(event.key == "Enter") {
//     taskText.innerText = this.value;
//     this.parentElement.children[1].replaceWith(taskText);
//   }
//   else {
//     if(event.key == "Escape") {
//       taskText.innerText = this.dataset.oldValue;
//       this.parentElement.children[1].replaceWith(taskText);
//     }  
//   }
// }

// function editor() {
//   const edit = document.createElement("input"), taskText = this.parentElement.children[1].innerText;
//   edit.type = "text";
//   edit.value = taskText;
//   edit.dataset.oldValue = taskText;
//   edit.addEventListener("keydown", doneEdit);
//   this.parentElement.children[1].replaceWith(edit);
// }

// function removeTask() {
//   this.parentElement.parentElement.removeChild(this.parentElement);
//   storeTasks();
// }

// function clearTasks() {
//   document.getElementById("todoList").innerHTML = null;
//   document.getElementById("doneList").innerHTML = null;
//   storeTasks();
// }

// function clearDone() {
//   document.getElementById("doneList").innerHTML = null;
//   storeTasks();
// }

// function showButtons() {
//   this.children[2].style.visibility = "visible";
//   this.children[3].style.visibility = "visible";
//   this.style.background = "#ff965095";
// }

// function hideButtons() {
//   this.children[2].style.visibility = "hidden";
//   this.children[3].style.visibility = "hidden";
//   this.style.background = "none";
// }

// function createGap() {
//   let gap = document.createElement("div");
//   gap.style.width = "36.375vw";
//   gap.style.height = "30px";
//   gap.style.background = "#dddddd60"
//   gap.addEventListener("dragleave", function()  { this.parentElement.removeChild(this) });
//   gap.addEventListener("dragover", event => { event.preventDefault() });
//   gap.addEventListener("drop", function(event) { this.parentElement.removeChild(document.getElementById("selected"));
//                                                  this.parentElement.replaceChild(createNewNode(event.dataTransfer.getData("text")), this) });
//   return gap;
// }

// function createNewNode(task, ch=false) {
//   let li = document.createElement("li"), checkbox = document.createElement("input"),
//       taskText = document.createElement("selection"), lab = document.createElement("label"),
//       edit = document.createElement("button"), remove = document.createElement("button");
//   checkbox.type = "checkbox";
//   checkbox.style.verticalAlign = "-1px";
//   checkbox.checked = ch;
//   checkbox.addEventListener("change", change);
//   taskText.innerText = task;
//   edit.textContent = "edit";
//   edit.style.visibility = "hidden";
//   edit.classList.add("edit");
//   edit.addEventListener("click", editor);
//   remove.textContent = "remove";
//   remove.style.visibility = "hidden";
//   remove.classList.add("remove");
//   remove.addEventListener("click", removeTask);
//   li.draggable = true;
//   li.addEventListener("mouseenter", showButtons);
//   li.addEventListener("mouseleave", hideButtons);
//   li.addEventListener("dragstart", event => { event.currentTarget.setAttribute("id", "selected")
//                                               event.dataTransfer.dropEffect = "move";
//                                               event.dataTransfer.setData("text/plain", event.currentTarget.children[1].innerText) })
//   li.addEventListener("dragenter", function(event) { this.parentElement.insertBefore(createGap(), event.currentTarget.nextSibling) });
//   lab.appendChild(checkbox);
//   li.appendChild(lab);
//   li.appendChild(taskText);
//   li.appendChild(edit);
//   li.appendChild(remove);
//   return li
// }

// function storeTasks() {
//   var todo = [], done = [];
//   Array.from(document.getElementById("todoList").children).forEach(task => {
//     if(task.children[1].tagName == "SELECTION") {
//       todo.push(task.children[1].innerText);
//     }
//     else {
//       todo.push(task.children[1].dataset.oldValue);
//     }
//   });
//   Array.from(document.getElementById("doneList").children).forEach(task => {
//     if(task.children[1].tagName == "SELECTION") {
//       done.push(task.children[1].innerText);
//     }
//     else {
//       done.push(task.children[1].dataset.oldValue);
//     }
//   });
//   localStorage.setItem("todo", JSON.stringify(todo));
//   localStorage.setItem("done", JSON.stringify(done));
// }

// function retrieveTasks() {
//   Array.from(JSON.parse(localStorage.getItem("todo"))).forEach(task => {
//     document.getElementById("todoList").appendChild(createNewNode(task));
//   })
//   Array.from(JSON.parse(localStorage.getItem("done"))).forEach(task => {
//     document.getElementById("doneList").appendChild(createNewNode(task, true));
//   })
// }
//---------------------------------------------------------------------------------------------
let TODO;
retrieveTasks();

function addTask(objective) {
  if(objective["task"] != "") {
    if(!objective["check"]) {
      const insertAt = TODO.findIndex(checkedObjective => checkedObjective["check"]);
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
}

function change(checkbox) {
  const todo = checkbox.parentElement, task = getTask(todo);
    removeTaskT(todo);
    addTask({ "task": task, "check": checkbox.checked });
}
  

function removeTaskT(todo) {
  const task = getTask(todo), index = TODO.findIndex(objective => objective["task"] == task);
  TODO.splice(index, 1);
  updateAT(index, "remove");
}

function removeTaskI(index) {
  TODO.splice(index, 1);
  updateAT(index, "remove");
}

function editTask(taskContainer, index) {
  const edit = document.createElement("input");
  edit.type = "text";
  edit.value = taskContainer.innerText;
  edit.dataset.oldValue = taskContainer.innerText;
  edit.dataset.index = index;
  edit.addEventListener("keydown", doneEdit);
  edit.addEventListener("blur", blur);
  taskContainer.replaceWith(edit);
  edit.select();
}

function doneEdit(event, index) {
  const taskContainer = document.createElement("p");
  taskContainer.classList.add("task");
  if(event.key == "Enter") {
    if(notADuplicate(event.target.value)) {
      TODO[event.target.dataset.index]["task"] = event.target.value;
      taskContainer.innerText = event.target.value;
      event.target.removeEventListener("blur", blur);
      event.target.replaceWith(taskContainer);
      storeTasks();
    }
  }
  else {
    if(event.key == "Escape") {
      taskContainer.innerText = event.target.dataset.oldValue;
      event.target.removeEventListener("blur", blur);
      event.target.replaceWith(taskContainer);
      storeTasks();
    }
  }
}

function blur(event) {
  const taskContainer = document.createElement("p");
  taskContainer.innerText = event.target.dataset.oldValue;
  taskContainer.classList.add("task");
  event.target.replaceWith(taskContainer);
  storeTasks();
}

function notADuplicate(task) {
  return TODO.filter(objective => objective["task"] == task) <= 1;
}

function getTask(todo) {
  return todo.parentElement.getElementsByTagName("P")[0].innerText;
}

function setTask(todo, task) {
  todo.parentElement.getElementsByTagName("P")[0].innerText = task;
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
      break;
    case "edit":
      editTask(TODOList.children[index].getElementsByTagName("P")[0], index);
      break;
  }
  storeTasks();
}

function clearTasks() {
  for(let i = TODO.length - 1; i >= 0; i--) {
    removeTaskI(i)
  }
}

function clearChecked() {
  const firstChecked = TODO.findIndex(checkedObjective => checkedObjective["check"]);
  for(let i = TODO.length - 1; i >= firstChecked; i--) {
    removeTaskI(i)
  }
}

function enterAdd(event) {
  if(event.key == "Enter") {
    addTask({ "task": event.target.value, "check": false });
    event.target.value = "";
  }
}

function buttonAdd() {
  addTask({"task": "Enter Task", "check": false});
  let index = TODO.findIndex(objective => objective["check"]);
  if(index == -1) {
    index = TODO.length;
  }
  index--;
  updateAT(index, "edit");
}

function mouseEnter(todo) {
  todo.setAttribute("id", "hover");
}

function mouseLeave(todo) {
  todo.removeAttribute("id");
}

function addGap(event) {
  const gap = document.createElement("div"), index = TODO.findIndex(event.target);
  gap.setAttribute("id", "gap");
  gap.addEventListener("dragleave", event => { removeTaskI(TODO.findIndex(objective => objective === "gap")) });
  gap.addEventListener("dragover", event => { event.preventDefault() });
  gap.addEventListener("drop", function() {});

}

function createNewNode(objective) {
  let todo = document.createElement("div"), label = document.createElement("label"),
      checkbox = document.createElement("input"), task = document.createElement("p"),
      edit = document.createElement("button"), remove = document.createElement("button");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");
  checkbox.checked = objective["check"];
  checkbox.addEventListener("change", event => { change(event.target) });
  label.appendChild(checkbox);
  task.innerText = objective["task"];
  task.classList.add("task");
  edit.textContent = "edit";
  edit.classList.add("edit");
  edit.addEventListener("click", event => { editTask(event.target.previousSibling) });
  remove.textContent = "remove";
  remove.classList.add("remove");
  remove.addEventListener("click", event => { removeTaskT(event.target) });
  todo.draggable = true;
  todo.classList.add("todo");
  todo.appendChild(label);
  todo.appendChild(task);
  todo.appendChild(edit);
  todo.appendChild(remove);
  todo.addEventListener("mouseenter", event => { mouseEnter(event.target) });
  todo.addEventListener("mouseleave", event => { mouseLeave(event.target) });
  todo.addEventListener("dragstart", event => { event.currentTarget.setAttribute("id", "selected");
                                                event.dataTransfer.dropEffect = "move" });
  todo.addEventListener("dragenter", addGap);
  return todo;
}

function storeTasks() {
  localStorage.setItem("TODO", JSON.stringify(TODO));
}

function retrieveTasks() {
  TODO = JSON.parse(localStorage.getItem("TODO")) || [];
  renderTODO();
}

function renderTODO() {
  const TODOList = document.getElementById("TODOList");
  TODO.forEach(objective => { TODOList.appendChild(createNewNode(objective)) });
}