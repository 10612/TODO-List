function transferItem(from, to, item) {
  from.removeChild(item);
  to.appendChild(item);
  storeTasks();
}

function addTask(task) {
  if(task.value != "") {
    document.getElementById("todoList").appendChild(createNewNode(task.value));
    task.value = "";
    storeTasks();
  }
}

function change() {
  if(this.checked) {
    transferItem(document.getElementById("todoList"), document.getElementById("doneList"), this.parentElement.parentElement);
  }
  else {
    transferItem(document.getElementById("doneList"), document.getElementById("todoList"), this.parentElement.parentElement);
  }
}

function doneEdit(event) {
  const taskText = document.createElement("selection");
  if(event.key == "Enter") {
    taskText.innerText = this.value;
    this.parentElement.children[1].replaceWith(taskText);
  }
  else {
    if(event.key == "Escape") {
      taskText.innerText = this.dataset.oldValue;
      this.parentElement.children[1].replaceWith(taskText);
    }  
  }
}

function editor() {
  const edit = document.createElement("input"), taskText = this.parentElement.children[1].innerText;
  edit.type = "text";
  edit.value = taskText;
  edit.dataset.oldValue = taskText;
  edit.addEventListener("keydown", doneEdit);
  this.parentElement.children[1].replaceWith(edit);
}

function removeTask() {
  this.parentElement.parentElement.removeChild(this.parentElement);
  storeTasks();
}

function clearTasks() {
  document.getElementById("todoList").innerHTML = null;
  document.getElementById("doneList").innerHTML = null;
  storeTasks();
}

function clearDone() {
  document.getElementById("doneList").innerHTML = null;
  storeTasks();
}

function showButtons() {
  this.children[2].style.visibility = "visible";
  this.children[3].style.visibility = "visible";
  this.style.background = "#ff965095";
}

function hideButtons() {
  this.children[2].style.visibility = "hidden";
  this.children[3].style.visibility = "hidden";
  this.style.background = "none";
}

function createGap() {
  let gap = document.createElement("div");
  gap.style.width = "36.375vw";
  gap.style.height = "30px";
  gap.style.background = "#dddddd60"
  gap.addEventListener("dragleave", function()  { this.parentElement.removeChild(this) });
  gap.addEventListener("dragover", event => { event.preventDefault() });
  gap.addEventListener("drop", function(event) { this.parentElement.removeChild(document.getElementById("selected"));
                                                 this.parentElement.replaceChild(createNewNode(event.dataTransfer.getData("text")), this) });
  return gap;
}

function createNewNode(task, ch=false) {
  let li = document.createElement("li"), checkbox = document.createElement("input"),
      taskText = document.createElement("selection"), lab = document.createElement("label"),
      edit = document.createElement("button"), remove = document.createElement("button");
  checkbox.type = "checkbox";
  checkbox.style.verticalAlign = "-1px";
  checkbox.checked = ch;
  checkbox.addEventListener("change", change);
  taskText.innerText = task;
  edit.textContent = "edit";
  edit.style.visibility = "hidden";
  edit.classList.add("edit");
  edit.addEventListener("click", editor);
  remove.textContent = "remove";
  remove.style.visibility = "hidden";
  remove.classList.add("remove");
  remove.addEventListener("click", removeTask);
  li.draggable = true;
  li.addEventListener("mouseenter", showButtons);
  li.addEventListener("mouseleave", hideButtons);
  li.addEventListener("dragstart", event => { event.currentTarget.setAttribute("id", "selected")
                                              event.dataTransfer.dropEffect = "move";
                                              event.dataTransfer.setData("text/plain", event.currentTarget.children[1].innerText) })
  li.addEventListener("dragenter", function(event) { this.parentElement.insertBefore(createGap(), event.currentTarget.nextSibling) });
  lab.appendChild(checkbox);
  li.appendChild(lab);
  li.appendChild(taskText);
  li.appendChild(edit);
  li.appendChild(remove);
  return li
}

function storeTasks() {
  var todo = [], done = [];
  Array.from(document.getElementById("todoList").children).forEach(task => {
    if(task.children[1].tagName == "SELECTION") {
      todo.push(task.children[1].innerText);
    }
    else {
      todo.push(task.children[1].dataset.oldValue);
    }
  });
  Array.from(document.getElementById("doneList").children).forEach(task => {
    if(task.children[1].tagName == "SELECTION") {
      done.push(task.children[1].innerText);
    }
    else {
      done.push(task.children[1].dataset.oldValue);
    }
  });
  localStorage.setItem("todo", JSON.stringify(todo));
  localStorage.setItem("done", JSON.stringify(done));
}

function retrieveTasks() {
  Array.from(JSON.parse(localStorage.getItem("todo"))).forEach(task => {
    document.getElementById("todoList").appendChild(createNewNode(task));
  })
  Array.from(JSON.parse(localStorage.getItem("done"))).forEach(task => {
    document.getElementById("doneList").appendChild(createNewNode(task, true));
  })
}