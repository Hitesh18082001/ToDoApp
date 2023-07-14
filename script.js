
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const dateElement = document.getElementById('date');
const pendingTasksElement = document.getElementById('pendingTasks');


let tasks = [];
var hasFetchedData=false;


function addTask() {
  const taskName = taskInput.value.trim();

  if (taskName !== '') {

    const taskId = tasks.length + 1;

    const task = {
      id: taskId,
      name: taskName
    };


    tasks.push(task);


    taskInput.value = '';


    updateTaskList();
  }
}


function deleteTask(taskId) {
 
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {

    tasks.splice(taskIndex, 1);
    updateTaskList();
  }
}

// Function to update the task list on the screen

function updateDate() {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  dateElement.textContent = formattedDate;
}

// Add event listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    addTask();
  }
});

function fetchData() {
 
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => {
        
        // Extract "id" and "title" properties and create a new array
        tasks = data.map(item => ({
          id: item.id,
          name: item.title.length > 40 ? item.title.substring(0, 36) + '...' : item.title
        }));
        console.log(tasks);
        updateTaskList();
      })
      .catch(error => {
        console.log('Error:', error);
      });
    //   console.log(tasks);
      
  }
  
  function initialize() {
    if (!hasFetchedData) {
      fetchData();
      hasFetchedData=true;
    }
  }
  function updateTaskList() {
    // Clear the existing task list
    taskList.innerHTML = '';
  
    // Loop through each task and create an <li> element for it
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.name;
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('deleteButton');
      deleteButton.addEventListener('click', () => deleteTask(task.id));
  
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  
    pendingTasksElement.textContent = `Pending Tasks: ${tasks.length}`;
    console.log(tasks.length);
  }
  
initialize();
updateDate();
updateTaskList();

