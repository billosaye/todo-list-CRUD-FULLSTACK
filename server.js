const express = require('express');  
const app = express();  // Creating an Express application
const PORT = process.env.PORT || 3000;  // Setting the port number from environment variable or defaulting to 3000

// Middleware
app.use(express.json());  // parse JSON bodies of incoming requests
app.use(express.urlencoded({ extended: true }));  // parse URL-encoded bodies


app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(express.static('public'));  // Static files

// Example in-memory data data handling
let tasks = [
  { id: 1, title: 'Task 1', description: 'Description for Task 1' },
  { id: 2, title: 'Task 2', description: 'Description for Task 2' }
];

// Routes for rendering EJS templates
app.get('/', (req, res) => {  // Route for rendering the 'index' template
  res.render('index', { tasks });  // Rendering 'index.ejs' with tasks data
});

app.get('/dashboard', (req, res) => {  // Route for rendering the 'dashboard' template
  res.render('dashboard', { tasks });  // Rendering 'dashboard.ejs' with tasks data
});

app.get('/taskForm', (req, res) => {  // Route for rendering the 'taskForm' template
  res.render('taskForm');  // Rendering 'taskForm.ejs' without additional data
});

// Routes for CRUD operations on tasks

// GET all tasks
app.get('/api/v1/tasks', (req, res) => {  // API endpoint to fetch all tasks
  res.json(tasks);  // Sending JSON response with all tasks
});

// POST a new task
app.post('/api/v1/tasks', (req, res) => {  // API endpoint to create a new task
    const { title, description } = req.body;  // Extracting title and description from request body
    const newTask = { id: tasks.length + 1, title, description };  // Creating a new task object
    tasks.push(newTask);  // Adding new task to the tasks array
    // Redirect to the index page after adding the task
    res.redirect('/');  // Redirecting to the root route ('/') which renders the 'index' page
  });
  

// GET a specific task by id
app.get('/api/v1/tasks/:id', (req, res) => {  // API endpoint to fetch a task by its id
  const taskId = parseInt(req.params.id);  // Extracting task id from request parameters
  const task = tasks.find(task => task.id === taskId);  // Finding the task with the specified id
  if (!task) {  // If task is not found
    return res.status(404).json({ message: 'Task not found' });  // Sending 404 response with error message
  }
  res.json(task);  // Sending JSON response with the found task
});

// PUT update a task by id
app.put('/api/v1/tasks/:id', (req, res) => {  // API endpoint to update a task by its id
  const taskId = parseInt(req.params.id);  // Extracting task id from request parameters
  const { title, description } = req.body;  // Extracting updated title and description from request body
  let taskUpdated = false;  // Flag to track if task was updated
  tasks = tasks.map(task => {  // Updating tasks array
    if (task.id === taskId) {  // If current task id matches the requested task id
      task.title = title;  // Update task title
      task.description = description;  // Update task description
      taskUpdated = true;  // Setting task updated flag to true
    }
    return task;  // Returning updated or unchanged task
  });
  if (!taskUpdated) {  // If task was not updated (not found)
    return res.status(404).json({ message: 'Task not found' });  // Sending 404 response with error message
  }
  res.json({ message: 'Task updated successfully' });  // Sending JSON response indicating successful update
});

// DELETE a task by id
app.delete('/api/v1/tasks/:id', (req, res) => {  // API endpoint to delete a task by its id
  const taskId = parseInt(req.params.id);  // Extracting task id from request parameters
  const initialLength = tasks.length;  // Storing initial length of tasks array
  tasks = tasks.filter(task => task.id !== taskId);  // Filtering out task with the specified id
  if (tasks.length === initialLength) {  // If tasks length remains unchanged (task not found)
    return res.status(404).json({ message: 'Task not found' });  // Sending 404 response with error message
  }
  res.json({ message: 'Task deleted successfully' });  // Sending JSON response indicating successful deletion
});

// Start server
app.listen(PORT, () => {  // Starting the server on specified port
  console.log(`Server is running on http://localhost:${PORT}`);  // Logging server start message
});
