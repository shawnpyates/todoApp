$(() => {
  //Deletes the task on click
  $("body").on("click", ".glyphicon.glyphicon-pencil", function(event){
    event.stopImmediatePropagation();
    console.log("Edited list item id", $(this).parent());
  });
});
