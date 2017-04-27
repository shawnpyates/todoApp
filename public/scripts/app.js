$(() => {
  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;
$('.listgroup').sortable({
    connectWith: '.listgroup',
    placeholder: 'placeholder',
  });
$(".add").on("click", function(event) {
//  console.log("field", $(".form-control"));
  const userInput = $(".form-control")[0].value;
  $(".form-control")[0].value = "";

// console.log("Input", $userInput);
renderTask(userInput);
});

function createElement(input){
  const $taskButton = `<button type="button" class="list-group-item">${input}</button>`
  return $taskButton;
}

function renderTask(input){

  $(".movies").append( createElement(input));
}


});
