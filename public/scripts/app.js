$(() => {
  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;

$(".list-group-item").on("click", function(event){
  console.log("Item clicked", $(this));
  console.log("Output is",$(this)[0].innerText);
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
