class Accordion {
  speed = 400;
  oneOpen = false;
  accordionId = "";
  style = false;

  constructor(_settings) {
    this.accordionId = _settings.accordionId;
    this.style = _settings.style;
    this.oneOpen = _settings.oneOpen;
  }

  create() {
    let self = this;
    let $accordion = $(`#${this.accordionId} .js-accordion`);
    let $accordion_header = $accordion.find(`.js-accordion-header`);
    let $accordion_item = $(`#${this.accordionId} .js-accordion-item`);

    $accordion_header.each((i, el) => {
      $(el).attr("data-sh-bind", i);
    });

    $(`#${this.accordionId} .accordion__image`).each((i, el) => {
      $(el).attr("data-sh-bind", i);
    });

    $accordion_header.on("click", function (event) {
      let $this = $(event.currentTarget);
      let boundGroup = $this.attr("data-sh-bind");
      if (
        self.oneOpen &&
        $this[0] !=
          $this
            .closest(`.js-accordion`)
            .find("> .js-accordion-item.active > .js-accordion-header")[0]
      ) {
        $this
          .closest(`.js-accordion`)
          .find("> .js-accordion-item")
          .removeClass("active")
          .find(".js-accordion-body")
          .slideUp();
      }

      // show/hide the clicked accordion item and image
      $(`#${self.accordionId} img[data-sh-bind]`).each((i, el) => {
        let group = $(el).attr("data-sh-bind");
        if (group === boundGroup) {
          $(el).addClass("active");
        } else {
          $(el).removeClass("active");
        }
      });
      $this.closest(`.js-accordion-item`).toggleClass("active");
      $this.next().stop().slideToggle(self.speed);
    });

    if (this.style === true) {
      $accordion_item.on("click", function () {
        $(".transparent-border").removeClass("transparent-border");
        $(this).prev().addClass("transparent-border");
      });
    }

    // ensure only one accordion is active if oneOpen is true
    if (
      this.oneOpen &&
      $(`#${this.accordionId} .js-accordion-item.active`).length > 1
    ) {
      $(
        `#${this.accordionId} .js-accordion-item.active:not(:first)`
      ).removeClass("active");
    }

    // reveal the active accordion bodies
    $(`#${this.accordionId} .js-accordion-item.active`)
      .find("> .js-accordion-body")
      .show();
  }
}
