function ToDoList(task) {
    var self = this;
    this.task = ko.observable(task)

}

function ToDoListViewModel() {
    var self = this

    self.tasks = ko.observableArray([
    ])

    self.addTask = function() {
        self.tasks.push(new ToDoList(""))
    }

    self.removeTask = function(task) {
        self.tasks.remove(task)
    }
}

ko.applyBindings(new ToDoListViewModel())