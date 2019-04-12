$(function(){

  $('.planchoice.free').click(function(e){
    setFreePlan();
    $('#register-modal').reveal();
  });

  $('.planchoice.unmetered').click(function(e){
    setUnmeteredPlan();
    $('#register-modal').reveal();
  });
});
