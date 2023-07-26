(function () {
  'use strict';
  // Inquiry form persistent active state when input is populated
  const inputGroup = document.querySelectorAll('.input-group');
  inputGroup.forEach(input => {
    const userInput = input.querySelector('.user-input');
    
    if (!userInput)
      return;
    
    userInput.addEventListener('focusout', (event) => {
      const inputPlaceholder = input.querySelector('.inquiry-label');
      
      if (event.currentTarget.value)
      	inputPlaceholder.classList.add('has-input');
      else 
        inputPlaceholder.classList.remove('has-input');
      
    });
  });
  
  // Quick links and tab links DOM
  const quickLinks = document.querySelectorAll('.quick-links-item');
  const tabLinks = document.querySelectorAll('.tab-links-item');
  
  // Article subsection in homepage
  const articleView = document.querySelector('.article-view');
  
  // List item tab stops and
  // Back to top button 
  window.addEventListener('DOMContentLoaded', () => {
    for (const item of [...quickLinks, ...tabLinks])
    item.setAttribute('tabindex', '0');
    const backToTopButton = document.querySelector('button[data-action="back-to-top"]');
  	backToTopButton.addEventListener('click', () => { document.body.scrollIntoView(); });
  });
  
  // Dynamic Tab links
  const articleListItems = articleView.querySelectorAll('.product-category-list ul li');
  const nonSubListItems = [...articleListItems].filter(item => item.getAttribute('data-type') !== 'sub-item');
  const subListParents = [...nonSubListItems].filter(item => item.getAttribute('data-sub-list-parent')  === 'true');
  const subListItems = [...articleListItems].filter(item => item.getAttribute('data-type') === 'sub-item');
  
  // Preview section 
  const previewDOMDesktop = document.querySelector('.product-category-info-desktop');
  const previewDOMMobile = document.querySelector('.product-category-info-mobile');
  
  // Dynamic preview
  function previewSection(event) {
    previewDOMDesktop.querySelector('.info-contents').classList.remove('display-none');
    
    const listItem = event.currentTarget;
    const listItemTitle = listItem.querySelector('.button[data-type="product-category-item"]').innerHTML;
    const previewTitle = previewDOMDesktop.querySelector('h2.title');
    const parentID = listItem.getAttribute('data-parent-id');
    const sidebarHeaderTitle = articleView.querySelector('.article-section-header');
    const breadcrumbs = previewDOMDesktop.querySelector('.breadcrumbs');
    
  	if (!listItem.getAttribute('data-sub-list-parent') && parentID)
  	{
  		const parentList = listItem.parentElement.querySelector(`li[data-sub-list-parent="true"][data-parent-id=${parentID}]`);
  		breadcrumbs.innerHTML = `${sidebarHeaderTitle.innerHTML} > ${parentList.querySelector('button').innerHTML} > ${listItemTitle}`;
  	}
  	else 
  		breadcrumbs.innerHTML = `${sidebarHeaderTitle.innerHTML} > ${listItemTitle}`;
    
    previewTitle.innerHTML = listItemTitle;
    
    const previewBody = previewDOMDesktop.querySelector('.info-contents');
    [...previewBody.children].forEach(infoContent => {
    	infoContent.classList.add('display-none');
      
      if (infoContent.getAttribute('data-article-id') === listItem.getAttribute('data-article-id') && 
         infoContent.getAttribute('data-link') === listItem.parentElement.getAttribute('data-link'))
      			infoContent.classList.remove('display-none');
    });
  }
  
  // Accordion functionality
  const accordionItemsDesktop = document.querySelectorAll('.product-category-info-desktop .info-toggle *');
  
  function resetAllAccordion(event) {
    
    const accordionWrappers = document.querySelectorAll('.product-category-info-desktop .info-accordion-item');
    accordionWrappers.forEach(wrapper => {
      if (wrapper === event.currentTarget.parentElement.parentElement)
        return;
      
      const chevron = wrapper.querySelector('.info-toggle svg');
      
      if (!chevron)
        return;
      
      const infoToggle = wrapper.querySelector('.info-toggle');
      chevron.style = "";
      infoToggle.setAttribute('data-content', 'false');
      const accordionContent = wrapper.querySelector('.info-accordion-content');
      accordionContent.classList.add('display-none');
    });
	}
  
  accordionItemsDesktop.forEach(accordionItem => {
    accordionItem.addEventListener('click', (event) => {
      resetAllAccordion(event);
      
      const accordionItemWrapper = accordionItem.parentElement;
      const chevron = accordionItemWrapper.querySelector('.info-toggle svg');
      
      // Toggle data-content attribute
      const accordionContent = accordionItemWrapper.nextElementSibling;
      if (accordionItemWrapper.getAttribute('data-content') === 'true')
      {
        accordionItemWrapper.setAttribute('data-content', 'false');
      	accordionContent.classList.add('display-none');
        chevron.style.transform = 'rotate(90deg)';
      }
      else 
    	{
        accordionItemWrapper.setAttribute('data-content', 'true');
      	accordionContent.classList.remove('display-none');
        chevron.style.transform = 'rotate(-90deg)';
      }
      
    });
  });
  
  // `Read more` open and close
  const contentReadMoreDOMDesktop = document.querySelectorAll('.product-category-info-desktop .read-more');
  const readMoreWindow = document.querySelector('.product-category-info-desktop .read-more-window');
  const previewDOMTitle = previewDOMDesktop.querySelector('h2.title');
  
  // Open
  contentReadMoreDOMDesktop.forEach(readMore => {
    readMore.addEventListener('click', () => {
      const previewDOMContent = [...previewDOMDesktop.children].filter(child => child.getAttribute('data-preview') !== 'read-more');
      previewDOMContent.forEach(dom => dom.classList.add('display-none'));
      readMoreWindow.classList.toggle('display-none');
      readMoreWindow.innerHTML = readMore.nextElementSibling.innerHTML;
      readMoreWindow.querySelectorAll('ul').forEach(ul => ul.classList.remove('display-none'));
      
      // Close
      const closeArticleButton = document.querySelector('.read-more-window .button[data-action="close-article"]');
      closeArticleButton.addEventListener('click', () => {
        const previewDOMContent = [...previewDOMDesktop.children].filter(child => child.getAttribute('data-preview') !== 'read-more');
        previewDOMContent.forEach(dom => dom.classList.remove('display-none'));
        readMoreWindow.classList.add('display-none');
        readMoreWindow.innerHTML = '';
      });
    });
  });
  
  articleListItems.forEach(item => {
    item.addEventListener('click', previewSection);
  });
  
  // Sub list toggle open
  function subListToggle(parent, event) {
    if (event.key !== 'Enter' && event.type !== 'click')
      return;
    
    const chevron = parent.querySelector('svg');
    chevron.classList.toggle('rotate-clockwise');
    const parentID = parent.getAttribute('data-parent-id');
    const childrenSubItems = document.querySelectorAll(`.product-category-list-item[data-type="sub-item"][data-parent-id="${parentID}"]`);
    childrenSubItems.forEach(child => { child.classList.toggle('hidden'); });
  }
      
  // Persist active state for article list items
  function persistActiveState(DOMList, event) {
    if (event.key !== 'Enter' && event.type !== 'click')
      return;
    
    DOMList.forEach(dom => {
      // Reset active state
      dom.classList.remove('active');
    });
    
    // Persist active state
    event.currentTarget.classList.add('active');
  }
  
  // Highligh tab link section if linked article section is active
  function highlightTabLink(tablink) {
    tabLinks.forEach(dom => {
      // Reset active state
      dom.classList.remove('active');
    });
    
    tablink.classList.add('active');
  }

  // Highlight parent if child is active
  function highlightParent(parent) {
    articleListItems.forEach(dom => {
      // Reset active state
      dom.classList.remove('active');
    });
    
    parent.classList.add('active');
	}
    
  // Persistent active state (separate for sublist parent and sublist children) and
 	// Open sub list items if sub list parent is active
  function subListEventHandler(event, parent, tabLink) {
    readMoreWindow.classList.add('display-none');
    previewDOMTitle.classList.remove('display-none');
    contentReadMoreDOMDesktop.forEach(readMore => { readMore.classList.remove('display-none'); });
    highlightTabLink(tabLink);
    highlightParent(parent);
    persistActiveState([...quickLinks, ...subListItems], event);
	}
  
  subListItems.forEach(child => {
    const parent = subListParents.find(parent => parent.getAttribute('data-parent-id') === child.getAttribute('data-parent-id'));
    const tabLink = [...tabLinks].find(tab => tab.getAttribute('data-link') === child.parentElement.getAttribute('data-link'));
    child.addEventListener('click', (event) => subListEventHandler(event, parent, tabLink));
    child.addEventListener('keydown', (event) => subListEventHandler(event, parent, tabLink));
  });
  
  function nonSubListEventHandler(event, tabLink) {
    readMoreWindow.classList.add('display-none');
    previewDOMTitle.classList.remove('display-none');
    contentReadMoreDOMDesktop.forEach(readMore => { readMore.classList.remove('display-none'); });
    highlightTabLink(tabLink);
    persistActiveState([...quickLinks, ...articleListItems], event);
	}
  
  nonSubListItems.forEach(item => {
    const tabLink = [...tabLinks].find(tab => tab.getAttribute('data-link') === item.parentElement.getAttribute('data-link'));
    item.addEventListener('click', (event) => nonSubListEventHandler(event, tabLink));
    item.addEventListener('keydown', (event) => nonSubListEventHandler(event, tabLink));
  });
  
  subListParents.forEach(parent => {
    parent.addEventListener('click', (event) => { 
      subListToggle(parent, event);  
    });
    parent.addEventListener('keydown', (event) => { 
      subListToggle(parent, event);
		});
  });
  
  function dynamicArticleSection(event) {
    if (event.key !== 'Enter' && event.type !== 'click')
      return;
    
    const linkItem = event.currentTarget;
    if (linkItem.classList.contains('active'))
      return;
    
    if (!readMoreWindow.classList.contains('display-none')) {
      readMoreWindow.classList.add('display-none');
      previewDOMTitle.classList.remove('display-none');
      contentReadMoreDOMDesktop.forEach(readMore => { readMore.classList.remove('display-none'); });
    }
    
    persistActiveState([...quickLinks, ...tabLinks], event);
    
    // Show section corresponding to target event
    articleView.classList.remove('display-none');
    
    const sidebarHeaderTitle = articleView.querySelector('.article-section-header');
    const previewWindowTitle = previewDOMDesktop.querySelector('.title');
    const tabTitle = linkItem.querySelector('.label');
    sidebarHeaderTitle.innerHTML = tabTitle.innerHTML;
    previewWindowTitle.innerHTML = tabTitle.innerHTML;
    
    const dataLink = linkItem.getAttribute('data-link');
    const sidebarLinks = articleView.querySelectorAll('ul');
    sidebarLinks.forEach((sidebarLink) => {
      if (sidebarLink.getAttribute('data-link') === dataLink) {
        sidebarLink.classList.remove('display-none');
      } else {
        sidebarLink.classList.add('display-none');
      }
    });
    
    // Reset sidebar active state if tab is clicked
    // Active state for first sidebar item
    sidebarLinks.forEach((sidebarLink) => {
      const sidebarLinkChildren = sidebarLink.querySelectorAll('li');
      for (let i = 0; i < sidebarLinkChildren.length; i++) {
        if (i == 0)
        {
        	sidebarLinkChildren[i].classList.add('active');
          continue;
        }
        
        sidebarLinkChildren[i].classList.remove('active');
      }
    });
    
    // Show first sidebar link contents
    previewDOMDesktop.querySelector('.info-contents').classList.remove('display-none');
    
    const activeSidebar = [...sidebarLinks].find(sidebar => !sidebar.classList.contains('display-none'));
		const activeSidebarLink = [...activeSidebar.children].find(link => link.classList.contains('active'));
    const listItemTitle = activeSidebarLink.querySelector('.button[data-type="product-category-item"]').innerHTML;
    const previewTitle = previewDOMDesktop.querySelector('h2.title');
    const parentID = activeSidebarLink.getAttribute('data-parent-id');
    const breadcrumbs = previewDOMDesktop.querySelector('.breadcrumbs');
    
  	if (!activeSidebarLink.getAttribute('data-sub-list-parent') && parentID)
  	{
  		const parentList = activeSidebarLink.parentElement.querySelector(`li[data-sub-list-parent="true"][data-parent-id=${parentID}]`);
  		breadcrumbs.innerHTML = `${sidebarHeaderTitle.innerHTML} > ${parentList.querySelector('button').innerHTML} > ${listItemTitle}`;
  	}
  	else 
  		breadcrumbs.innerHTML = `${sidebarHeaderTitle.innerHTML} > ${listItemTitle}`;
    
    previewTitle.innerHTML = listItemTitle;
    
    const previewBody = previewDOMDesktop.querySelector('.info-contents');
    [...previewBody.children].forEach(infoContent => {
    	infoContent.classList.add('display-none');
      
      if (infoContent.getAttribute('data-article-id') === activeSidebarLink.getAttribute('data-article-id') && 
         infoContent.getAttribute('data-link') === activeSidebarLink.parentElement.getAttribute('data-link'))
      			infoContent.classList.remove('display-none');
    });
    
    articleView.scrollIntoView({behavior: 'smooth'});
  }
  
  tabLinks.forEach(link => {
    link.addEventListener('click', dynamicArticleSection);
    link.addEventListener('keydown', dynamicArticleSection);
  });
  
  // Hide product category sub items
  const articleListSubItems = document.querySelectorAll('.product-category-list-item[data-type="sub-item"]');
  articleListSubItems.forEach(subItem => {
    subItem.classList.add('hidden');
  });
  
  // Dynamic Quick Links
  function dynamicQuickLinks(event) {
    if (event.key !== 'Enter' && event.type !== 'click')
      return;
    
    const linkItem = event.currentTarget;
    if (linkItem.classList.contains('active'))
      return;
    
    if (!readMoreWindow.classList.contains('display-none')) {
      readMoreWindow.classList.add('display-none');
      previewDOMTitle.classList.remove('display-none');
      contentReadMoreDOMDesktop.forEach(readMore => { readMore.classList.remove('display-none'); });
    }
    
    persistActiveState([...quickLinks, ...tabLinks], event);
    
    articleView.classList.remove('display-none');
    
    const sidebarHeaderTitle = articleView.querySelector('.article-section-header');
    const previewWindowTitle = previewDOMDesktop.querySelector('.title');
    const connectedTabLink = [...tabLinks].find(tabLink => tabLink.getAttribute('data-link') === linkItem.getAttribute('data-link'));
    
    if (!connectedTabLink)
    {
      articleView.classList.add('display-none');
      return;
    }
    
    const tabTitle = connectedTabLink.querySelector('.label');
    sidebarHeaderTitle.innerHTML = tabTitle.innerHTML;
    previewWindowTitle.innerHTML = tabTitle.innerHTML;
    previewDOMDesktop.querySelector('.info-contents').classList.add('display-none');
    
    const dataLink = linkItem.getAttribute('data-link');
    const sidebarLinks = articleView.querySelectorAll('ul');
    sidebarLinks.forEach((sidebarLink) => {
      if (sidebarLink.getAttribute('data-link') === dataLink) {
        sidebarLink.classList.remove('display-none');
      } else {
        sidebarLink.classList.add('display-none');
      }
    });
    
    // Reset sidebar active state if tab is clicked
    sidebarLinks.forEach((sidebarLink) => {
      sidebarLink.querySelectorAll('li').forEach(listItem => { listItem.classList.remove('active'); });
    });
    
    previewDOMDesktop.querySelector('.info-contents').classList.remove('display-none');
    
    const previewTitle = previewDOMDesktop.querySelector('h2.title');
    const previewBody = previewDOMDesktop.querySelector('.info-contents');
    const sectionTitle = linkItem.querySelector('.quick-links-title h2');
    const breadcrumbs = previewDOMDesktop.querySelector('.breadcrumbs');
    
    breadcrumbs.innerHTML = `${sidebarHeaderTitle.innerHTML} > ${sectionTitle.innerHTML}`;
    previewTitle.innerHTML = sectionTitle.innerHTML;
    
    [...previewBody.children].forEach(infoContent => {
    	infoContent.classList.add('display-none');
      
      if (infoContent.getAttribute('data-article-id') === linkItem.getAttribute('data-article-id') && 
         infoContent.getAttribute('data-link') === dataLink)
        	infoContent.classList.remove('display-none');
    });
    
    articleView.scrollIntoView({behavior: 'smooth'});
  }
  
  quickLinks.forEach(link => {
    link.addEventListener('click', dynamicQuickLinks);
    link.addEventListener('keydown', dynamicQuickLinks);
  });

  // Key map
  const ENTER = 13;
  const ESCAPE = 27;
  const SPACE = 32;
  const UP = 38;
  const DOWN = 40;
  const TAB = 9;

  function toggleNavigation(toggle, menu) {
    const isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
    toggle.setAttribute("aria-expanded", !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute("aria-expanded", false);
    toggle.setAttribute("aria-expanded", false);
    toggle.focus();
  }

  // Navigation

  function Dropdown(toggle, menu) {
    this.toggle = toggle;
    this.menu = menu;

    this.menuPlacement = {
      top: menu.classList.contains("dropdown-menu-top"),
      end: menu.classList.contains("dropdown-menu-end"),
    };

    this.toggle.addEventListener("click", this.clickHandler.bind(this));
    this.toggle.addEventListener("keydown", this.toggleKeyHandler.bind(this));
    this.menu.addEventListener("keydown", this.menuKeyHandler.bind(this));
  }

  Dropdown.prototype = {
    get isExpanded() {
      return this.menu.getAttribute("aria-expanded") === "true";
    },

    get menuItems() {
      return Array.prototype.slice.call(
        this.menu.querySelectorAll("[role='menuitem']")
      );
    },

    dismiss: function () {
      if (!this.isExpanded) return;

      this.menu.setAttribute("aria-expanded", false);
      this.menu.classList.remove("dropdown-menu-end", "dropdown-menu-top");
    },

    open: function () {
      if (this.isExpanded) return;

      this.menu.setAttribute("aria-expanded", true);
      this.handleOverflow();
    },

    handleOverflow: function () {
      var rect = this.menu.getBoundingClientRect();

      var overflow = {
        right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
        bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight,
      };

      if (overflow.right || this.menuPlacement.end) {
        this.menu.classList.add("dropdown-menu-end");
      }

      if (overflow.bottom || this.menuPlacement.top) {
        this.menu.classList.add("dropdown-menu-top");
      }

      if (this.menu.getBoundingClientRect().top < 0) {
        this.menu.classList.remove("dropdown-menu-top");
      }
    },

    focusNextMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var nextIndex =
        currentIndex === this.menuItems.length - 1 || currentIndex < 0
          ? 0
          : currentIndex + 1;

      this.menuItems[nextIndex].focus();
    },

    focusPreviousMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var previousIndex =
        currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1;

      this.menuItems[previousIndex].focus();
    },

    clickHandler: function () {
      if (this.isExpanded) {
        this.dismiss();
      } else {
        this.open();
      }
    },

    toggleKeyHandler: function (e) {
      switch (e.keyCode) {
        case ENTER:
        case SPACE:
        case DOWN:
          e.preventDefault();
          this.open();
          this.focusNextMenuItem();
          break;
        case UP:
          e.preventDefault();
          this.open();
          this.focusPreviousMenuItem();
          break;
        case ESCAPE:
          this.dismiss();
          this.toggle.focus();
          break;
      }
    },

    menuKeyHandler: function (e) {
      var firstItem = this.menuItems[0];
      var lastItem = this.menuItems[this.menuItems.length - 1];
      var currentElement = e.target;

      switch (e.keyCode) {
        case ESCAPE:
          this.dismiss();
          this.toggle.focus();
          break;
        case DOWN:
          e.preventDefault();
          this.focusNextMenuItem(currentElement);
          break;
        case UP:
          e.preventDefault();
          this.focusPreviousMenuItem(currentElement);
          break;
        case TAB:
          if (e.shiftKey) {
            if (currentElement === firstItem) {
              this.dismiss();
            } else {
              e.preventDefault();
              this.focusPreviousMenuItem(currentElement);
            }
          } else if (currentElement === lastItem) {
            this.dismiss();
          } else {
            e.preventDefault();
            this.focusNextMenuItem(currentElement);
          }
          break;
        case ENTER:
        case SPACE:
          e.preventDefault();
          currentElement.click();
          break;
      }
    },
  };

  // Dropdowns

  window.addEventListener("DOMContentLoaded", () => {
    const dropdowns = [];
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    dropdownToggles.forEach((toggle) => {
      const menu = toggle.nextElementSibling;
      if (menu && menu.classList.contains("dropdown-menu")) {
        dropdowns.push(new Dropdown(toggle, menu));
      }
    });

    document.addEventListener("click", (event) => {
      dropdowns.forEach((dropdown) => {
        if (!dropdown.toggle.contains(event.target)) {
          dropdown.dismiss();
        }
      });
    });
  });

  // Share

  window.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".share a");
    links.forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        window.open(anchor.href, "", "height = 500, width = 500");
      });
    });
  });

  // Vanilla JS debounce function, by Josh W. Comeau:
  // https://www.joshwcomeau.com/snippets/javascript/debounce/
  function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  // Define variables for search field
  let searchFormFilledClassName = "search-has-value";
  let searchFormSelector = "form[role='search']";

  // Clear the search input, and then return focus to it
  function clearSearchInput(event) {
    event.target
      .closest(searchFormSelector)
      .classList.remove(searchFormFilledClassName);

    let input;
    if (event.target.tagName === "INPUT") {
      input = event.target;
    } else if (event.target.tagName === "BUTTON") {
      input = event.target.previousElementSibling;
    } else {
      input = event.target.closest("button").previousElementSibling;
    }
    input.value = "";
    input.focus();
  }

  // Have the search input and clear button respond
  // when someone presses the escape key, per:
  // https://twitter.com/adambsilver/status/1152452833234554880
  function clearSearchInputOnKeypress(event) {
    const searchInputDeleteKeys = ["Delete", "Escape"];
    if (searchInputDeleteKeys.includes(event.key)) {
      clearSearchInput(event);
    }
  }

  // Create an HTML button that all users -- especially keyboard users --
  // can interact with, to clear the search input.
  // To learn more about this, see:
  // https://adrianroselli.com/2019/07/ignore-typesearch.html#Delete
  // https://www.scottohara.me/blog/2022/02/19/custom-clear-buttons.html
  function buildClearSearchButton(inputId) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("aria-controls", inputId);
    button.classList.add("clear-button");
    const buttonLabel = window.searchClearButtonLabelLocalized;
    button.addEventListener("click", clearSearchInput);
    button.addEventListener("keyup", clearSearchInputOnKeypress);
    return button;
  }

  // Append the clear button to the search form
  function appendClearSearchButton(input, form) {
    const searchClearButton = buildClearSearchButton(input.id);
    form.append(searchClearButton);
    if (input.value.length > 0) {
      form.classList.add(searchFormFilledClassName);
    }
  }

  // Add a class to the search form when the input has a value;
  // Remove that class from the search form when the input doesn't have a value.
  // Do this on a delay, rather than on every keystroke.
  const toggleClearSearchButtonAvailability = debounce((event) => {
    const form = event.target.closest(searchFormSelector);
    form.classList.toggle(
      searchFormFilledClassName,
      event.target.value.length > 0
    );
  }, 200);

  // Search

  window.addEventListener("DOMContentLoaded", () => {
    // Set up clear functionality for the search field
    const searchForms = [...document.querySelectorAll(searchFormSelector)];
    const searchInputs = searchForms.map((form) =>
      form.querySelector("input[type='search']")
    );
    searchInputs.forEach((input) => {
      appendClearSearchButton(input, input.closest(searchFormSelector));
      input.addEventListener("keyup", clearSearchInputOnKeypress);
      input.addEventListener("keyup", toggleClearSearchButtonAvailability);
    });
  });

  const key = "returnFocusTo";

  function saveFocus() {
    const activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem(key, "#" + activeElementId);
  }

  function returnFocus() {
    const returnFocusTo = sessionStorage.getItem(key);
    if (returnFocusTo) {
      sessionStorage.removeItem("returnFocusTo");
      const returnFocusToEl = document.querySelector(returnFocusTo);
      returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }
  }
  
  // Forms

  window.addEventListener("DOMContentLoaded", () => {
    // In some cases we should preserve focus after page reload
    returnFocus();

    // show form controls when the textarea receives focus or back button is used and value exists
    const commentContainerTextarea = document.querySelector(
      ".comment-container textarea"
    );
    const commentContainerFormControls = document.querySelector(
      ".comment-form-controls, .comment-ccs"
    );

    if (commentContainerTextarea) {
      commentContainerTextarea.addEventListener(
        "focus",
        function focusCommentContainerTextarea() {
          commentContainerFormControls.style.display = "block";
          commentContainerTextarea.removeEventListener(
            "focus",
            focusCommentContainerTextarea
          );
        }
      );

      if (commentContainerTextarea.value !== "") {
        commentContainerFormControls.style.display = "block";
      }
    }

    // Expand Request comment form when Add to conversation is clicked
    const showRequestCommentContainerTrigger = document.querySelector(
      ".request-container .comment-container .comment-show-container"
    );
    const requestCommentFields = document.querySelectorAll(
      ".request-container .comment-container .comment-fields"
    );
    const requestCommentSubmit = document.querySelector(
      ".request-container .comment-container .request-submit-comment"
    );

    if (showRequestCommentContainerTrigger) {
      showRequestCommentContainerTrigger.addEventListener("click", () => {
        showRequestCommentContainerTrigger.style.display = "none";
        Array.prototype.forEach.call(requestCommentFields, (element) => {
          element.style.display = "block";
        });
        requestCommentSubmit.style.display = "inline-block";

        if (commentContainerTextarea) {
          commentContainerTextarea.focus();
        }
      });
    }

    // Mark as solved button
    const requestMarkAsSolvedButton = document.querySelector(
      ".request-container .mark-as-solved:not([data-disabled])"
    );
    const requestMarkAsSolvedCheckbox = document.querySelector(
      ".request-container .comment-container input[type=checkbox]"
    );
    const requestCommentSubmitButton = document.querySelector(
      ".request-container .comment-container input[type=submit]"
    );

    if (requestMarkAsSolvedButton) {
      requestMarkAsSolvedButton.addEventListener("click", () => {
        requestMarkAsSolvedCheckbox.setAttribute("checked", true);
        requestCommentSubmitButton.disabled = true;
        requestMarkAsSolvedButton.setAttribute("data-disabled", true);
        requestMarkAsSolvedButton.form.submit();
      });
    }

    // Change Mark as solved text according to whether comment is filled
    const requestCommentTextarea = document.querySelector(
      ".request-container .comment-container textarea"
    );

    const usesWysiwyg =
      requestCommentTextarea &&
      requestCommentTextarea.dataset.helper === "wysiwyg";

    function isEmptyPlaintext(s) {
      return s.trim() === "";
    }

    function isEmptyHtml(xml) {
      const doc = new DOMParser().parseFromString(`<_>${xml}</_>`, "text/xml");
      const img = doc.querySelector("img");
      return img === null && isEmptyPlaintext(doc.children[0].textContent);
    }

    const isEmpty = usesWysiwyg ? isEmptyHtml : isEmptyPlaintext;

    if (requestCommentTextarea) {
      requestCommentTextarea.addEventListener("input", () => {
        if (isEmpty(requestCommentTextarea.value)) {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText =
              requestMarkAsSolvedButton.getAttribute("data-solve-translation");
          }
        } else {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText =
              requestMarkAsSolvedButton.getAttribute(
                "data-solve-and-submit-translation"
              );
          }
        }
      });
    }

    const selects = document.querySelectorAll(
      "#request-status-select, #request-organization-select"
    );

    selects.forEach((element) => {
      element.addEventListener("change", (event) => {
        event.stopPropagation();
        saveFocus();
        element.form.submit();
      });
    });

    // Submit requests filter form on search in the request list page
    const quickSearch = document.querySelector("#quick-search");
    if (quickSearch) {
      quickSearch.addEventListener("keyup", (event) => {
        if (event.keyCode === ENTER) {
          event.stopPropagation();
          saveFocus();
          quickSearch.form.submit();
        }
      });
    }

    // Submit organization form in the request page
    const requestOrganisationSelect = document.querySelector(
      "#request-organization select"
    );

    if (requestOrganisationSelect) {
      requestOrganisationSelect.addEventListener("change", () => {
        requestOrganisationSelect.form.submit();
      });
    }

    // If there are any error notifications below an input field, focus that field
    const notificationElm = document.querySelector(".notification-error");
    if (
      notificationElm &&
      notificationElm.previousElementSibling &&
      typeof notificationElm.previousElementSibling.focus === "function"
    ) {
      notificationElm.previousElementSibling.focus();
    }
  });
})();