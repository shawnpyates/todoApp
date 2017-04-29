$(() => {
  //Strike through the task when the checkbox is checked
  $("body").on("click",".done", function(event){
    event.stopImmediatePropagation();
    $(this).parent().toggleClass("strikeOut");
  });
});
