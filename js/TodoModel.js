class TodoModel {
    constructor() {
        this.tasks = [];
        this.currentTasksList = [];
        this.currentFreeID = 0;
        this.isMenuDisplayed = window.innerWidth <= 900 ?  this.isMenuDisplayed = false : this.isMenuDisplayed = true;
    }

    getNewID() { return this.currentFreeID++; }
    addTask(task) { this.tasks.push(task); }
    completeTask(id) { this.tasks[id].isDone = true; }
    removeTask(id) { this.tasks.splice(this.tasks.map(el => el.taskID).indexOf(id), 1); }
    updateTask(id, task) {
        const index = this.tasks.map(el => el.taskID).indexOf(id);
        this.tasks[index].taskName = task.name;
        this.tasks[index].taskDate = task.date;
        this.tasks[index].taskImportance = task.importance;
        this.tasks[index].taskNote = task.note;
    }
    setTaskTypes(task, today) {
        const dayOfWeek = new Date().getDay();
        const dayOfMonth = new Date().getDate();
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        if (task.taskDate === today) {
            task.types.today = true;
            task.types.week = true;
            task.types.month = true;
        } /* else if () */
    }
    setIsMenuDisplayed(state) { this.isMenuDisplayed = state; }
    getIsMenuDisplayed() { return this.isMenuDisplayed; }
    toggleMenu() { this.isMenuDisplayed === true ? this.isMenuDisplayed = false : this.isMenuDisplayed = true; }
    persistData() { localStorage.setItem('tasks', JSON.stringify(this.tasks)); }
    persistCurrentID() { localStorage.setItem('id', JSON.stringify(this.currentFreeID)); }
    readData() {
        const storage = JSON.parse(localStorage.getItem('tasks'));
        const id = JSON.parse(localStorage.getItem('id'));
        // restoring likes from the local storage
        if (storage) this.tasks = storage;
        if (id) this.currentFreeID = id;
    }
    checkOverdue(id, date) {
        const index = this.tasks.map(el => el.taskID).indexOf(id);
        if(this.tasks[index].taskDate < date) this.tasks[index].isOverdue = true;
    }
}