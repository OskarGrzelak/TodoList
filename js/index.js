const menuItems = document.querySelectorAll('.menu__item');
const newTask = document.querySelector('#new-task');
const newTaskForm = document.querySelector('.todo__add-task');
const taskName = document.querySelector('#task-name');
const taskDate = document.querySelector('#task-date');
const taskImportance = document.querySelector('#task-importance');
const addTask = document.querySelector('#add-task');
const tasksList = document.querySelector('.todo__list');
const tasksHeader = document.querySelector('#tasks-header');
const tasksMessage = document.querySelector('#tasks-message');
const checkboxes = document.querySelectorAll('.checkbox');
const chceckboxForm = document.querySelector('.checkbox--form');

const tasks = [];

const getTodayDate = () => {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth()+1; //January is 0!
    let year = today.getFullYear();
    if(day<10) { day = '0'+day }; 
    if(month<10) { month = '0'+month }
    return `${year}-${month}-${day}`;
};

const createTasksArray = type => {
    console.log(tasks);
    let tempArr =[];
    const UI = { currentTasksList: [], header: '', message: '', tasksCounter: 0 };
    const dayOfWeek = new Date().getDay();
    const dayOfMonth = new Date().getDate();
    const month = new Date().getMonth() + 1;
    switch (type) {
        case 'all-tasks':
            tempArr = tasks;
            UI.header = 'tasks';
            break;
        case 'today':
            tasks.forEach(el => {
                if (el.taskDate === getTodayDate()) {
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
            tasks.forEach(el => {
                if (parseInt(el.taskDate.split('-')[1]) === month && parseInt(el.taskDate.split('-')[2])>=start && parseInt(el.taskDate.split('-')[2])<=end) {
                    tempArr.push(el);
                };
            });
            UI.header = 'tasks for this week';
            break;
        case 'this-month':
            tasks.forEach(el => {
                if (parseInt(el.taskDate.split('-')[1]) === month) {
                    tempArr.push(el);
                };
            });
            UI.header = 'tasks for this month';
            break;
        case 'important':
            tasks.forEach(el => {
                if (el.taskImportance) {
                    tempArr.push(el);
                };
            });
            UI.header = 'important tasks';
            break;
        case 'archived':
            tasks.forEach(el => {
                console.log('archived');
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

const renderTasksList = tasks => {
    tasks.forEach(el => {
    const markup = `<li class="todo__task" id="${el.taskID}"><span class="checkbox"><span class="check">&check;</span></span>${el.taskName}${el.taskImportance ? '<span class="todo__importance">!!!</span>' : ''}<span class="todo__date">${el.taskDate}</span></li>`;
        tasksList.insertAdjacentHTML('beforeend', markup);
    });
};

const clearTasksList = () => tasksList.innerHTML = '';

const renderTasksHeader = (header) => {
    tasksHeader.innerHTML = header;
};

const renderTasksMessage = (message) => {
    tasksMessage.innerHTML = message;
};

// CONTROL

// MENU

Array.from(menuItems).forEach(el => el.addEventListener('click', e => {

    if(!e.target.classList.contains('menu__item--active')) {

        // mark chosen list
        Array.from(menuItems).forEach(el => el.classList.remove('menu__item--active'));
        e.target.classList.add('menu__item--active');

        // create an array with tasks depending on a category
        const UI = createTasksArray(e.target.id);
        
        // render header
        renderTasksHeader(UI.header);
        renderTasksMessage(UI.message);

        // clear todo section
        clearTasksList();

        // render todo section
        renderTasksList(UI.currentTasksList);

    };    
}));


// TODO

// new task

newTask.addEventListener('click', () => {

    // if plus sign 
    if (newTask.children[0].textContent === '+') {
        // change it to x sign
        newTask.children[0].textContent = 'x';
        // show new task box

        taskDate.value = getTodayDate();
        tasksList.style = 'margin-top: 3rem';
        newTaskForm.classList.add('todo__add-task--visible');

    } else {
        //change it to plus sign
        newTask.children[0].textContent = '+';
        // hide new task box
        newTaskForm.classList.remove('todo__add-task--visible');
        tasksList.style = 'margin-top: -8rem';
    }
});

addTask.addEventListener('click', e => {
    e.preventDefault();
    if (taskName.value) {

        tasks.push({taskName: taskName.value, taskDate: taskDate.value, taskImportance: taskImportance.checked, taskID: tasks.length, isDone: false});
        console.log(tasks);

        // create an array with tasks depending on a category
        const UI = createTasksArray(Array.from(menuItems)[Array.from(menuItems).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);

        // render header
        renderTasksHeader(UI.header);
        renderTasksMessage(UI.message);

        // clear todo section
        clearTasksList();

        // render todo section
        renderTasksList(UI.currentTasksList);

        taskName.value = '';
        taskDate.value = '';
        taskImportance.checked = false;
        chceckboxForm.children[0].classList.remove('check--show')
        newTask.children[0].textContent = '+';
        newTaskForm.classList.remove('todo__add-task--visible');
        tasksList.style = 'margin-top: -8rem';
    }
});

// checkboxes

tasksList.addEventListener('click', e => {
    const checkbox = e.target.closest('.checkbox');
    if (checkbox) {
        if (!checkbox.children[0].classList.contains('check--show')) {
            checkbox.children[0].classList.add('check--show');
            console.log(e.target.parentElement);
            tasks[parseInt(e.target.parentElement.id)].isDone = true;
            console.log(tasks[parseInt(e.target.parentElement.id)]);
            const UI = createTasksArray(Array.from(menuItems)[Array.from(menuItems).map(el => el.classList.contains('menu__item--active')).indexOf(true)].id);
            renderTasksMessage(UI.message);
            // clear todo section
            clearTasksList();

            // render todo section
            renderTasksList(UI.currentTasksList);
        }
        
    };
});

chceckboxForm.parentElement.addEventListener('click', () => chceckboxForm.children[0].classList.toggle('check--show'));
