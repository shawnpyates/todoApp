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
  $(".form-control")[0].value = "";

// console.log("Input", $userInput);
renderTask(userInput);
});

function createElement(input){
  const $taskButton = `<li class="list-group-item">${input}</button>`
  return $taskButton;
}

function renderTask(input){

  $(".movies").append( createElement(input));
}


});
