$(() => {
  //Deletes the task on click
  $("body").on("click", ".glyphicon.glyphicon-pencil", function(event){
    event.stopImmediatePropagation();
    console.log("Edited list item id", $(this).parent());
  //     $(this).parent().hide();
  //     $('input[type="text"]').show().focus();
  //   $.ajax({
  //     url: "/tasks/"+$(this).parent().data('task-id')+"?_method=DELETE",
  //     type: "DELETE",
  //     success: () => {
  //       $(this).parent().remove();
  //     }
  //   });
  });

  // $(".modal-footer .btn-primary").on("click",function(event){
  //     $input = $(this).parent().sibling().find(".edit-input");
  //     console.log("Input",$input);
  //     $input.text
  //     $input.hide();
  //       dad.find('label').show();
  // })


});
