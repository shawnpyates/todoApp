$(() => {


$( "#list-group1, #list-group2, #list-group3, #list-group4" ).sortable({
      connectWith: ".sorted"
    }).disableSelection();
});
