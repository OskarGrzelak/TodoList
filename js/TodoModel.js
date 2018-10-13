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
        this.tasks[index].taskNote = task.note;
        this.tasks[index].types.important = task.importance;
    }
    createCurrentTasksList(tasks, listType) {
        return tasks.filter(el => { 
            if (listType === 'archived') { 
                if (el.types[listType]) return el;
            } else {
                if  (el.types[listType] && !el.types['archived']) return el;
            }
        });
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

    // Dates handling

    getTodayDate() {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth()+1; //January is 0!
        let year = today.getFullYear();
        if(day<10) { day = '0'+day }; 
        if(month<10) { month = '0'+month }
        return `${year}-${month}-${day}`;
    };

    daysOfThisWeek() {
        const dayOfWeek = new Date().getDay();
        const dayOfMonth = new Date().getDate();
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
    
        const daysOfThisWeek = [];
        
        let start, end;
        if (dayOfWeek !== 0) {
            start = dayOfMonth - dayOfWeek + 1;
            end = dayOfMonth + (7 - dayOfWeek);
        } else {
            start = dayOfMonth - 6;
            end = dayOfMonth;
        };
        
        const daysInMonth = {
            1: 31,
            2: year%4 === 0 ? 29 : 28,
            3: 31,
            4: 30,
            5: 31,
            6: 30,
            7: 31,
            8: 31,
            9: 30,
            10: 31,
            11: 30,
            12: 31
        };
    
        let tempYear, tempMonth, tempDay;
        if (start < 1) {
            if (month === 1) {
                tempMonth = 12;
                tempYear = year - 1;
            } else {
                tempMonth = month - 1;
                tempYear = year;
            }
            if(tempMonth<10) { tempMonth = '0'+tempMonth }
            for (let i = start; i <= 0; i++) {
                tempDay = daysInMonth[tempMonth] + i;
                if(tempDay<10) { tempDay = '0'+ tempDay }; 
                daysOfThisWeek.push(`${tempYear}-${tempMonth}-${tempDay}`);
            }
            if(month<10) { month = '0'+ month }
            for (let i = 1; i <= end; i ++) {
                tempDay = i;
                if(tempDay<10) { tempDay = '0'+ tempDay }; 
                daysOfThisWeek.push(`${year}-${month}-${tempDay}`);
            }
        } else if (end > daysInMonth[month]) {
            if (month === 12) {
                tempMonth = 1;
                tempYear = year + 1;
            } else {
                tempMonth = month + 1;
                tempYear = year;
            }
            if(month<10) { month = '0'+ month }
            for (let i = start; i <= daysInMonth[month]; i++) {
                tempDay = i;
                if(tempDay<10) { tempDay = '0'+ tempDay }; 
                daysOfThisWeek.push(`${year}-${month}-${tempDay}`);
            }
            if(tempMonth<10) { tempMonth = '0'+tempMonth }
            for (let i = 1; i <= end - daysInMonth[month]; i++) {
                tempDay = i;
                if(tempDay<10) { tempDay = '0'+ tempDay };
                daysOfThisWeek.push(`${tempYear}-${tempMonth}-${tempDay}`);
            }
        } else {
            for (let i = start; i <= end; i++) {
                tempDay = i;
                if(tempDay<10) { tempDay = '0'+ tempDay };
                if(month<10) { month = '0'+ month };
                daysOfThisWeek.push(`${year}-${month}-${tempDay}`);
            }
        }
        return daysOfThisWeek;
    };
    
    weekIncludesDate(week, date) {
        return week.includes(date);
    }

    monthIncludesDate(date) {
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        return (month === parseInt(date.split('-')[1]) && year === parseInt(date.split('-')[0]));
    }

    isToday(todayDate, date) {
        return todayDate === date;
    }

    isOverdue(todayDate, date) {
        return todayDate > date;
    }

    checkDates() {
        this.tasks.forEach(el => {
            el.types.today = this.isToday(this.getTodayDate(), el.taskDate);
            el.types.week = this.weekIncludesDate(this.daysOfThisWeek(), el.taskDate);
            el.types.month = this.monthIncludesDate(el.taskDate);
            el.types.overdue = this.isOverdue(this.getTodayDate(), el.taskDate);
        });
    }
}