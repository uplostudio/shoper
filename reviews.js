$(document).ready(function () {
  var listContainer = $('*[fs-cmsload-element="list"]');
  var childrenCount = listContainer.children().length;
  var sumRate = 0,
    ratingElementsCount = 0;

  listContainer.find("*[data-rate]").each(function () {
    var rateValue = parseFloat($(this).text());
    if (!isNaN(rateValue)) {
      sumRate += rateValue;
      ratingElementsCount += 1;
    }
  });

  if (ratingElementsCount > 0) {
    var overallRating = sumRate / ratingElementsCount;
    $('*[data-item="overall"]').text(overallRating.toFixed(1));
  }

  $('*[data-item="review-count"]').text(childrenCount);

  $('[data-item^="list"]').each(function () {
    var listElementContainer = $(this);
    var listToSort = [];

    listElementContainer.find("span[fs-cmsfilter-field]").each(function () {
      var $this = $(this);
      var value = $this.data("value");
      var count = $(`div[fs-cmsfilter-element='list'] div[data-set='${value}']`).length;

      $this.next(".counter_span").text("[" + count + "]");

      if ($this.parent().parent().parent()) {
        listToSort.push({
          element: $this.parent().parent().parent(),
          count: count,
        });
      }
    });

    if (listToSort.length > 0) {
      listToSort.sort((a, b) => b.count - a.count);
      $.each(listToSort, (index, item) => listElementContainer.append(item.element));
    }

    var itemCount = listElementContainer.children().length;
    var itemNum = listElementContainer.attr("data-item").split("-")[1];

    if (itemCount > 5) {
      listElementContainer.addClass("collapsed");
      var hiddenChildren = itemCount - 5;

      var expandElement = $("[data-item=expand-" + itemNum + "]");

      if (expandElement) {
        expandElement.text("Pokaż wszystkie branże [" + hiddenChildren + "]").show();
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
