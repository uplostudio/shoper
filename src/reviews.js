document.addEventListener('DOMContentLoaded', function () {
	function initializeResetElement() {
		resetElement = $("[fs-cmsfilter-element='reset']");
		resetElement.each(function () {
			$(this).hide();
			this.style.display = 'none';
		});
	}

	initializeResetElement(); // Ensure reset elements are hidden before other jQuery operations

	$(document).ready(function () {
		const $filtersWrapper = $('.filters2_tags-wrapper');

		function initializeListElements(isInitialLoad) {
			$('[data-item^="list"]').each(function () {
				handleList($(this), isInitialLoad);
			});
		}

		function handleList($listElementContainer, isInitialLoad) {
			const listToSort = processList($listElementContainer, isInitialLoad);
			handleVisibilityAndExpansion($listElementContainer, listToSort);
		}

		function processList($listElementContainer, isInitialLoad) {
			let listToSort = [];
			$listElementContainer.find('span[fs-cmsfilter-field]').each(function () {
				const $this = $(this);
				const count = $(
					`div[fs-cmsfilter-element='list'] div[data-set='${$this.data('value')}']`
				).length;
				$this.next('.counter_span').text(`[${count}]`);
				const closestListItem = $this.closest('[role="listitem"]');

				if (closestListItem.length) {
					listToSort.push({ element: closestListItem, count });
				}
			});
			return listToSort;
		}

		function handleVisibilityAndExpansion($listElementContainer, listToSort) {
			if (listToSort.length > 0) {
				const fragment = document.createDocumentFragment();
				listToSort
					.sort((a, b) => b.count - a.count)
					.forEach((item) => fragment.appendChild(item.element[0]));
				$listElementContainer.append(fragment);
			}

			const itemCount = $listElementContainer.children(':visible').length;
			const itemNum = $listElementContainer.attr('data-item').split('-')[1];
			const hiddenChildren = itemCount - 5;
			const $expandElement = $(`[data-item=expand-${itemNum}]`);

			if (hiddenChildren < 1 || $expandElement.data('wasExpanded')) {
				$expandElement.text('Pokaż mniej').show();
			} else if (itemCount > 5) {
				$listElementContainer.addClass('collapsed');
				$expandElement.text('Pokaż więcej').show();
			}
		}

		function expandOnClick() {
			$('[data-item^=expand]')
				.off('click')
				.on('click', function (event) {
					event.preventDefault();
					const $this = $(this);
					const expandNum = $this.attr('data-item').split('-')[1];
					const $listElement = $(`[data-item=list-${expandNum}]`);
					const wasExpanded = !$this.data('wasExpanded');

					$this.data('wasExpanded', wasExpanded);
					$listElement.toggleClass('collapsed', !wasExpanded);
					$this.text(wasExpanded ? 'Pokaż mniej' : 'Pokaż więcej');
				});
		}

		function feedBoxBottomClassHandler() {
			$('.feed_box-bottom').each(function () {
				const $this = $(this);
				if ($this.find('a.w-condition-invisible').length === 1) {
					$this.find('a:not(.w-condition-invisible)').each(function () {
						$(this).removeClass(function (index, className) {
							return className && className !== 'button';
						});
					});
				}
			});
		}

		function updateFiltersVisibility() {
			$('span[fs-cmsfilter-field]').each(function () {
				const $filterField = $(this);
				const filterValue = $filterField.data('value');
				const matchingItems = $(
					`div[fs-cmsfilter-field][data-set='${filterValue}']`
				);
				$filterField.closest('.w-dyn-item').toggle(matchingItems.length > 0);
			});
		}

		function observeNodeChange(targetSelector, onNodeChange) {
			const targetNode = document.querySelector(targetSelector);
			if (!targetNode) return;

			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'childList') onNodeChange(mutation);
				});
			});

			observer.observe(targetNode, { childList: true, subtree: true });
		}

		function handleMutation(mutationsList) {
			mutationsList.forEach((mutation) => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'style'
				) {
					const displayValue = $filtersWrapper.css('display');
					$('body').css(
						'overflow',
						displayValue === 'flex' ? 'hidden' : 'auto'
					);
				}
			});
		}

		function addSeparators() {
			const $solutionsListItems = $('.solutions_list .w-dyn-item');
			$solutionsListItems.next('.bullet').remove();
			$solutionsListItems.each(function (index, element) {
				if (index < $solutionsListItems.length - 1) {
					$(element).after('<div class="bullet">•</div>');
				}
			});
		}

		function debounce(func, wait) {
			let timeout;
			return function () {
				const context = this;
				const args = arguments;
				clearTimeout(timeout);
				timeout = setTimeout(() => func.apply(context, args), wait);
			};
		}

		const optimizedInitializeListElements = debounce(function (isInitialLoad) {
			initializeListElements(isInitialLoad);
		}, 200);

		expandOnClick();
		feedBoxBottomClassHandler();
		optimizedInitializeListElements(true);
		updateFiltersVisibility();

		observeNodeChange('[fs-cmsfilter-element="list"]', function () {
			if ($filtersWrapper.children().length > 0) {
				resetElement.show();
				$("[fs-cmsfilter-element='tag-template']").removeClass('hide');
			} else {
				resetElement.hide();
			}

			optimizedInitializeListElements(false);
			expandOnClick();
		});

		const observerOptions = {
			attributes: true,
			childList: false,
			subtree: false,
		};

		new MutationObserver(handleMutation).observe(
			$filtersWrapper[0],
			observerOptions
		);
		addSeparators();
	});
});
