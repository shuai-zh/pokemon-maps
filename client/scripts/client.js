(function ($) {
  $.postCSRF = function (to, message, callback) {
    message._csrf = $('#_csrf').val();
    $.post(to, message, callback);
  };
}(jQuery));
