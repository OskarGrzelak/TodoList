class TodoModel {
    constructor() {
        this.tasks = [];
        this.currentTasksList = [];
        this.currentFreeID = 0;
    }

    getNewID() { return this.currentFreeID++; }
    addTask(task) { this.tasks.push(task); }
    completeTask(id) { this.tasks[id].isDone = true; }
    removeTask(id) { this.tasks.splice(this.tasks.map(el => el.taskID).indexOf(id), 1); }
    persistData() { localStorage.setItem('tasks', JSON.stringify(this.tasks)); }
    persistCurrentID() { localStorage.setItem('id', JSON.stringify(this.currentFreeID)); }
    readData() {
        const storage = JSON.parse(localStorage.getItem('tasks'));
        const id = JSON.parse(localStorage.getItem('id'));
        // restoring likes from the local storage
        if (storage) this.tasks = storage;
        if (id) this.currentFreeID = id;
        console.log(this.currentFreeID);
    }

}

class TodoView {
    constructor() {
        this.elements = {
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
        const markup = `<li class="todo__task" id="${task.taskID}"><span class="checkbox"><span class="check ${task.isDone ? "check--show" : ""}">&check;</span></span><span class="delete">X</span>${task.taskName}${task.taskImportance ? '<span class="todo__importance">!!!</span>' : ''}<span class="todo__date">${task.taskDate}</span></li>`;
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
}

class TodoController {
    constructor(model, view) {
        this.todoModel = model;
        this.todoView = view;
    }

    getTodayDate() {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth()+1; //January is 0!
        let year = today.getFullYear();
        if(day<10) { day = '0'+day }; 
        if(month<10) { month = '0'+month }
        return `${year}-${month}-${day}`;
    };

    getUIElements(type) {
        let tempArr =[];
        const UI = { currentTasksList: [], header: '', message: '', tasksCounter: 0 };
        const dayOfWeek = new Date().getDay();
        const dayOfMonth = new Date().getDate();
        const month = new Date().getMonth() + 1;
        switch (type) {
            case 'all-tasks':
                tempArr = this.todoModel.tasks;
                UI.header = 'tasks';
                break;
            case 'today':
                this.todoModel.tasks.forEach(el => {
                    if (el.taskDate === this.getTodayDate()) {
                        tempArr.push(el);
                    };
                });
                UI.header = 'tasks for today';
                break;
            case 'this-week':
                let start, end;
                if (dayOfWeek !== 0) {
                    start = dayOfMonth - dayOfWeek + 1;
                    end = dayOfMonth + (7 - dayOfWeek);
                } else {
                    start = dayOfMonth - 6;
                    end = dayOfMonth;
                };
                this.todoModel.tasks.forEach(el => {
                    if (parseInt(el.taskDate.split('-')[1]) === month && parseInt(el.taskDate.split('-')[2])>=start && parseInt(el.taskDate.split('-')[2])<=end) {
                        tempArr.push(el);
                    };
                });
                UI.header = 'tasks for this week';
                break;
            case 'this-month':
                this.todoModel.tasks.forEach(el => {
                    if (parseInt(el.taskDate.split('-')[1]) === month) {
                        tempArr.push(el);
                    };
                });
                UI.header = 'tasks for this month';
                break;
            case 'important':
                this.todoModel.tasks.forEach(el => {
                    if (el.taskImportance) {
                        tempArr.push(el);
                    };
                });
                UI.header = 'important tasks';
                break;
            case 'archived':
                this.todoModel.tasks.forEach(el => {
                    if (el.isDone) {
                        tempArr.push(el);
                    };
                });
                UI.header = 'archived tasks';
        }
        if (type === 'archived') {
            tempArr.forEach(el => {UI.currentTasksList.push(el)});
        } else {
            tempArr.forEach(el => {
                if (!el.isDone) {
                    UI.currentTasksList.push(el);
                }
            });
        };
        UI.tasksCounter = UI.currentTasksList.length;
        if (UI.tasksCounter === 0) {
            UI.message = '<h3 class="heading-tertiary">You don\'t have any tasks</h3>';  
        } else if (UI.tasksCounter === 1) {
            UI.message = `<h3 class="heading-tertiary">You have 1 ${UI.header}</h3>`;
        } else {
            UI.message = `<h3 class="heading-tertiary">You have ${UI.tasksCounter} ${UI.header}</h3>`;
        };
        return UI;
    }

    listenEvents() {
        Array.from(document.querySelectorAll('.menu__item')).forEach(el => el.addEventListener('click', e => {

            if(!e.target.classList.contains('menu__item--active')) {
        
                // mark chosen list
                Array.from(document.querySelectorAll('.menu__item')).forEach(el => el.classList.remove('menu__item--active'));
                e.target.classList.add('menu__item--active');
        
                // create an array with tasks depending on a category
                const UI = this.getUIElements(e.target.id);
                
                // render header
                this.todoView.renderTasksHeader(UI.header);
                this.todoView.renderTasksMessage(UI.message);
        
                // clear todo section
                this.todoView.clearTasksList();
        
                // render todo section
                this.todoView.renderTasksList(UI.currentTasksList);
        
            };    
        }));
        
        // new task
        
        document.querySelector('#new-task').addEventListener('click', () => this.todoView.toggleTaskForm(this.getTodayDate()));
        
        document.querySelector('#add-task').addEventListener('click', e => {
            e.preventDefault();
            //const taskName = this.todoView.getTaskName();
            if (this.todoView.getTaskName() && this.todoView.getTaskDate() >= this.getTodayDate()) {
        
                this.todoModel.addTask({taskName: this.todoView.getTaskName(), taskDate: this.todoView.getTaskDate(), taskImportance: this.todoView.getTaskImportance(), taskID: this.todoModel.getNewID(), isDone: false});
                this.todoModel.persistData();
                this.todoModel.persistCurrentID();
        
                // create an array with tasks depending on a category
                const UI = this.getUIElements(Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);
        
                // render header
                this.todoView.renderTasksHeader(UI.header);
                this.todoView.renderTasksMessage(UI.message);
        
                // clear todo section
                this.todoView.clearTasksList();
        
                // render todo section
                this.todoView.renderTasksList(UI.currentTasksList);
        
                this.todoView.clearInputs();
                this.todoView.toggleTaskForm();
            }
        });
        
        // checkboxes
        
        document.querySelector('.todo__list').addEventListener('click', e => {
            const checkbox = e.target.closest('.checkbox');
            if (checkbox) {
                if (!checkbox.children[0].classList.contains('check--show')) {
                    checkbox.children[0].classList.add('check--show');
                    this.todoModel.tasks[this.todoModel.tasks.map(el => el.taskID).indexOf(parseInt(e.target.parentElement.id))].isDone = true;
                    this.todoModel.persistData();
                    setTimeout(() => {
                        const UI = this.getUIElements(Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);
                        this.todoView.renderTasksMessage(UI.message);
                        // clear todo section
                        this.todoView.clearTasksList();
        
                        // render todo section
                        this.todoView.renderTasksList(UI.currentTasksList);
                    }, 500);
                    
                } else {
                    checkbox.children[0].classList.remove('check--show');
                    this.todoModel.tasks[this.todoModel.tasks.map(el => el.taskID).indexOf(parseInt(e.target.parentElement.parentElement.id))].isDone = false;
                    this.todoModel.persistData();
                    setTimeout(() => {
                        const UI = this.getUIElements(Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);
                        this.todoView.renderTasksMessage(UI.message);
                        // clear todo section
                        this.todoView.clearTasksList();
        
                        // render todo section
                        this.todoView.renderTasksList(UI.currentTasksList);
                    }, 500);
                }
                
            };
        });
        
        document.querySelector('.checkbox--form').parentElement.addEventListener('click', () => document.querySelector('.checkbox--form').children[0].classList.toggle('check--show'));
        
        // delete btn

        document.querySelector('.todo__list').addEventListener('click', e => {
            const del = e.target.closest('.delete');
            if (del) {
                console.log(e.target.parentElement.id);
                this.todoModel.removeTask(parseInt(e.target.parentElement.id));

                this.todoModel.persistData();
                    setTimeout(() => {
                        const UI = this.getUIElements(Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);
                        this.todoView.renderTasksMessage(UI.message);
                        // clear todo section
                        this.todoView.clearTasksList();
        
                        // render todo section
                        this.todoView.renderTasksList(UI.currentTasksList);
                    }, 500);
            }
        })

        window.addEventListener('load', () => {
        
        
            this.todoModel.readData();
            // create an array with tasks depending on a category
            const UI = this.getUIElements(Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);
        
            // render header
            this.todoView.renderTasksHeader(UI.header);
            this.todoView.renderTasksMessage(UI.message);
        
            // clear todo section
            this.todoView.clearTasksList();
        
            // render todo section
            this.todoView.renderTasksList(UI.currentTasksList);
        });
    }
}

const todoModel = new TodoModel();
const todoView = new TodoView();
const todoController = new TodoController(todoModel, todoView);
todoController.listenEvents();

//localStorage.removeItem('tasks');
//localStorage.removeItem('id');