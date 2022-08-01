// Helper
const storage = {
    set: function(key, value) {
        const parsedValue = value ? JSON.stringify(value) : ""
        localStorage.setItem(key, parsedValue)
    },
    get: function(key) {
        const value = localStorage.getItem(key) || false 
        return value ? JSON.parse(value) : false
    }
}

function autoId() {
    const index = storage.get('lastIndex') || '1'
    const nextIndex = parseInt(index) + 1
    
    storage.set('lastIndex', nextIndex)
    
    return index
}

function ToDoList( id, task = "", isCompleted = false, isSelected = false ) {
    var self = this;
    self.task = ko.observable(task)
    self.isSelected = ko.observable(isSelected)
    self.id = id
    self.isCompleted = ko.observable(isCompleted)

    self.save = function() {
        const currentTasks = storage.get('tasks') || {}
        
        storage.set(
            'tasks',
            {
                ...currentTasks,                 
                [self.id]: {
                    task: self.task(),
                    isCompleted: self.isCompleted()
                }
            }
        ); 
    }

    self.task.subscribe(function() {
        self.save()
    })

    self.isCompleted.subscribe(function() {
        self.save()
    })

    setTimeout(function() {
        self.isSelected(true)
    }, 100)
}

function ToDoListViewModel() {
    var self = this
    self.tasks = ko.observableArray([])

    self.addTask = function( id, task = "", isCompleted = false, isSelected = false ) {
        let currentId = ""
        
        if(id)
            currentId = id
        else
            currentId = autoId()
        
        self.tasks.push(new ToDoList(currentId, task, isCompleted, isSelected))
    }

    self.removeTask = function(task) {
        const currentTasks = storage.get('tasks') || {}
        const clickedTaskId = task.id

        if( currentTasks[clickedTaskId] ) {
            delete currentTasks[clickedTaskId]
        }

        self.tasks.remove(task)
        storage.set('tasks', currentTasks)
    }
    
    function addTaskOnKeyboard(event) {
        if(event.key == 'Enter') {
            return self.addTask()
        }
    }

    const tasks = storage.get('tasks') || {}

    Object.keys(tasks).forEach(function(taskId){
        const task = tasks[taskId]
        self.addTask(taskId, task.task, task.isCompleted, false)
    })
    
    document.addEventListener('keydown', addTaskOnKeyboard) 
}

ko.applyBindings(new ToDoListViewModel())