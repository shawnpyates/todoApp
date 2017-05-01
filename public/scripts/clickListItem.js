$(() => {
    $("body").on("click",".list-group-item", function(event){
       console.log("Item clicked", $(this));
      //console.log("Output is",$(this)[0].innerText);
      $("#myModal").modal('show');
      $(".body-text > span").text($(this).text());
          //console.log($("task").text(), $(task).data('link'), $(task).data('description'));
    console.log("modal body", $(".modal-title"), $(".body-text > span"));
    $(".modal-title").text($(this).text());
    $(".body-text > span").text($(this).data('description'));
    $(".link").find("span").text($(this).data('link'));
      //console.log("ITEM is", $(".body-text"));
    });

});
