$(() => {
    $("body").on("click",".list-group-item", function(event){
       console.log("Item clicked", $(this));
      //console.log("Output is",$(this)[0].innerText);
      $("#myModal").modal('show');
      $(".body-text")[0].innerText = $(this)[0].innerText;
      //console.log("ITEM is", $(".body-text"));
    });

});
