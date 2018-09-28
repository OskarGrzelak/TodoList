class TodoView {
    constructor() {
        this.elements = {
            menu: document.querySelector('.menu'),
            menuItems: document.querySelectorAll('.menu__item'),
            newTask: document.querySelector('#new-task'),
            newTaskForm: document.querySelector('.todo__add-task'),
            taskName: document.querySelector('#task-name'),
            taskDate: document.querySelector('#task-date'),
            taskImportance: document.querySelector('#task-importance'),
            addTask: document.querySelector('#add-task'),
            tasksList: document.querySelector('.todo__list'),
            tasksHeader: document.querySelector('#tasks-header'),
            tasksMessage: document.querySelector('#tasks-message'),
            checkboxes: document.querySelectorAll('.checkbox'),
            chceckboxForm: document.querySelector('.checkbox--form')
        };
    }
    toggleMenu(state) { 
        if (state === false) {
            this.elements.menu.style.display = 'block';
            state = true;
        } else {
            this.elements.menu.style.display = 'none';
            state = false;
        }
        return state;
    }
    toggleTaskForm(date) {
        // if plus sign 
        if (this.elements.newTask.children[0].textContent === '+') {
            // change it to x sign
            this.elements.newTask.children[0].textContent = 'x';
            // show new task box
    
            this.elements.taskDate.value = date;
            this.elements.tasksList.style = 'margin-top: 3rem';
            this.elements.newTaskForm.classList.add('todo__add-task--visible');
    
        } else {
            //change it to plus sign
            this.elements.newTask.children[0].textContent = '+';
            // hide new task box
            this.elements.newTaskForm.classList.remove('todo__add-task--visible');
            this.elements.tasksList.style = 'margin-top: -8rem';
        }
    }
    getTaskName() { return  this.elements.taskName.value; }
    getTaskDate() { return this.elements.taskDate.value; }
    getTaskImportance() { return this.elements.taskImportance.checked; }
    renderTask(task) {
        const markup = `<li class="todo__task" id="${task.taskID}"><span class="checkbox"><span class="check ${task.isDone ? "check--show" : ""}">&check;</span></span><span class="delete">X</span>${task.taskName}${task.taskImportance ? '<span class="todo__importance">!!!</span>' : ''}</span><span class="todo__date">${task.taskDate}</span></li>`;
        this.elements.tasksList.insertAdjacentHTML('beforeend', markup);
    }
    renderTasksList(tasks) { tasks.forEach(el => this.renderTask(el)); }
    renderTasksHeader(header) { this.elements.tasksHeader.innerHTML = header; }
    renderTasksMessage(message) { this.elements.tasksMessage.innerHTML = message; }
    clearTasksList() { this.elements.tasksList.innerHTML = ''; }
    clearInputs() {
        this.elements.taskName.value = '';
        this.elements.taskDate.value = '';
        this.elements.taskImportance.checked = false;
        this.elements.chceckboxForm.children[0].classList.remove('check--show');
    }
    renderUI(UI) {
        // render header
        this.renderTasksHeader(UI.header);
        this.renderTasksMessage(UI.message);

        // clear todo section
        this.clearTasksList();

        // render todo section
        this.renderTasksList(UI.currentTasksList);
    }
}