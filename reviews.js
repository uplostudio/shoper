$(document).ready(function () {
  initializeListContainer();
  expandOnClick();
  feedBoxBottomClassHandler();
  $('[data-item^="list"]').each(function () {
    handleList($(this), true);
  });
});

// Initializing List Container Attributes;
function initializeListContainer() {
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
    handleRating(sumRate, ratingElementsCount);
  }

  $('*[data-item="review-count"]').text(childrenCount);
}

// Rate Handler to manage ratings
function handleRating(sumRate, ratingElementsCount) {
  var overallRating = sumRate / ratingElementsCount;
  $('*[data-item="overall"]').text(overallRating.toFixed(1));

  var roundedRating = Math.round(overallRating);
  if (roundedRating > 1) {
    var star = $('[data-item="star"]').first();
    for (var i = 1; i < roundedRating; i++) {
      star.clone().insertAfter(star);
    }
  }
}

function processList(listElementContainer, isInitialLoad) {
  var listToSort = [];

  processListItem(listElementContainer, listToSort, isInitialLoad);

  return listToSort;
}

function handleList(listElementContainer, isInitialLoad) {
  var listToSort = processList(listElementContainer, isInitialLoad);
  handleVisibilityAndExpansion(listElementContainer, listToSort);
}

function handleDataItemList() {
  processList();
  handleList();
}

// Process each list item
function processListItem(listElementContainer, listToSort, isInitialLoad) {
  listElementContainer.find("span[fs-cmsfilter-field]").each(function () {
    var $this = $(this);
    var value = $this.data("value");
    var count = $(`div[fs-cmsfilter-element='list'] div[data-set='${value}']`).length;

    $this.next(".counter_span").text("[" + count + "]");

    var closestListItem = $this.closest('[role="listitem"]');
    if (count === 0) {
      if (isInitialLoad) {
        closestListItem.css("display", "none");
      } else {
        closestListItem.css({
          opacity: "0.4",
          "pointer-events": "none",
        });
      }
    } else {
      closestListItem.css({
        display: "",
        opacity: "",
        "pointer-events": "",
      });
    }

    if ($this.parent().parent().parent()) {
      listToSort.push({
        element: $this.parent().parent().parent(),
        count: count,
      });
    }
  });
}

// Sort and handle visibility of list items
function handleVisibilityAndExpansion(listElementContainer, listToSort) {
  if (listToSort.length > 0) {
    listToSort.sort((a, b) => b.count - a.count);
    $.each(listToSort, (index, item) => listElementContainer.append(item.element));
  }

  var itemCount = listElementContainer.children(":visible").length;
  var itemNum = listElementContainer.attr("data-item").split("-")[1];
  var hiddenChildren = itemCount - 5;
  var expandElement = $("[data-item=expand-" + itemNum + "]");

  if (hiddenChildren < 1 || expandElement.data("wasExpanded")) {
    expandElement.hide();
  } else if (itemCount > 5) {
    listElementContainer.addClass("collapsed");
    handleExpandElementText(itemNum, hiddenChildren, expandElement);
  }
}

// Update expandElement's text
function handleExpandElementText(itemNum, hiddenChildren, expandElement) {
  var expandText = itemNum === "1" ? "wszystkie branże" : "wszystkie rozwiązania";
  expandElement.text(`Pokaż ${expandText} [${hiddenChildren}]`).show();
}

// Expand onClick
function expandOnClick() {
  $("[data-item^=expand]").click(function () {
    var $this = $(this);
    var expandNum = $this.attr("data-item") ? $this.attr("data-item").split("-")[1] : "";
    if (expandNum) {
      $this.data("wasExpanded", true);
      $("[data-item=list-" + expandNum + "]").removeClass("collapsed");
      $this.hide();
    }
  });
}

// Feed Box Bottom Class Handler
function feedBoxBottomClassHandler() {
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
}

// Observe when list is being changed

function observeNodeChange(targetSelector, onNodeChange) {
  var targetNode = document.querySelector(targetSelector);
  var config = {
    childList: true,
    subtree: true,
  };

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        onNodeChange(mutation);
      }
    });
  });

  observer.observe(targetNode, config);
  return observer;
}

var observer = observeNodeChange('[fs-cmsfilter-element="list"]', function (mutation) {
  $('[data-item^="list"]').each(function () {
    handleList($(this), false);
  });
});
