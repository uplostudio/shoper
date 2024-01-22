$(document).ready(function () {
  $('[data-item^="list"]').each(function () {
    var listContainer = $(this);
    var listToSort = [];

    listContainer.find("span[fs-cmsfilter-field]").each(function () {
      var $this = $(this);
      var value = $this.data("value");
      var count = $(`div[fs-cmsfilter-element='list'] div[data-set='${value}']`).length;

      $this.next(".counter_span").text("[" + count + "]");
      console.log($this[0].length);

      if ($this.parent().parent().parent()) {
        listToSort.push({
          element: $this.parent().parent().parent(),
          count: count,
        });
      }
    });

    if (listToSort.length > 0) {
      listToSort.sort((a, b) => b.count - a.count);
      $.each(listToSort, (index, item) => listContainer.append(item.element));
    }
  });

  $("[data-item^=list]").each(function () {
    var $this = $(this);
    var itemCount = $this.children().length;
    var itemNum = $this.attr("data-item").split("-")[1];

    if (itemCount > 5) {
      $this.addClass("collapsed");
      var hiddenChildren = itemCount - 5;

      if ($("[data-item=expand-" + itemNum + "]")) {
        $("[data-item=expand-" + itemNum + "]")
          .text("Pokaż wszystkie branże [" + hiddenChildren + "]")
          .show();
      }
    }
  });

  $("[data-item^=expand]").click(function () {
    var $this = $(this);
    var expandNum = $this.attr("data-item") ? $this.attr("data-item").split("-")[1] : "";

    if (expandNum) {
      $("[data-item=list-" + expandNum + "]").removeClass("collapsed");
      $this.hide();
    }
  });

  $(".feed_box-bottom").each(function () {
    var $this = $(this);

    if ($this.find("a.w-condition-invisible").length == 1) {
      $this.find("a:not(.w-condition-invisible)").each(function () {
        var aElement = $(this);
        var classes = aElement.prop("classList") || [];

        classes.forEach(function (classItem) {
          if (classItem !== "button") {
            aElement.removeClass(classItem);
          }
        });
      });
    }
  });
});
