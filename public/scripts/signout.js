$(() => {
  $(".navbar-btn").on("click", function(event){
    $.ajax({
      url: "/logout",
      method: "POST",
      data: null,
      success: function() {
      }
    });
  })
})
