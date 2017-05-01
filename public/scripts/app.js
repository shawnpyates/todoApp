$(() => {
  //Invoked when the user adds task and add button is clicked
  $(".add").on("click", function(event) {
    const userInput = $(".form-control")[0].value;
    if(!userInput.length){
      $(".message > span").css('visibility', 'visible');
       $(".message > span").text("Input cannot be blank");
     }
      else if(userInput.length > 50){
      $(".message > span").css('visibility', 'visible');
       $(".message > span").text("Input has exceeded the max. word limit");
     }
       else {
        $.ajax({
          url: "/tasks",
          method: "POST",
          data: {"name": userInput},
          success: function() {
            $(".form-control")[0].value = "";
            loadTasks();
          }
        });
      }
  });

  $(".form-control").on("focus",function(e){
    $(".message > span").css('visibility', 'hidden');
  })
  //Makes a GET request to get the json object of the data and passes the data to renderTask
  function loadTasks(){
    $.ajax({
      url: "/tasks",
      method: "GET",
      success: function(data) {
        $(".movies").empty();
        $(".books").empty();
        $(".products").empty();
        $(".restaurants").empty();
        renderTask(data);
      }
    });
  }

  //Once it gets the data, passes each task data to the createElement and on recieve the element appends it to the corresponding list group
  function renderTask(tasks){
    tasks.forEach((task) => {
      const $task = createElement(task);
      const cat_id = $($task).data("category-id");
      const link = $($task).data("link");
      const desc = $($task).data("description");
      if (cat_id === 1) {
        $(".movies").prepend($task);
      } else if (cat_id === 2) {
        $(".books").prepend($task);
      } else if (cat_id === 3) {
        $(".restaurants").prepend($task);
      } else if (cat_id === 4) {
        $(".products").prepend($task);
      } else if (cat_id === 5) {
        $(".message > span").text("Found Results in both Books and Movies, please select your preferred category");
        appendtoCategory($task);
      } else if (cat_id === 6) {
        $(".message > span").text("Could not categorize, please select your preferred category");
        appendtoCategory($task);
      } else {
        $(".message > span").text("Try again later, connection problem seems to apear");
          $.ajax({
            url: "/tasks/"+$($task).data('task-id')+"?_method=DELETE",
            type: "DELETE",
            success: () => {
            }
          });
      }
    });
  }

  //Creates a new task list item
  function createElement(task){
    const taskName = task.name;
    const $taskListitem = `<li class="list-group-item" data-task-id="${task.id}" data-category-id="${task.categories_id}" data-description="${task.description}" data-link="${task.link}"><input class ="done" type="checkbox"><i class="glyphicon glyphicon-trash"></i>${task.task_name}</li>`;
    return $taskListitem;
  }

//When clicked on the category heading, appends the task element to the corresponding category
  function appendtoCategory($taskElement){
    $(".message >span").css('visibility', 'visible');
    const $task = $taskElement;
    $(".listContainer").on("click", function(event){
      $.ajax({
        url: "/tasks/"+$($task).data('task-id')+"?_method=PUT",
        method: "PUT",
        data : {id: $($task).data("task-id"), cat_id: $(event.target).siblings().data('id')},
        success: () => {
          $(".message > span").css('visibility', 'hidden');
          $(event.target).siblings().prepend($task);
        }
      });
      $(".listContainer").unbind();
    });
  }

  loadTasks();
});
