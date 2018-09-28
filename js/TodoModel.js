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
}