//adds content to the modal when clicked
$(() => {
    $("body").on("click",".list-group-item", function(event){
      $("#myModal").modal('show');
      $(".body-text > span").text($(this).text());
      $(".modal-title").text($(this).text());
      $(".body-text > span").text($(this).data('description'));
      $(".link").find("a").attr('href', $(this).data('link'));
    });
});
