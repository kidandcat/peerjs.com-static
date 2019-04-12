$(function() {
  $("#register-modal input").keypress(function(e) {
    if (e.which == 13) {
      $("#complete-register").click();
    }
  });

  $("#login-box input").keypress(function(e) {
    if (e.which == 13) {
      $("#complete-login").click();
    }
  });

  $("#reset-modal input").keypress(function(e) {
    if (e.which == 13) {
      $("#complete-reset").click();
    }
  });

  $("#account-link").click(function() {
    $(this).addClass("active");
    $("#account-menu").show();
    return false;
  });
  $(document).click(function() {
    $("#account-link").removeClass("active");
    $("#account-menu").hide();
  });

  $("#reset-password-link").click(function() {
    $(".close-reveal-modal").click();
    setTimeout(function() {
      $("#reset-modal").reveal();
    }, 100);
  });

  $("#complete-register").click(function() {
    var type = $("#type").val();
    if (type !== "free-plan" && $("#payment").val() == "") {
      StripeCheckout.open({
        key: "pk_0A8x7oqLXhsVd0b9QG6objJUrevbA",
        amount: 0,
        name: "PeerServer Cloud",
        description: "Unmetered Beta - $25.00/month",
        panelLabel: "Subscribe - Free for 7 days",
        token: function(res) {
          $("#payment").val(res.id);
          $("#payment_meta").val(res.card.type + " - " + res.card.last4);
          submitRegister();
        }
      });
    } else {
      submitRegister();
    }
    return false;
  });

  $("#complete-login").click(submitLogin);
  $("#complete-reset").click(submitReset);

  // Default to free plan
  setFreePlan();
});

function setUnmeteredPlan() {
  $(".free-plan").hide();
  $(".unmetered-plan").show();
  $("#complete-register").text("Pay and Complete Registration");
  $("#type").val("unmetered-plan");
  $("#payment").val("");
  $("#payment_meta").val("");
}

function setFreePlan() {
  $(".free-plan").show();
  $(".unmetered-plan").hide();
  $("#complete-register").text("Complete Registration");
  $("#type").val("free-plan");
  $("#payment").val("free");
  $("#payment_meta").val("No credit card");
}

function submitRegister() {
  if ($("#password").val() !== $("#confirm").val()) {
    $("#register-modal .error-msg")
      .text("Password and confirmation do not match")
      .show();
    return;
  }
  $.post(
    "/register",
    {
      name: $("#name").val(),
      email: $("#email").val(),
      password: $("#password").val(),
      type: $("#type").val(),
      payment: $("#payment").val(),
      payment_meta: $("#payment_meta").val()
    },
    function(res) {
      if (res.error) {
        $("#register-modal .error-msg")
          .text(res.error)
          .show();
      } else if (res.success) {
        window.location = "/dash";
      } else {
        $("#register-modal .error-msg")
          .text("Unknown error")
          .show();
      }
    }
  );
}

function submitReset() {
  $.post(
    "/login/reset",
    {
      email: $("#reset_email").val()
    },
    function(res) {
      if (res.error) {
        $("#reset-modal .error-msg")
          .text(res.error)
          .show();
      } else if (res.success) {
        window.location = "/login/reset";
      } else {
        $("#reset-modal .error-msg")
          .text("Unknown error")
          .show();
      }
    }
  );
}
