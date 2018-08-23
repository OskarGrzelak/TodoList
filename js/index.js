const menuItems = document.querySelectorAll('.menu__item');
const newTask = document.querySelector('#new-task');
const newTaskForm = document.querySelector('.todo__add-task');
const taskName = document.querySelector('#task-name');
const taskDate = document.querySelector('#task-date');
const addTask = document.querySelector('#add-task');
const tasksList = document.querySelector('.todo__list');
const checkboxes = document.querySelectorAll('.checkbox');

const tasks = [];

// MENU

Array.from(menuItems).forEach(el => el.addEventListener('click', e => {

    // mark chosen list

    if(!e.target.classList.contains('menu__item--active')) {
        Array.from(menuItems).forEach(el => el.classList.remove('menu__item--active'));
        e.target.classList.add('menu__item--active');
    };

    // render todo section

    
}));


// TODO

// new task

newTask.addEventListener('click', () => {

    // if plus sign 
    if (newTask.children[0].textContent === '+') {
        // change it to x sign
        newTask.children[0].textContent = 'x';
        // show new task box
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth()+1; //January is 0!
        let year = today.getFullYear();

        if(day<10) {
            day = '0'+day
        } 

        if(month<10) {
            month = '0'+month
        }

        today = `${year}-${month}-${day}`;

        taskDate.value = today;
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

        tasks.push({taskName: taskName.value, taskDate: taskDate.value, taskImportance: false});
        console.log(tasks);

        const markup = `<li class="todo__task"><span class="checkbox"><span class="check">&check;</span></span>${taskName.value}<span class="todo__date">${taskDate.value}</span></li>`;
        tasksList.insertAdjacentHTML('beforeend', markup);
        taskName.value = '';
        taskDate.value = '';
        newTask.children[0].textContent = '+';
        newTaskForm.classList.remove('todo__add-task--visible');
        tasksList.style = 'margin-top: -8rem';
    }
});

// checkboxes

tasksList.addEventListener('click', e => {
    const checkbox = e.target.closest('.checkbox');
    if (checkbox) {
        checkbox.children[0].classList.toggle('check--show');
    };
});