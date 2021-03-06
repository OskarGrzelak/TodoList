class TodoView {
    constructor() {
        this.elements = {
            menu: document.querySelector('.menu'),
            menuItems: document.querySelectorAll('.menu__item'),
            newTask: document.querySelector('#new-task'),
            newTaskForm: document.querySelector('.form-container'),
            taskForm: document.querySelector('.form'),
            taskName: document.querySelector('#task-name'),
            taskDate: document.querySelector('#task-date'),
            taskImportance: document.querySelector('#task-importance'),
            taskNote: document.querySelector('#task-note'),
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
        if (!this.elements.newTaskForm.classList.contains('form-container--visible')) {
            this.elements.taskDate.value = date;
            this.elements.newTaskForm.classList.add('form-container--visible');
            this.elements.taskForm.style.display = 'block';
        } else {
            this.elements.taskForm.style.display = 'none';
            this.elements.newTaskForm.classList.remove('form-container--visible');
            this.clearInputs();
        };
    }
    getTaskName() { return  this.elements.taskName.value; }
    getTaskDate() { return this.elements.taskDate.value; }
    getTaskImportance() { return this.elements.taskImportance.checked; }
    getTaskNote() { return this.elements.taskNote.value; }
    renderTask(task) {
        const markup = `<li class="todo__task" id="${task.taskID}"><span class="checkbox"><span class="check ${task.types.archived ? "check--show" : ""}">&check;</span></span><i class="material-icons delete">delete</i><span class="task">${task.taskName}${task.types.important ? '<span class="todo__importance">!!!</span>' : ''}<span class="todo__date ${task.types.overdue ? 'todo__date--overdue' : ''}">${task.taskDate}</span></span></li>`;
        this.elements.tasksList.insertAdjacentHTML('beforeend', markup);
    }
    renderTasksList(tasks) { tasks.forEach(el => this.renderTask(el)); }
    clearTasksList() { this.elements.tasksList.innerHTML = ''; }
    clearInputs() {
        this.elements.taskName.value = '';
        this.elements.taskDate.value = '';
        this.elements.taskImportance.checked = false;
        this.elements.taskNote.value = '';
        this.elements.addTask.textContent = 'Add task';
        this.elements.chceckboxForm.children[0].classList.remove('check--show');
    }

    renderHeaders(tasks, listType) {
        let header, message;
        const tasksCounter = tasks.length;
        switch (listType) {
            case 'all':
                header = 'tasks';
                break;
            case 'today':
                header = 'tasks for today';
                break;
            case 'week':
                header = 'tasks for this week';
                break;
            case 'month':
                header = 'tasks for this month';
                break;
            case 'important':
                header = 'important tasks';
                break;
            case 'overdue':
                header = 'overdue tasks';
                break;
            case 'archived':
                header = 'archived tasks';
        }

        if (tasksCounter === 0) {
            message = '<h3 class="heading-tertiary">You don\'t have any tasks</h3>';  
        } else if (tasksCounter === 1) {
            message = `<h3 class="heading-tertiary">You have 1 ${header}</h3>`;
        } else {
            message = `<h3 class="heading-tertiary">You have ${tasksCounter} ${header}</h3>`;
        };

        this.elements.tasksHeader.innerHTML = header;
        this.elements.tasksMessage.innerHTML = message;
    }
    renderUI(tasksList, listType) {
        // clear tasks list
        this.clearTasksList();

        // render headings
        this.renderHeaders(tasksList, listType);

        // render task list
        this.renderTasksList(tasksList);
    }
    showTask(task) {
        this.elements.taskName.value = task.taskName;
        this.elements.taskDate.value = task.taskDate;
        this.elements.taskImportance.checked = task.taskImportance;
        if (task.taskImportance) this.elements.chceckboxForm.children[0].classList.add('check--show');
        this.elements.taskNote.value = task.taskNote;
        this.elements.addTask.textContent = 'Edit task';
        this.elements.newTaskForm.classList.add('form-container--visible');
        this.elements.taskForm.style.display = 'block';
    }
}