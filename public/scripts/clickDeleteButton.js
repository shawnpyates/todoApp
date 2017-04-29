$(() => {
  //Deletes the task on click
  $("body").on("click", ".glyphicon.glyphicon-trash", function(event){
    event.stopImmediatePropagation();
    console.log("Deleted list item id", $(this).parent());
    $.ajax({
      url: "/tasks/"+$(this).parent().data('task-id')+"?_method=DELETE",
      type: "DELETE",
      success: () => {
        $(this).parent().remove();
      }
    });
  });
});
