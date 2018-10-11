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
        const year = new Date().getFullYear();
        switch (type) {
            case 'all-tasks':
                tempArr = this.todoModel.tasks;
                UI.header = 'tasks';
                break;
            case 'today':
                this.todoModel.tasks.forEach(el => {
                    if (el.types.today) {
                        tempArr.push(el);
                    };
                });
                UI.header = 'tasks for today';
                break;
            case 'this-week':
                this.todoModel.tasks.forEach(el => {
                    if (el.types.thisWeek) {
                        tempArr.push(el);
                    };
                });
                UI.header = 'tasks for this week';
                break;
            case 'this-month':
                this.todoModel.tasks.forEach(el => {
                    if (el.types.thisMonth) {
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
            case 'overdue':
                this.todoModel.tasks.forEach(el => {
                    if (el.types.overdue) {
                        tempArr.push(el);
                    };
                });
                UI.header = 'overdue tasks';
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

        document.querySelector('.header__menu').addEventListener('click', () => this.todoModel.setIsMenuDisplayed(this.todoView.toggleMenu(this.todoModel.getIsMenuDisplayed())));

        Array.from(document.querySelectorAll('.menu__item')).forEach(el => el.addEventListener('click', e => {

            if(!e.target.classList.contains('menu__item--active')) {
        
                // mark chosen list
                Array.from(document.querySelectorAll('.menu__item')).forEach(el => el.classList.remove('menu__item--active'));
                e.target.classList.add('menu__item--active');

                // check dates
                this.todoModel.checkDates();

                this.todoModel.persistData();
                this.todoModel.persistCurrentID();
        
                // create an array with tasks depending on a category
                const UI = this.getUIElements(e.target.id);
                
                // render UI
                this.todoView.renderUI(UI);
            };
            if(window.innerWidth <= 900) this.todoModel.setIsMenuDisplayed(this.todoView.toggleMenu(this.todoModel.getIsMenuDisplayed()));
        }));
        
        // new task
        
        document.querySelector('#new-task').addEventListener('click', () => this.todoView.toggleTaskForm(this.getTodayDate()));
        document.querySelector('.form-container__close').addEventListener('click', () => this.todoView.toggleTaskForm());
        
        document.querySelector('#add-task').addEventListener('click', e => {
            e.preventDefault();
            // check if a user is adding a new task or just editing old one (it depends on button's text)
            if(e.target.textContent === 'Add task') {

                // check if a user has provided a task name and if a date is not past
                if (this.todoView.getTaskName() && this.todoView.getTaskDate() >= this.getTodayDate()) {
            
                    // create a new task object
                    const newTask = {
                        taskName: this.todoView.getTaskName(),
                        taskDate: this.todoView.getTaskDate(),
                        taskImportance: this.todoView.getTaskImportance(),
                        taskNote: this.todoView.getTaskNote(),
                        taskID: this.todoModel.getNewID(), 
                        isDone: false, 
                        isOverdue: false,
                        types: {
                            today: this.todoModel.isToday(this.getTodayDate(), this.todoView.getTaskDate()),
                            thisWeek: this.todoModel.weekIncludesDate(this.todoModel.daysOfThisWeek(), this.todoView.getTaskDate()),
                            thisMonth: this.todoModel.monthIncludesDate(this.todoView.getTaskDate()),
                            important: this.todoView.getTaskImportance(),
                            archived: false,
                            overdue: false
                        }
                    };
                    console.log(newTask);

                    // put the new task to the tasks array
                    this.todoModel.addTask(newTask);
                };
            // if a user wants to edit a task
            } else {
                // get from the form task's properties
                const task = { name: this.todoView.getTaskName(), date: this.todoView.getTaskDate(), importance: this.todoView.getTaskImportance(), note: this.todoView.getTaskNote()  }
                // update task
                this.todoModel.updateTask(this.todoModel.displayedTaskID, task);
            }

            // check dates
            this.todoModel.checkDates();

            // persist data
            this.todoModel.persistData();
            this.todoModel.persistCurrentID();

            // check which tasks list is active (check which menu list item has a class "menu__item--active" in this particular moment)
            const currentListType = Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id;

            // create an array with tasks depending on a category
            const UI = this.getUIElements(currentListType);
        
            // render UI
            this.todoView.renderUI(UI);
    
            this.todoView.clearInputs();
            this.todoView.toggleTaskForm();
        });

        // task edition

        document.querySelector('.todo__list').addEventListener('click', e => {
            const task = e.target.closest('.task');
            if(task) {
                this.todoModel.displayedTaskID = parseInt(task.parentElement.id);
                const index = this.todoModel.tasks.map(el => el.taskID).indexOf(parseInt(task.parentElement.id));
                this.todoView.showTask(this.todoModel.tasks[index]);
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
                        // render UI
                        this.todoView.renderUI(UI);
                    }, 500);
                    
                } else {
                    checkbox.children[0].classList.remove('check--show');
                    this.todoModel.tasks[this.todoModel.tasks.map(el => el.taskID).indexOf(parseInt(e.target.parentElement.parentElement.id))].isDone = false;
                    this.todoModel.persistData();
                    setTimeout(() => {
                        const UI = this.getUIElements(Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);
                        // render UI
                        this.todoView.renderUI(UI);
                    }, 500);
                }
                
            };
        });
        
        document.querySelector('.checkbox--form').parentElement.addEventListener('click', () => document.querySelector('.checkbox--form').children[0].classList.toggle('check--show'));
        
        // delete btn

        document.querySelector('.todo__list').addEventListener('click', e => {
            const del = e.target.closest('.delete');
            if (del) {
                this.todoModel.removeTask(parseInt(e.target.parentElement.id));
                this.todoModel.persistData();
                    setTimeout(() => {
                        const UI = this.getUIElements(Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);
                        // render UI
                        this.todoView.renderUI(UI);
                    }, 500);
            }
        });

        window.addEventListener('load', () => {
        
        
            this.todoModel.readData();

            // check dates
            this.todoModel.checkDates();
            
            // create an array with tasks depending on a category
            const UI = this.getUIElements(Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);
            // render UI
            this.todoView.renderUI(UI);
        });
    }
}