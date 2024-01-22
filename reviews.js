$(document).ready(function () {
  $("[data-item^=list]").each(function () {
    var $this = $(this);
    var itemCount = $this.children().length;
    var itemNum = $this.attr("data-item").split("-")[1];
    if (itemCount > 5) {
      $this.addClass("collapsed");
      var hiddenChildren = itemCount - 5;
      $("[data-item=expand-" + itemNum + "]")
        .text("Pokaż wszystkie branże [" + hiddenChildren + "]")
        .show();
    }
  });

  $("[data-item^=expand]").click(function () {
    var $this = $(this);
    var expandNum = $(this).attr("data-item").split("-")[1];
    $("[data-item=list-" + expandNum + "]").removeClass("collapsed");
    $this.hide();
  });
});

$(document).ready(function () {
  $(".feed_box-bottom").each(function () {
    var $this = $(this);
    if ($this.find("a.w-condition-invisible").length == 1) {
      $this.find("a:not(.w-condition-invisible)").each(function () {
        var aElement = $(this)[0];
        var classes = aElement.classList;
        for (var i = 0; i < classes.length; i++) {
          if (classes[i] !== "button") {
            $(aElement).removeClass(classes[i]);
          }
        }
      });
    }
  });
});
