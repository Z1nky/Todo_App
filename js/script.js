// data array todo
const todos = [];

// Custom Event
const RENDER_EVENT = 'render-todo';

// local Storage 
const STORAGE_KEY = 'todosJS';

/**
 * Check local storage on browser
 * @returns boolean 
 */

const isStorageExist = () => {
    if (typeof Storage === undefined) {
        alert('Browser not support local storage!');
        return false;
    };
    return true;
}

/**
 * load data from local storage
 * and entering result data parsing to variabel @see todos
 */

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        };
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
    };
};

const generateID = () => {
    return +new Date();
};

const generateTodoObject = (id, task, date, isCompleted) => {
    return {
        id,
        task,
        date,
        isCompleted
    };
};

/**
 * find todo by id
 * @param {*} todoId 
 * @returns {Object} todo object
 */

const findTodo = (todoId) => {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        };
    };
    return null;
};

/**
 * find todo index
 * @param {*} todoId 
 * @returns {number} index
 */

const findTodoIndex = (todoId) => {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        };
    };
    return null;
};

/**
 * Push object todo to todos
 */

const addTodo = () => {
    const taskInput = document.getElementById('task').value;
    const dateInput = document.getElementById('date').value;

    const generateId = generateID();
    const todoObject = generateTodoObject(generateId, taskInput, dateInput, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    Swal.fire({
        title: "Succes add Todo!",
        icon: "success",
        draggable: true
    });
};


/**
 * Move Todo to completed
 * @param {*} todoId 
 */

const addToCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);

    if (todoTarget === null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    Swal.fire({
        title: "Todo is Completed!",
        icon: "success",
        draggable: true
    });
};

/**
 * undo from completed
 * @param {*} todoId 
 */

const undoFromCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);

    if (todoTarget === null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    Swal.fire({
        title: "Undo Todo!",
        icon: "success",
        draggable: true
    });
}

/**
 * Delete todo from completed
 * @param {*} todoId 
 */

const deleteFromCompleted = (todoId) => {
    const todoIndexTarget = findTodoIndex(todoId);

    if (todoIndexTarget === null) return;

    todos.splice(todoIndexTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

/**
 * Create Todo Item 
 * @param {*} todoObject 
 * @returns Component Item
 */

const makeTodo = (todoObject) => {
    const taskText = document.createElement('h3');
    taskText.classList.add('headline-3');
    taskText.innerText = todoObject.task;

    const dateText = document.createElement('p');
    dateText.classList.add('text-sm');
    dateText.innerText = todoObject.date;

    const textItem = document.createElement('div');
    textItem.classList.add('text-item');
    textItem.append(taskText, dateText);

    const todoContainer = document.createElement('div');
    todoContainer.classList.add('item');
    todoContainer.append(textItem);

    /**
     * Condition Check or unCheck
     */

    if (!todoObject.isCompleted) {
        const buttonCheck = document.createElement('button');
        buttonCheck.classList.add('check-button');

        buttonCheck.addEventListener('click', () => {
            addToCompleted(todoObject.id);
        })

        todoContainer.append(buttonCheck);
    } else {
        const buttonUndo = document.createElement('button');
        buttonUndo.classList.add('undo-button');

        buttonUndo.addEventListener('click', () => {
            undoFromCompleted(todoObject.id);
        });

        const buttonTrash = document.createElement('button');
        buttonTrash.classList.add('trash-button');

        buttonTrash.addEventListener('click', () => {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#C5BAFF",
                cancelButtonColor: "#EB5A3C",
                confirmButtonText: "Yes"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteFromCompleted(todoObject.id);
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your todo has been deleted.",
                        icon: "success"
                    });
                }
            });
        });

        todoContainer.append(buttonUndo, buttonTrash);
    };

    return todoContainer;
};


document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();

        submitForm.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, () => {
    const unCompletedTodo = document.getElementById('todo');
    unCompletedTodo.innerHTML = '';

    const completedTodo = document.getElementById('completed-todo');
    completedTodo.innerHTML = '';

    for (const todoItem of todos) {
        const todoCard = makeTodo(todoItem);

        if (todoItem.isCompleted) {
            completedTodo.append(todoCard);
        } else {
            unCompletedTodo.append(todoCard);
        };
    };
});
