$(() => {
  //Invoked when the user adds task and add button is clicked
  $(".add").on("click", function(event) {
    const userInput = $(".form-control")[0].value;
    console.log(userInput);
    $.ajax({
          url: "/tasks",
          method: "POST",
          data: {"name": userInput},
          success: function() {
            console.log("success POST");
            $(".form-control")[0].value = "";
            loadTasks();
          }
    });
  });
  //Makes a GET request to get the json object of the data and passes the data to renderTask
  function loadTasks(){
    $.ajax({
      url: "/tasks",
      method: "GET",
      success: function(data) {
        $(".movies").empty();
        renderTask(data);
      }
    });
  }

  //Once it gets the data, passes each task data to the createElement and on recieve the element appends it to the corresponding list group
  function renderTask(input){
    const $task = input.map(createElement).reverse();
    $(".movies").append($task);
  }

  //Creates a new task list item
  function createElement(task){
    const taskName = task.name;
    const $taskListitem = `<li class="list-group-item" data-task-id="${task.id}"><input class ="done" type="checkbox"><i class="glyphicon glyphicon-trash"></i>${taskName}</li>`;
    return $taskListitem;
  }

  loadTasks();
});
