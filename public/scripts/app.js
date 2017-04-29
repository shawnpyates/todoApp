$(() => {



$(".add").on("click", function(event) {
//  console.log("field", $(".form-control"));
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
// console.log("Input", $userInput);

function renderTask(input){
  const $task = input.map(createElement).reverse();
  $(".movies").append($task);
}

function createElement(task){
  const taskName = task.name;
  // console.log("Task name", taskName);
  const $taskListitem = `<li class="list-group-item" data-task-id="${task.id}"><input class ="done" type="checkbox"><i class="glyphicon glyphicon-trash"></i>${taskName}</li>`;

  //$(".list-group-item").data('id',task.id);
  //console.log("taskListitem", ;
    //.data('id',task.id))
  return $taskListitem;
}

$("body").on("click",".done", function(event){
  // console.log("Checkbox done");
  event.stopImmediatePropagation();
  $(this).parent().toggleClass("strikeOut");
  // console.log("Element is", $(this).closest());
});

$("body").on("click", ".glyphicon.glyphicon-trash", function(event){
  event.stopImmediatePropagation();
  console.log("Deleted list item id", $(this).parent());
  $.ajax({
     // console.log("Deleted list item id", $(this).parent().data('id'));
        url: "/tasks/"+$(this).parent().data('task-id')+"?_method=DELETE",
        type: "DELETE",
        success: () => {
          console.log("success DELETE");
          console.log("Deleted list item is", $(this).parent());
            $(this).parent().remove();
        }
      });
})




loadTasks();


});
