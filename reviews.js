// Simplifying global definition
var resetElement;

// Document ready
$(document).ready(function () {
  initializeResetElement();
  resetElement.hide();
  
  initializeListContainer();
  expandOnClick(); // Bind expand click events
  feedBoxBottomClassHandler();
  initializeListElements(true);

  // MutationObserver
  observeNodeChange('[fs-cmsfilter-element="list"]', function () {
    initializeResetElement();
    initializeListElements(false);

    if ($('.filters2_tags-wrapper').children().length > 0) {
      resetElement.show();
    } else {
      resetElement.hide();
    }

    expandOnClick(); // Re-bind expand click events
  });
});

// Function to initialize resetElement
function initializeResetElement() {
  resetElement = $("[fs-cmsfilter-element='reset']");
}

// Function to initialize list elements and handle list
function initializeListElements(isInitialLoad) {
  $('[data-item^="list"]').each(function () {
    handleList($(this), isInitialLoad);
  });
}

// Initializing List Container Attributes
function initializeListContainer() {
  var listContainer = $('*[fs-cmsload-element="list"]');
  var childrenCount = listContainer.children().length;
  var sumRate = 0, ratingElementsCount = 0;

  listContainer.find("[data-rate]").each(function () {
    var rateValue = parseFloat($(this).text());
    if (!isNaN(rateValue)) {
      sumRate += rateValue;
      ratingElementsCount += 1;
    }
  });

  if (ratingElementsCount > 0) {
    handleRating(sumRate, ratingElementsCount);
  }

  $('[data-item="review-count"]').text(childrenCount);
}

// Rate Handler to manage ratings
function handleRating(sumRate, ratingElementsCount) {
  var overallRating = sumRate / ratingElementsCount;
  $('[data-item="overall"]').text(overallRating.toFixed(1));

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

function processListItem(listElementContainer, listToSort, isInitialLoad) {
  listElementContainer.find("span[fs-cmsfilter-field]").each(function () {
    var $this = $(this);
    var value = $this.data("value");
    var count = $(`div[fs-cmsfilter-element='list'] div[data-set='${value}']`).length;

    $this.next(".counter_span").text("[" + count + "]");

    var closestListItem = $this.closest('[role="listitem"]');
    
    if ($this.parent().parent().parent()) {
      listToSort.push({
        element: $this.parent().parent().parent(),
        count: count,
      });
    }
  });
}

function handleVisibilityAndExpansion(listElementContainer, listToSort) {
  if (listToSort.length > 0) {
    listToSort.sort((a, b) => b.count - a.count);
    $.each(listToSort, (index, item) => listElementContainer.append(item.element));
  }

  var itemCount = listElementContainer.children(":visible").length;
  var itemNum = listElementContainer.attr("data-item").split("-")[1];
  var hiddenChildren = itemCount - 5; // Number of hidden items
  var expandElement = $("[data-item=expand-" + itemNum + "]");

  // Always keep expandElement visible
  expandElement.show();

  if (hiddenChildren < 1 || expandElement.data("wasExpanded")) {
    expandElement.text("Pokaż mniej"); // Default to "Show Less" if all are expanded
  } else if (itemCount > 5) {
    listElementContainer.addClass("collapsed");
  }
}

// Expand onClick
function expandOnClick() {
  $("[data-item^=expand]").off('click').on('click', function (event) {
    event.preventDefault();
    var $this = $(this);
    var expandNum = $this.attr("data-item") ? $this.attr("data-item").split("-")[1] : "";
    var listElement = $("[data-item=list-" + expandNum + "]");

    if (expandNum) {
      var wasExpanded = $this.data("wasExpanded");

      if (wasExpanded) {
        // Collapse the list
        listElement.addClass("collapsed");
        $this.data("wasExpanded", false);
        $this.text("Pokaż więcej"); // Update text to "Show more"
      } else {
        // Expand the list
        listElement.removeClass("collapsed");
        $this.data("wasExpanded", true);
        $this.text("Pokaż mniej"); // Update text to "Show less"
      }
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
