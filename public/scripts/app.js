$(() => {

$(".list-group-item").on("click", function(event){
  console.log("Item clicked", $(this));
  console.log("Output is",$(this)[0].innerText);
  $("#myModal").modal('show');
  $(".body-text")[0].innerText = $(this)[0].innerText;
  console.log("ITEM is", $(".body-text"));
})
$( "#list-group1, #list-group2, #list-group3, #list-group4" ).sortable({
      connectWith: ".sorted"
    }).disableSelection();

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
  console.log("Task element", $task)
  $(".movies").append($task);
}

function createElement(task){
  console.log("Task obj", task);
  const taskName = task.name;
  console.log("Task name", taskName);
  const $taskButton = `<li class="list-group-item"><input type="checkbox">${taskName}</button>`
  return $taskButton;
}




});
