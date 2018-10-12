class TodoController {
    constructor(model, view) {
        this.todoModel = model;
        this.todoView = view;
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

                // create an array with tasks depending on a category
                const currentTasksList = this.todoModel.createCurrentTasksList(this.todoModel.tasks, e.target.id);

                // clear tasks list
                this.todoView.clearTasksList();

                // render headings
                this.todoView.renderHeaders(currentTasksList, e.target.id);

                // render task list
                this.todoView.renderTasksList(currentTasksList);

                // persist data
                this.todoModel.persistData();
                this.todoModel.persistCurrentID();
            };
            if(window.innerWidth <= 900) this.todoModel.setIsMenuDisplayed(this.todoView.toggleMenu(this.todoModel.getIsMenuDisplayed()));
        }));
        
        // new task
        
        document.querySelector('#new-task').addEventListener('click', () => this.todoView.toggleTaskForm(this.todoModel.getTodayDate()));
        document.querySelector('.form-container__close').addEventListener('click', () => this.todoView.toggleTaskForm());
        
        document.querySelector('#add-task').addEventListener('click', e => {
            e.preventDefault();
            // check if a user is adding a new task or just editing old one (it depends on button's text)
            if(e.target.textContent === 'Add task') {

                // check if a user has provided a task name and if a date is not past
                if (this.todoView.getTaskName() && this.todoView.getTaskDate() >= this.todoModel.getTodayDate()) {
            
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
                            all: true,
                            today: this.todoModel.isToday(this.todoModel.getTodayDate(), this.todoView.getTaskDate()),
                            week: this.todoModel.weekIncludesDate(this.todoModel.daysOfThisWeek(), this.todoView.getTaskDate()),
                            month: this.todoModel.monthIncludesDate(this.todoView.getTaskDate()),
                            important: this.todoView.getTaskImportance(),
                            archived: false,
                            overdue: false
                        }
                    };

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

            // check which tasks list is active (check which menu list item has a class "menu__item--active" in this particular moment)
            const currentListType = Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id;

            // check dates
            this.todoModel.checkDates();

            // create an array with tasks depending on a category
            const currentTasksList = this.todoModel.createCurrentTasksList(this.todoModel.tasks, currentListType);
            
            // clear tasks list
            this.todoView.clearTasksList();

            // render headings
            this.todoView.renderHeaders(currentTasksList, currentListType);

            // render task list
            this.todoView.renderTasksList(currentTasksList);

            // persist data
            this.todoModel.persistData();
            this.todoModel.persistCurrentID();
    
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
                    this.todoModel.tasks[this.todoModel.tasks.map(el => el.taskID).indexOf(parseInt(e.target.parentElement.id))].types.archived = true;
                    setTimeout(() => {
                        // check which tasks list is active (check which menu list item has a class "menu__item--active" in this particular moment)
                        const currentListType = Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id;
                        
                        // check dates
                        this.todoModel.checkDates();

                        // create an array with tasks depending on a category
                        const currentTasksList = this.todoModel.createCurrentTasksList(this.todoModel.tasks, currentListType);
                        
                        // clear tasks list
                        this.todoView.clearTasksList();

                        // render headings
                        this.todoView.renderHeaders(currentTasksList, currentListType);

                        // render task list
                        this.todoView.renderTasksList(currentTasksList);
                    }, 500);
                    this.todoModel.persistData();
                } else {
                    checkbox.children[0].classList.remove('check--show');
                    this.todoModel.tasks[this.todoModel.tasks.map(el => el.taskID).indexOf(parseInt(e.target.parentElement.parentElement.id))].isDone = false;
                    this.todoModel.tasks[this.todoModel.tasks.map(el => el.taskID).indexOf(parseInt(e.target.parentElement.parentElement.id))].types.archived = false;
                    setTimeout(() => {
                        // check which tasks list is active (check which menu list item has a class "menu__item--active" in this particular moment)
                        const currentListType = Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id;

                        // check dates
                        this.todoModel.checkDates();

                        // create an array with tasks depending on a category
                        const currentTasksList = this.todoModel.createCurrentTasksList(this.todoModel.tasks, currentListType);
                        
                        // clear tasks list
                        this.todoView.clearTasksList();

                        // render headings
                        this.todoView.renderHeaders(currentTasksList, currentListType);

                        // render task list
                        this.todoView.renderTasksList(currentTasksList);
                    }, 500);
                    this.todoModel.persistData();
                }
                
            };
        });
        
        document.querySelector('.checkbox--form').parentElement.addEventListener('click', () => document.querySelector('.checkbox--form').children[0].classList.toggle('check--show'));
        
        // delete btn

        document.querySelector('.todo__list').addEventListener('click', e => {
            const del = e.target.closest('.delete');
            if (del) {
                this.todoModel.removeTask(parseInt(e.target.parentElement.id));
                setTimeout(() => {
                        
                    // check which tasks list is active (check which menu list item has a class "menu__item--active" in this particular moment)
                    const currentListType = Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id;

                    // check dates
                    this.todoModel.checkDates();

                    // create an array with tasks depending on a category
                    const currentTasksList = this.todoModel.createCurrentTasksList(this.todoModel.tasks, currentListType);
                        
                    // clear tasks list
                    this.todoView.clearTasksList();

                    // render headings
                    this.todoView.renderHeaders(currentTasksList, currentListType);

                    // render task list
                    this.todoView.renderTasksList(currentTasksList);
                }, 500);
                this.todoModel.persistData();    
            }
        });

        window.addEventListener('load', () => {
        
        
            this.todoModel.readData();

            // check which tasks list is active (check which menu list item has a class "menu__item--active" in this particular moment)
            const currentListType = Array.from(document.querySelectorAll('.menu__item'))[Array.from(document.querySelectorAll('.menu__item')).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id;

            // check dates
            this.todoModel.checkDates();

            // create an array with tasks depending on a category
            const currentTasksList = this.todoModel.createCurrentTasksList(this.todoModel.tasks, currentListType);
            
            // clear tasks list
            this.todoView.clearTasksList();

            // render headings
            this.todoView.renderHeaders(currentTasksList, currentListType);

            // render task list
            this.todoView.renderTasksList(currentTasksList);
        });
    }
}