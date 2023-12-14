'use strict'

// global variables

const appContainer = document.querySelector('.app-container')

const toDoInput = document.querySelector('#to-do-input')
const toDoList = document.querySelector('.to-do-list')

const itemsLeft = document.querySelector('.items-left')

const allItems = document.querySelector('#all-items')
const activeItems = document.querySelector('#active-items')
const completedItems = document.querySelector('#completed-items')

const filters = document.querySelectorAll('.filters-wrapper input')

const removeAllCompletedItems = document.querySelector('.remove-items-wrapper')

const screenToggle = document.querySelector('.screen-toggle')

const toDoArr = JSON.parse(window.localStorage.getItem("task")) || []

class ToDo {
    constructor(_desc) {
        this.desc = _desc
        this.id = this.id = new Date().valueOf()
        this.completed = false
    }
}

// create an li func 

const renderToDo = (itemId, itemDesc, container) => {

    const newLi = document.createElement('li')
    newLi.setAttribute('draggable', "true")
    newLi.innerHTML = `
                        <label>
                            <input type="checkbox" class="checkbox" id=${itemId}>
                             <span>${itemDesc}</span>
                        </label>
                            <img class="remove-icon" src="./images/icon-cross.svg" alt="icon-cross">
                        `
    if (this.completed) {
        newLi.classList.add('completed');
    }

    container.appendChild(newLi)
}

// submit func 

const handleSubmit = (ev) => {
    const toDoInputValue = toDoInput.value.trim()

    if (toDoInputValue === '') {
        return
    } else if (ev.keyCode === 13) {
        const newToDo = new ToDo(toDoInputValue)
        toDoArr.push(newToDo)

        toDoInput.value = ''
        toDoList.innerHTML = ''

        saveToLocalStorage(toDoArr)

        toDoArr.forEach(item => {
            renderToDo(item.id, item.desc, toDoList)
        })

        console.log(toDoArr)
    }

    dragList()
}

// li status handler func 

const handleStatus = (ev) => {
    const liElement = ev.target.closest('li');

    if (ev.target.type === 'checkbox') {
        const checkbox = ev.target
        const itemId = +checkbox.id

        const todoItem = toDoArr.find(item => item.id === itemId);

        if (todoItem) {

            if (todoItem.completed) {
                liElement.classList.add('completed')
            }

            todoItem.completed = !todoItem.completed

            liElement.classList.toggle('completed', todoItem.completed)
        }

        dragList()
        saveToLocalStorage(toDoArr)
    }
}

// li delete handler func 

const handleDelete = (ev) => {

    if (ev.target.classList.contains('remove-icon')) {
        const listItem = ev.target.closest('li');

        if (listItem) {
            const checkbox = listItem.querySelector('.checkbox');
            const itemId = +checkbox.id;

            const itemToRemove = toDoArr.findIndex(item => item.id === itemId)

            if (itemToRemove !== -1) {
                toDoArr.splice(itemToRemove, 1)

                listItem.remove()
                console.log(toDoArr)

                saveToLocalStorage(toDoArr)
            }
        }
    }

    dragList()
}

// delete all completed items func 

const handleDeleteAllCompletedItems = () => {
    const listedItems = document.querySelectorAll('li')

    listedItems.forEach(item => {
        if (item.classList.contains('completed')) {
            const checkbox = item.querySelector('.checkbox');
            const itemId = +checkbox.id;

            const itemToRemove = toDoArr.findIndex(item => item.id === itemId)

            if (itemToRemove !== -1) {
                toDoArr.splice(itemToRemove, 1)


                toDoList.innerHTML = ''

                saveToLocalStorage(toDoArr)

                toDoArr.forEach(item => {
                    renderToDo(item.id, item.desc, toDoList)
                })
                console.log(toDoArr)
            }
        }
    })
}

// update items left counter

const handleItemsLeft = () => {
    const listedItems = document.querySelectorAll('li')
    let itemsLeftSum = 0

    listedItems.forEach(item => {
        if (!item.classList.contains('completed')) {
            itemsLeftSum += 1
        }
    })

    itemsLeft.textContent = itemsLeftSum
}

// filters handler func

const handleFilters = (ev) => {
    const allToDoItems = document.querySelectorAll('li')
    console.log(allToDoItems)

    if (ev.target.id === "all-items") {
        allToDoItems.forEach(item => {
            item.style.display = 'flex'
        })
    }
    else if (ev.target.id === "active-items") {
        allToDoItems.forEach(item => {
            if (!item.classList.contains('completed')) {
                item.style.display = 'flex'
            } else {
                item.style.display = 'none'
            }
        })
    }
    else if (ev.target.id === "completed-items") {
        allToDoItems.forEach(item => {
            if (item.classList.contains('completed')) {
                item.style.display = 'flex'
            } else {
                item.style.display = 'none'
            }
        })
    }
    console.log(ev.target.id)
    dragList()
}

// li drag&drop func

function dragList() {
    const taskToDrag = document.querySelectorAll('li')

    taskToDrag.forEach(tsk => {
        tsk.addEventListener('dragstart', () => {
            tsk.classList.add('dragging')
            console.log('start dragging')
        })

        tsk.addEventListener('dragend', () => {
            tsk.classList.remove('dragging')
            console.log('end drag')
        })
    })
}

// save items in local storage

function saveToLocalStorage(arr) {
    window.localStorage.setItem("task", JSON.stringify(arr));
}

dragList()

// li sorting func

const handleSorting = (ev) => {
    const draggingItem = document.querySelector('.dragging')

    if (draggingItem) {
        const notDraggingItems = [...document.querySelectorAll('li:not(.dragging)')]

        let itemBelow = notDraggingItems.find(item => {
            return ev.clientY <= item.offsetTop + item.offsetHeight / 2;
        })

        if (itemBelow) {
            toDoList.insertBefore(draggingItem, itemBelow);
        }
    }
}

// event listeners 

toDoInput.addEventListener('keyup', (ev) => {
    handleSubmit(ev)
    handleItemsLeft()
})

toDoList.addEventListener('click', handleStatus)
toDoList.addEventListener('click', handleDelete)

removeAllCompletedItems.addEventListener('click', handleDeleteAllCompletedItems)

toDoList.addEventListener('click', handleItemsLeft)

filters.forEach(filter => {
    filter.addEventListener('change', (ev) => {
        handleFilters(ev)
    })
})

screenToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark')
    appContainer.classList.toggle('dark')

    if (document.body.classList.contains('dark')) {
        screenToggle.src = './images/icon-sun.svg'
    } else {
        screenToggle.src = './images/icon-moon.svg'
    }
})

toDoList.addEventListener('dragover', handleSorting)

window.addEventListener('load', () => {
    toDoArr.forEach(item => {
        renderToDo(item.id, item.desc, toDoList)
        dragList()
    })
})

