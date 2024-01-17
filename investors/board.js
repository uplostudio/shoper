/*
 * File used for controlling the display of board members' modals on the page.
 * The operation principle is based on handling clicks on individual elements,
 * which are fetched using appropriate attributes.
 */

$(document).ready(function () {
  var targetNode = document.querySelector(".board_modal");
  var observer = new MutationObserver(function () {
    var style = window.getComputedStyle(targetNode);
    var display = style.getPropertyValue("display");
    $("body").css("overflow", display == "flex" ? "hidden" : "auto");
  });
  observer.observe(targetNode, { attributes: true, childList: false, subtree: false });
});
