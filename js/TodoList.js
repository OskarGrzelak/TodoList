const todoModel = new TodoModel();
const todoView = new TodoView();
const todoController = new TodoController(todoModel, todoView);
todoController.listenEvents();

//localStorage.removeItem('tasks');
//localStorage.removeItem('id');