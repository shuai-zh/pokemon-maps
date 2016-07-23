(function ($) {
  $.postCSRF = function (to, message, callback) {
    message._csrf = $('#_csrf').val();
    return $.post(to, message, callback);
  };
}(jQuery));

window.MAP_MAX_LEVEL = 17;
window.MAP_RESOLUTION = 1.194328566955879;
