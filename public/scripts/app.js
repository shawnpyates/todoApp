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
  function renderTask(tasks){
    tasks.forEach((task) => {
      const $task = createElement(task);
        console.log("TAsk is ", $($task));
        console.log("cat id", $($task).data("category-id"));
      //const $category = assignCategory($task);
      const cat_id = $($task).data("category-id");
      if (cat_id === 1) {
          $(".movies").append($task);
      } else if (cat_id === 2) {
          $(".books").append($task);
      } else if (cat_id === 3) {
          $(".restaurants").append($task);
      } else if (cat_id === 4) {
          $(".products").append($task);
      }else if (cat_id === 5) {
          // $(".errormessage").text() = "";
          // $(".errormessage").show();
          //$(".books").append($task);
      } else if (cat_id === 6) {
        // $(".errormessage").text() = "";
        // $(".errormessage").show();
          //$(".books").append($task);
      } else {

      }

    });
    // const $task = tasks.map(createElement).reverse();


    //$(".movies").append($task);
  }

  //Creates a new task list item
  function createElement(task){
    const taskName = task.name;
    const $taskListitem = `<li class="list-group-item" data-task-id="${task.id}" data-category-id="${task.categories_id}"><input class ="done" type="checkbox"><i class="glyphicon glyphicon-trash"></i>${task.name}</li>`;
    return $taskListitem;
  }

  // function assignCategory(task){
  //    if(){

  //    }
  // }

  loadTasks();
});
