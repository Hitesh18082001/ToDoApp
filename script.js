
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const dateElement = document.getElementById('date');
const pendingTasksElement = document.getElementById('pendingTasks');
const dueDateInput = document.getElementById("dueDateInput");
dueDateInput.min = new Date().toISOString().split("T")[0];
const filterButton = document.getElementById('filterButton');
const removeFilterButton = document.getElementById('removeFilterButton');

///function for updating local storage///////////////////////////////////////////////////////////
function updateLocalStorage() {
  localStorage.removeItem('todoList');
  console.log(tasks);
  var data = JSON.stringify(tasks);
  localStorage.setItem("todoList", data);
  updateTaskList();
};



//Section To Generate Unique IDs For Every Task//////////////////////////////////////////////////
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function generateUniqueID() {
  const randomString = generateRandomString(8);
  const timestamp = Date.now().toString(36);
  return randomString + timestamp;
}

/////////////////////////////////////////////////////////////////////////////////////////



var tasks = [];
var hasFetchedData = false;
var tags = [];
var selectedTags = [];





//Section to fetch tasks from API's if there is no data in localstorage or data being fetched first time

function fetchData() {

  fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(data => {
      data.forEach(task => {
        todosCount += 1;
        var UniqueId = generateUniqueID();
        let newTodo = {
          name: task['title'],
          id: UniqueId,
          isComplete: false,
          Category: "All",
          Priority: "",
          DueDate: "",
          Tags: [],
          SubTasks: [],
          ReminderTime: 0,
        };
        tasks.push(newTodo);
      })
      updateTaskList();
      updateLocalStorage();

    })
    .catch(error => {
      console.log('Error:', error);
    });
  hasFetchedData = true;
  updateLocalStorage();

}
///fetching Tasks from localstorage
function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  if (parsedTodoList === null) {

    return [];
  } else {

    return parsedTodoList;
  }
}

tasks = getTodoListFromLocalStorage();
let todosCount = tasks.length;
if (!tasks.length && !hasFetchedData) {
  fetchData();
}

//Section to rerender dropdown after performing a action//////////////////////////
function renderCategoryDropdown() {
  const categoryDropdown = document.getElementById("categoryDropdown");
  categoryDropdown.value = "";


}
function renderPriorityDropdown() {
  const categoryDropdown = document.getElementById("priorityDropdown");
  categoryDropdown.value = "";

}
function renderFilterCategoryDropdown() {
  const categoryDropdown = document.getElementById("filterCategoryDropdown");
  categoryDropdown.value = "";

}
function renderFilterPriorityDropdown() {
  const categoryDropdown = document.getElementById("filterPriorityDropdown");
  categoryDropdown.value = "";

}
////////////////////////////////////////////////////////////////////////////////////////////////////

//Section for adding filters functionality ////////////////////////////////////////////////////
function addFilters() {

  const filterDate = document.getElementById("filterDueDateInput");
  var dueDate = filterDate.value;

  // console.log(dueDate);

  const filterCategory = document.getElementById("filterCategoryDropdown");
  const category = filterCategory.value;

  const filterPriority = document.getElementById("filterPriorityDropdown");
  const priority = filterPriority.value;

  var filteredTask = [];
  tasks.forEach(task => {

    if (task.Category === category || category === "" || category === "All") {
      filteredTask.push(task);

    }
  })
  var flag = filteredTask;
  console.log(flag);
  filteredTask = [];
  flag.forEach(task => {
    if (task.Priority === priority || priority === "") {
      filteredTask.push(task);
    }

  })
  console.log(filteredTask);

  flag = filteredTask;
  filteredTask = [];
  flag.forEach(task => {
    if (task.DueDate === "") {
      // filteredTask.push(task);
    }
    else if (dueDate === "") {
      filteredTask.push(task);
    }
    else {
      const date1 = new Date(task.DueDate);
      const date2 = new Date(dueDate);
      if (date1 <= date2) {
        filteredTask.push(task);
      }
    }
  })
  console.log(filteredTask);
  updateTaskList(filteredTask);
  renderFilterCategoryDropdown();
  renderFilterPriorityDropdown();
  filterDate.value = "";

}
function removeFilters() {
  updateTaskList();

}


filterButton.addEventListener("click", () => addFilters());
removeFilterButton.addEventListener("click", () => removeFilters());

//////////////////////////////////////////////////////////////////////////////////////////////////////////////



///Section to add sorting functionality////////////////////////////////////////////////////////////////////////
function compareDueDate(task1, task2) {
  // empty due dates treated as maximum date 
  const date1 = task1.DueDate ? new Date(task1.DueDate) : new Date("9999-12-31");
  const date2 = task2.DueDate ? new Date(task2.DueDate) : new Date("9999-12-31");
  console.log(date1 - date2);

  return date1 - date2;
}
function prioritySort() {
  var sortTasks = [];
  tasks.forEach(task => {
    if (task.Priority === 'High') {
      sortTasks.push(task);
    }
  })
  tasks.forEach(task => {
    if (task.Priority === 'Medium') {
      sortTasks.push(task);
    }
  })
  tasks.forEach(task => {
    if (task.Priority === 'Low') {
      sortTasks.push(task);
    }
  })
  return sortTasks;

}


function handleSortChange() {
  const sortOption = document.getElementById("sortOption").value;
  if (sortOption === "duedate") {
    let sortedTasks = [...tasks];
    sortedTasks.sort(compareDueDate);
    updateTaskList(sortedTasks);
  } else if (sortOption === "priority") {
    var sortedTasks = prioritySort();
    updateTaskList(sortedTasks);
  }
  else {
    updateTaskList(tasks);
  }


}
///////////////////////////////////////////////////////////////////////////////////////////////////////



//section for handling View logs functionality
function handleLogChange() {
  const logOption = document.getElementById("logOption").value;
  var logTasks = [];
  if (logOption === "missed") {
    tasks.forEach(task => {

      if (task.DueDate !== '') {
        const today = new Date();
        const date1 = new Date(task.DueDate);
        if (today - date1 >= 0) {
          logTasks.push(task);
        }
      }
      else {

      }
    })


  }
  else if (logOption === "completed") {
    tasks.forEach(task => {
      if (task.isComplete) {
        logTasks.push(task);
      }
    })

  }
  else if (logOption === "pending") {
    tasks.forEach(task => {
      if (!task.isComplete) {
        logTasks.push(task);
      }
    })

  }
  else {
    logTasks = tasks;
  }
  updateTaskList(logTasks);

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////







// Section to render the dropdown menu with tags

function renderTagDropdown() {
  const tagDropdown = document.getElementById("tagDropdown");
  tagDropdown.innerHTML = ""; // Clear existing options

  tags.forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagDropdown.appendChild(option);
  });
}

// Function to display selected tags below the dropdown menu
function displaySelectedTags(selectedTags) {
  const selectedTagsContainer = document.getElementById("selectedTagsContainer");
  selectedTagsContainer.innerHTML = "";
  selectedTags.forEach(tag => {

    const tagItem = document.createElement("span");
    tagItem.textContent = tag;

// Adding a remove button for each selected tag
    const removeButton = document.createElement("button");
    removeButton.textContent = "✕";
    removeButton.classList.add("remove-tag");
    removeButton.addEventListener("click", () => removeSelectedTag(tag));

    tagItem.appendChild(removeButton);
    selectedTagsContainer.appendChild(tagItem);
  });
}

// Function to handle tag selection/unselection
function handleTagSelection() {
  const tagDropdown = document.getElementById("tagDropdown");
  const newSelectedTag = Array.from(tagDropdown.selectedOptions).map(option => option.value);
  var len = newSelectedTag.length;

  var tagNew = newSelectedTag[len - 1];
  if (tagNew === undefined) {
    displaySelectedTags(selectedTags);
    return;
  }
  let isTagPresent = false;
  for (let i = 0; i < selectedTags.length; i++) {
    if (selectedTags[i] === tagNew) {
      isTagPresent = true;
      break;
    }
  }

  // If newSelectedTag is not present, push it into the selectedTags array
  if (!isTagPresent) {
    selectedTags.push(tagNew);
  }


  displaySelectedTags(selectedTags);
}

// Function to remove a selected tag
function removeSelectedTag(tag) {
  const tagDropdown = document.getElementById("tagDropdown");
  const option = tagDropdown.querySelector(`option[value="${tag}"]`);
  if (option) {
    option.selected = false;
  }
  let index = selectedTags.indexOf(tag);
  if (index !== -1) {
    selectedTags.splice(index, 1);
  }

  handleTagSelection(); // Update the displayed selected tags
}

// Function to add a new tag to the dropdown menu and save it
function addNewTag() {
  const newTag = prompt("Enter a new tag:");
  if (newTag && !tags.includes(newTag)) {
    tags.push(newTag);
    localStorage.removeItem('tags');
    localStorage.setItem("tags", JSON.stringify(tags));
    renderTagDropdown();
  }
}

// Event listeners for the tag
const addNewTagButton = document.getElementById("addNewTagButton");
addNewTagButton.addEventListener("click", addNewTag);


const tagDropdown = document.getElementById("tagDropdown");
tagDropdown.addEventListener("change", handleTagSelection);

// Fetching tags from localStorage, if available
const storedTags = localStorage.getItem("tags");
if (storedTags) {
  tags = JSON.parse(storedTags);
}

// Render the initial dropdown menu and selected tags
renderTagDropdown();
handleTagSelection();





///////Search functionality to search in task name, task tags,task's subtasks 

function removeSpaces(text) {
  return text.replace(/\s/g, "").toLowerCase();
}

function searchTasks(searchTerm) {
  const searchWithoutSpaces = removeSpaces(searchTerm);

  const filteredTasks = tasks.filter(task => {
    // Check if the task name or tags (without spaces) contain the search term (without spaces)
    const nameWithoutSpaces = removeSpaces(task.name);
    const tagsWithoutSpaces = task.Tags.map(tag => removeSpaces(tag));
    const subtasksWithoutSpaces = task.SubTasks.map(subtask => removeSpaces(subtask));

    const searchInName = nameWithoutSpaces.includes(searchWithoutSpaces);
    const searchInTags = tagsWithoutSpaces.some(tag => tag.includes(searchWithoutSpaces));
    const searchInSubtasks = subtasksWithoutSpaces.some(subtask => subtask.includes(searchWithoutSpaces));

    return searchInName || searchInTags || searchInSubtasks;
  });
  console.log(filteredTasks);

  updateTaskList(filteredTasks);
}


const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
  const searchTerm = document.getElementById("searchInput").value;
  searchTasks(searchTerm);
});



//Function to extract due date from the task name itself if not provided.Searching regular expressions like X days, tomorrow 

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}



function parseDueDate(todoText) {
  const today = new Date();


  const tomorrowPattern = /tomorrow/i;
  const daysFromNowPattern = /(\d+)\s*days?/i;

  if (tomorrowPattern.test(todoText)) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return formatDate(tomorrow);
  }

  const daysMatch = todoText.match(daysFromNowPattern);
  if (daysMatch) {
    const daysToAdd = parseInt(daysMatch[1], 10);
    if (!isNaN(daysToAdd)) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + daysToAdd);
      return formatDate(futureDate);
    }
  }


  const specificDatePattern = /(\d{1,2})(?:st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s+(\d{1,2})\s*(am|pm)?/i;
  const specificDateMatch = todoText.match(specificDatePattern);

  if (specificDateMatch) {
    const day = parseInt(specificDateMatch[1], 10);
    const month = specificDateMatch[2];
    const year = parseInt(specificDateMatch[3], 10);
    const hours = parseInt(specificDateMatch[4], 10);
    const isPM = specificDateMatch[5] && specificDateMatch[5].toLowerCase() === "pm";

    if (!isNaN(day) && !isNaN(year)) {
      const specificDate = new Date(year, monthIndex, day, isPM && hours !== 12 ? hours + 12 : hours);
      return formatDate(specificDate);
    }
  }

  return null;
}



////Functions for dragging a complete task div over other task


function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.taskId);

}


function handleDragOver(event) {
  event.preventDefault();
}


function handleDrop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");
  const droppedElement = document.querySelector(`[data-task-id="${taskId}"]`);
  const targetElement = event.target.closest("[data-task-id]");
  // console.log(droppedElement);
  // console.log(targetElement);
  // inserting only on outer div element not on its child
  if (droppedElement && targetElement && droppedElement !== targetElement) {
    const parentElement = targetElement.parentElement;
    const boundingRect = targetElement.getBoundingClientRect();

    if (event.clientY < boundingRect.top + boundingRect.height / 2) {
      
      parentElement.insertBefore(droppedElement, targetElement);
    } else {
     
      parentElement.insertBefore(droppedElement, targetElement.nextElementSibling);
    }
  }
}



function handleDragEnd(event) {
  event.target.classList.remove("dragging");
}
taskList.addEventListener("dragstart", handleDragStart);
taskList.addEventListener("dragover", handleDragOver);
taskList.addEventListener("drop", handleDrop);
taskList.addEventListener("dragend", handleDragEnd);





//Adding a New Task Functionality
function addTask() {
  const taskName = taskInput.value.trim();
  const categoryDropdown = document.getElementById("categoryDropdown");
  const category = categoryDropdown.value;
  const priorityDropdown = document.getElementById("priorityDropdown");
  const priority = priorityDropdown.value;
  const dueDateDropDown = document.getElementById("dueDateInput");
  var dueDate = dueDateDropDown.value;

  const dueDatefromtext = parseDueDate(taskName);
  if (dueDate === "") {
    dueDate = dueDatefromtext;
  }
  if (dueDate === null) {
    dueDate = "";
  }

  taskName.replace(/(tomorrow)|(\d+\s*days?(?=\s+from\s+now))|(\d{1,2}(?:st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+\d{1,2}\s*(am|pm)?)/gi, "").trim();

  if (taskName !== '') {
    todosCount += 1;
    var taskId = todosCount;
    var UniqueId = generateUniqueID();
    var task = {
      id: UniqueId,
      name: taskName,
      isComplete: false,
      Category: category,
      Priority: priority,
      DueDate: dueDate,
      Tags: selectedTags,
      SubTasks: [],
      ReminderTime: 0,
    };
    tasks.push(task);
    taskInput.value = '';
    updateLocalStorage();
    updateTaskList();
    console.log(tasks);
  }
  renderCategoryDropdown();
  renderPriorityDropdown();
  selectedTags = [];
  displaySelectedTags(selectedTags);
  dueDateInput.min = new Date().toISOString().split("T")[0];
  dueDateInput.value = "";
}

//Deleting a existing Task using its id
function deleteTask(taskId) {

  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    updateTaskList();
    updateLocalStorage();
  }
}

// Function to update the date on the main screen

function updateDate() {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  dateElement.textContent = formattedDate;
}

// Adding event listeners to add button and if someone press enter on the input box itself
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    addTask();
  }
});


//Function to render Subtask for a particular task on press of down arrow button
function renderSubtasks(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (!task) return;

  const taskItem = document.getElementById(`task-${taskId}`);
  let subtaskContainer = taskItem.querySelector(".subtask-container");

  if (!subtaskContainer) {
    subtaskContainer = document.createElement("div");
    subtaskContainer.classList.add("subtask-container");

    task.SubTasks.forEach(subtask => {
      const subtaskItem = document.createElement("div");
      subtaskItem.classList.add('subtask');
      subtaskItem.textContent = subtask;
      const deleteButton = document.createElement("button");
      deleteButton.classList.add('delete-button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function (event) {
        console.log("yeah getting hit");
        const subtaskDiv = event.target.closest(".subtask");
        subtaskDiv.remove();
        const subtaskIndex = task.SubTasks.indexOf(subtask);
        if (subtaskIndex !== -1) {
          task.SubTasks.splice(subtaskIndex, 1);
          updateLocalStorage();
        }

      };
      subtaskItem.appendChild(deleteButton);
      subtaskContainer.appendChild(subtaskItem);
    });

    const input = document.createElement("input");
    input.classList.add('newSubtask');
    input.type = "text";
    input.placeholder = "Add a subtask...";

    const saveButton = document.createElement("button");
    saveButton.classList.add('addSubtaskButton');
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
      if (input.value) {
        task.SubTasks.push(input.value);
        input.value = "";
        updateLocalStorage();
        renderSubtasks(taskId); // Re-render the subtasks

      }
    });

    subtaskContainer.appendChild(input);
    subtaskContainer.appendChild(saveButton);

    const lastDiv = document.createElement("div");
    lastDiv.classList.add('lastDiv');

    const tagDiv = document.createElement("div");
    const span1 = document.createElement("span");
    span1.textContent = "Tags:  ";
    tagDiv.appendChild(span1);
    task.Tags.forEach(tag => {
      const tagItem = document.createElement("span");
      tagItem.textContent = tag + `${" "}`;
      tagDiv.appendChild(tagItem);
    })
    lastDiv.appendChild(tagDiv);

    const dueDateDiv = document.createElement("div");
    dueDateDiv.classList.add('dueDateDiv');


    const div1 = document.createElement("div");
    const span2 = document.createElement("span");
    span2.textContent = "Due Date:  ";
    div1.appendChild(span2);
    const span3 = document.createElement("span");
    span3.textContent = task.DueDate + `${" "}`;
    div1.appendChild(span3);
    dueDateDiv.appendChild(div1);

    const div2 = document.createElement("div");
    const span4 = document.createElement("span");
    span4.textContent = "Category:  ";
    div2.appendChild(span4);
    const span5 = document.createElement("span");
    span5.textContent = task.Category + `${" "}`;
    div2.appendChild(span5);
    dueDateDiv.appendChild(div2);

    const div3 = document.createElement("div");
    const span6 = document.createElement("span");
    span6.textContent = "Priority:  ";
    div3.appendChild(span6);
    const span7 = document.createElement("span");
    span7.textContent = task.Priority;
    div3.appendChild(span7);
    dueDateDiv.appendChild(div3);
    lastDiv.appendChild(dueDateDiv);
    subtaskContainer.appendChild(lastDiv);


    taskItem.appendChild(subtaskContainer);
  } else {
    subtaskContainer.style.display = subtaskContainer.style.display === "none" ? "block" : "none";
  }
}

//Function to add reminder to a particulr task


function handleNotifyButtonClick(taskId) {
  const task = tasks.find(task => task.id === taskId);
  const reminderTimeInMinutes = prompt("Enter reminder time in minutes:");

 
  const minutes = parseInt(reminderTimeInMinutes);
  if (!isNaN(minutes) && minutes >= 0) {
    task.ReminderTime = minutes;
    updateLocalStorage();
    setTimeout(() => {
      alert(`Reminder for task: ${task.name}`);
    }, minutes * 60000); 
  } else {
    alert("Invalid input. Please enter a valid positive number of minutes.");
  }
}


function createNotifyButton(taskId) {
  const button = document.createElement("button");
  button.textContent = "Notify";
  button.classList.add('notifyButton');
  button.addEventListener("click", () => handleNotifyButtonClick(taskId));
  return button;
}


//Updating the task list and rendering it on dynamically
function updateTaskList(taskArr = tasks) {

  taskList.innerHTML = '';


  taskArr.forEach(task => {
    const outerdiv = document.createElement('div');
    outerdiv.draggable = true;
    outerdiv.dataset.taskId = task.id;
    outerdiv.addEventListener("dragstart", handleDragStart); // Add dragstart event listener
    outerdiv.addEventListener("dragover", handleDragOver); // Add dragover event listener
    outerdiv.addEventListener("drop", handleDrop);
    outerdiv.addEventListener("dragend", handleDragEnd);
    outerdiv.id = `task-${task.id}`;
    const li = document.createElement('li');
    const taskText = document.createElement("span");
    taskText.textContent = task.name.substring(0, 45);
    if (task.isComplete) {
      taskText.style.textDecoration = "line-through";
    }
    const taskInput = document.createElement("input");
    taskInput.classList.add('taskInput');
    taskInput.type = "text";
    taskInput.value = task.name;
    taskInput.style.display = "none";
    const downArrowButton = document.createElement("button");
    downArrowButton.textContent = "▼";
    downArrowButton.classList.add('downArrowButton');
    downArrowButton.addEventListener("click", () => renderSubtasks(task.id));

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add('editButton');
    editButton.addEventListener("click", () => {
      if (editButton.textContent === "Save") {
        taskText.style.display = "inline-block";
        taskInput.style.display = "none";

        const taskIdx = tasks.findIndex(tsk => tsk.id === task.id);
        if (taskIdx !== -1) {
          task.name = taskInput.value;
          updateLocalStorage();
        }
        taskText.textContent = taskInput.value.substring(0, 35);
        editButton.textContent = "Edit";
      }
      else {
        taskText.style.display = "none";
        taskInput.style.display = "inline-block";
        taskInput.focus();
        editButton.textContent = "Save";
      }
    });



    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('deleteButton');
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    editButton.addEventListener("click", () => {
    });



    li.appendChild(taskText);
    li.appendChild(taskInput);
    li.appendChild(downArrowButton);


    li.appendChild(editButton);
    li.appendChild(createNotifyButton(task.id));
    const markButton = document.createElement("button");
    if (task.isComplete) {
      markButton.textContent = 'Completed';
      markButton.classList.add('completeButton');
    }
    else {
      markButton.textContent = 'Pending';
      markButton.classList.add('pendingButton');
    }
    li.appendChild(markButton);
    markButton.addEventListener("click", () => {
      if (markButton.textContent === "Completed") {
        markButton.textContent = "Pending";
        markButton.classList.remove("completeButton");
        markButton.classList.add('pendingButton');
        task.isComplete = false;
        // console.log('calling');

      }
      else {
        markButton.textContent = "Completed";
        markButton.classList.remove("pendingButton");
        markButton.classList.add('completeButton');
        task.isComplete = true;
        // console.log('calling');
      }
      updateLocalStorage();
      // updateTaskList();
    });
    li.appendChild(deleteButton);
    outerdiv.appendChild(li);
    taskList.appendChild(outerdiv);
  });

  pendingTasksElement.textContent = `Total Tasks: ${taskArr.length}`;
  console.log(taskArr.length);
}

// initialize();
updateDate();
updateTaskList();

