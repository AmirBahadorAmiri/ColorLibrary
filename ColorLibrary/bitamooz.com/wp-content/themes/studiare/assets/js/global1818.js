var studiareTheme;

(function($) {
    'use strict';

    studiareTheme = (function() {

        var body = $('body');

        return {

            init: function() {
                this.studiare_preloader();
                this.header_search();
                this.dropdwon_arrow();
                this.back_to_top();
                this.off_canvas_navigation();
                this.modal_login_form();
                this.select_to_select2();
                this.courses_layout_switch();
                this.sticky_sidebar();
                this.video_popup();
                this.portfolioFilter();
                this.animatedCounter();
                this.courseCategories();
                this.blogMasonry();
                this.testimonialsCarousel();
                this.coursePanel();
                this.countDownTimer();
                this.galleryLightbox();
                this.galleryCarousel();
                this.lessonToggle();
                // Open cart offcanvas
                $(document).on("click", ".mini-cart-opener", function (e) {
                    e.preventDefault();
                    $(".sc-cart-offcanvas").addClass("active");
                });
                
                // Close by backdrop or close button
                $(document).on("click", ".sc-cart-backdrop, .sc-cart-close", function () {
                    $(".sc-cart-offcanvas").removeClass("active");
                });
                
                // Close when clicking outside the panel
                $(document).on("click", function (e) {
                    var offcanvas = $(".sc-cart-offcanvas");
                    var panel = $(".sc-cart-panel");
                
                    // If not active → do nothing
                    if (!offcanvas.hasClass("active")) return;
                
                    // If clicked inside panel → do nothing
                    if ($(e.target).closest(panel).length) return;
                
                    // If clicked on opener button → do nothing
                    if ($(e.target).closest(".mini-cart-opener").length) return;
                
                    // Otherwise → close
                    offcanvas.removeClass("active");
                });



            },

            /**
             * Preloader Page
             */
            studiare_preloader: function() {
                var $preload = $('.studiare-preloader');
                var isMobile = window.matchMedia("(max-width: 768px)").matches;
                var fadeDuration = 1000;
                var maxWaitTime = 3000;
            
                if ($preload.length > 0) {
                    $(window).on('load', function() {
                        hidePreloader();
                    });
            
                    setTimeout(function() {
                        if ($preload.is(':visible')) {
                            hidePreloader();
                        }
                    }, maxWaitTime);
            
                    if (isMobile) {
                        setTimeout(hidePreloader, 2000);
                    }
                }
            
                function hidePreloader() {
                    $preload.fadeOut(fadeDuration, function() {
                        $preload.remove();
                    });
                }
            },

            /**
             * Header Search
             */
            header_search: function() {
                var searchInput = $('.site-header .search-input'),
                    searchOpener = $('.top-bar-search .search-form-opener'),
                    searchOpenerIcon = searchOpener.find('i');

                $(document).on("click", ".search-form-opener, .search-capture-click", function (ev) {
                    ev.preventDefault();

                    if ( body.hasClass('search-active') ) {

                        body.removeClass('search-active');


                    }
                    else {

                        body.addClass('search-active');
                        setTimeout(function(){searchInput.focus();}, 700);
                    }

                });
                $(document).on('click', '#stHsearchCloser', function(e) {
                    e.preventDefault();
                    body.removeClass('search-active');
                    //$(this).remove(); 
                });
                $(document).on('click', function(e) {
                    if (!$(e.target).closest('.top-bar-search, .site-search-wrapper').length && body.hasClass('search-active')) {
                        body.removeClass('search-active');
                    }
                });

            },

            /**
             * Main Navigation DropDown Ancestor
             */
            dropdwon_arrow: function () {
                $('.studiare-navigation > ul > li.menu-item-has-children').each(function(){
                    $(this).find('> a').append('<i class="fa fa-angle-down"></i>');
                });
            },

            /**
             * Back to top
             */
            back_to_top: function() {
                var back_to_top = $('#back-to-top');

                $(window).scroll(function () {
                    if ($(this).scrollTop() > 100) {
                        back_to_top.addClass('visible');
                    } else {
                        back_to_top.removeClass('visible');
                    }
                });

                back_to_top.on('click', function (ev) {
                    ev.preventDefault();

                    $('html,body').animate({scrollTop: '0px'}, 800);
                })
            },

            /**
             * Off Canvas Navigation
             */
            off_canvas_navigation: function() {

                $('.mobile-nav-toggle').on('click', function(ev) {
                    ev.preventDefault();

                    body.toggleClass('off-canvas-open');
                });

                $('.off-canvas-overlay').on('click', function(ev) {
                    ev.preventDefault();

                    body.removeClass('off-canvas-open');
                });
                
                // Open and close the offcanvas (your existing handlers)
                $("#sc_notif_trigger").on("click", function() {
                    $(".sc-notif-offcanvas").addClass("active");
                
                    // Load notifications via Ajax (only once)
                    load_notifications();
                });
                
                $(document).on("click", ".sc-notif-backdrop, .sc-notif-close", function() {
                    $(".sc-notif-offcanvas").removeClass("active");
                });
                
                /* -----------------------------------
                 * Load Notifications via AJAX with Skeleton Loader
                 * ----------------------------------- */
                function load_notifications() {
                
                    // Prevent reloading if already loaded
                    if ($(".sc-notif-body").hasClass("loaded")) {
                        return;
                    }
                
                    // If user is NOT logged in, show login message and skip Ajax
                    if (typeof SC_Notif === 'undefined' || SC_Notif.logged_in != 1) {
                        $(".sc-notif-body").html(
                            '<div class="studi_empty_notif">' +
                                '<i class="fal fa-bell-exclamation"></i>' +
                                '<span>' + SC_Notif.i18n.login_required + '</span>' +
                            '</div>'
                        ).addClass("loaded");
                        return;
                    }
                
                    // Show skeleton loader
                    $(".sc-notif-body").html(
                        "<div class='sc-notif-skeleton'>"
                      + "<div class='sk-item'></div>"
                      + "<div class='sk-item'></div>"
                      + "<div class='sk-item'></div>"
                      + "<div class='sk-item'></div>"
                      + "<div class='sk-item'></div>"
                      + "</div>"
                    );
                
                    $.ajax({
                        type: "POST",
                        url: SC_Notif.ajaxurl,
                        data: {
                            action: "sc_load_notifications",
                            count: 20,
                            nonce: SC_Notif.nonce
                        },
                        success: function(response) {
                            if (response.success) {
                                $(".sc-notif-body").html(response.data.html).addClass("loaded");
                            } else {
                                $(".sc-notif-body").html("<div class='error'>No notifications</div>");
                            }
                        },
                        error: function() {
                            $(".sc-notif-body").html("<div class='error'>Error loading notifications</div>");
                        }
                    });
                }
                


            },

            /**
             * Login Form Modal
             */
            modal_login_form: function () {

                $('.register-modal-opener').on('click', function (e) {
                    e.preventDefault();
                    body.toggleClass('modal-login-open');
                });

                $('.login-form-overlay, .login-form-modal-box .close').on('click', function (e) {
                    e.preventDefault();
                    body.removeClass('modal-login-open')
                });

            },

            /**
             * Transform Select to Select2
             */
            select_to_select2: function () {
                if (jQuery.fn.select2) { //since version 13.3
                  $('select').select2({
                      width: '100%',
                  })
                }
            },

            /**
             * Courses Layout Swtich
             */
            courses_layout_switch: function () {
                var grid_class = 'grid-view',
                    list_class = 'list-view';

                var listSwitcher = function () {
                    var switcher_active = 'active';

                    $('.switcher-view-grid').on('click', function (ev) {
                        switchToGrid();
                        ev.preventDefault();
                    });

                    $('.switcher-view-list').on('click', function (ev) {
                        switchToList();
                        ev.preventDefault();
                    });

                    function switchToList() {
                        $('.switcher-view-list').addClass(switcher_active);
                        $('.switcher-view-grid').removeClass(switcher_active);
                        $('.products').fadeOut(300, function () {
                            $(this).removeClass(grid_class).addClass(list_class).fadeIn(300);
                        });
                    }

                    function switchToGrid() {
                        $('.switcher-view-grid').addClass(switcher_active);
                        $('.switcher-view-list').removeClass(switcher_active);
                        $('.products').fadeOut(300, function () {
                            $(this).removeClass(list_class).addClass(grid_class).fadeIn(300);
                        });
                    }

                };

                listSwitcher();

            },


            /**
             * Sticky Sidebar
             */
            sticky_sidebar: function () {

                var offsetTop = 100;

                if ($("#wpadminbar").length) {
                    offsetTop += $("#wpadminbar").outerHeight();
                }

                if ($('.sticky-sidebar').length > 0) {
                    $(".sticky-sidebar").theiaStickySidebar({
                        "containerSelector"     : "",
                        "additionalMarginTop"   : offsetTop,
                        "additionalMarginBottom": "0",
                        "updateSidebarHeight"   : false,
                        "minWidth"              : "768",
                        "sidebarBehavior"       : "modern"
                    });
                }

            },

            /**
             * Video Button with Magnific Popup
             */
            video_popup: function () {
                $(".cdb-video-icon, .video-lesson-preview, .video-popup-btn").magnificPopup({
                    type: 'iframe',
                });
            },

            /**
             * Portfolio Filter
             */
            portfolioFilter: function () {
                $('.portfolio-controls .control').on('click', function (ev) {
                    ev.preventDefault();
                });
            
                if ($('.portfolio-holder').length && typeof mixitup !== 'undefined') {
                    var mixer = mixitup('.portfolio-holder', {
                        selectors: {
                            "target": '.portfolio-entry'
                        },
                        animation: {
                            "duration": 250,
                            "nudge": true,
                            "reverseOut": false,
                            "effects": "fade stagger(100ms)"
                        }
                    });
                }
            },

            /**
             * Animated Counter
             */
            animatedCounter: function () {

                var counters = $('.counter-number');

                if (counters.length) {
                    counters.each(function () {
                        var counter = $(this);
                        counter.appear(function () {
                            counter.parent().css({'opacity': 1});

                            //Counter zero type
                            var max = parseFloat(counter.text());
                            counter.countTo({
                                from: 0,
                                to: max,
                                speed: 1500,
                                refreshInterval: 100
                            });

                        }, {accX: 0, accY: 0});
                    });
                }
            },

            /**
             * Course Categories
             */
            courseCategories: function () {

                var $course_grid = $('.course-categories').packery({originLeft: false}); //add by suncode {originLeft: false}

                $course_grid.imagesLoaded().progress( function() {
                    $course_grid.packery({originLeft: false});
					
                });
				
				
            },

            /**
             * Blog Masonry
             */
            blogMasonry: function () {
                var $post_items = $('.blog-masonry').packery({originLeft: false});

                $post_items.imagesLoaded().progress( function() {
                    $post_items.packery({originLeft: false});
                });
            },

            /**
             * Testimonials Carousel
             */
            testimonialsCarousel: function () {
                var carousel = $('.testimonials-wrapper .owl-carousel');

                if ( carousel.length ) {

                    carousel.each( function () {

                        var owl = $(this),
                            pagination = owl.data('pagination') ? owl.data('pagination') : false,
                            loop = owl.data('loop');

                        owl.owlCarousel({
                            items: 1,
                            dots: pagination,
                            nav: false,
                            autoheight: true,
                            navText: false,
                            loop: loop,

                            onRefreshed: function() {
                                $(window).resize();
                            }
                        });

                    });
                }
            },

/**
 * Course Panel Toggle
 */
coursePanel: function () {
    // Select all course-lesson elements
    var lessons = document.querySelectorAll(".course-lesson");

    lessons.forEach(function(lesson) {
        let observer = null;
        // Find course-panel-heading inside course-lesson
        var heading = lesson.querySelector(".course-panel-heading");

        if (heading) {
            heading.addEventListener("click", function(event) {
                // Prevent action if clicking on download or preview links
                if (event.target.closest('.dl_holder') || event.target.closest('.video-lesson-preview')) {
                    return;
                }

                // Toggle sc-open class on course-lesson
                lesson.classList.toggle("sc-open");

                // Toggle active class on course-panel-heading
                heading.classList.toggle("active");

                // Find panel-content inside course-lesson
                var panel = heading.nextElementSibling;

                if (panel && panel.classList.contains('panel-content')) {
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;

                        if (observer) {
                            observer.disconnect();
                            observer = null;
                        }
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                        panel.style.height = "auto";

                        // Observe changes to update maxHeight dynamically
                        observer = new MutationObserver(function() {
                            panel.style.maxHeight = panel.scrollHeight + "px";
                        });

                        observer.observe(panel, {
                            childList: true,
                            subtree: true,
                            characterData: true
                        });
                    }
                } else {
                    console.warn("No valid panel-content found for this course-panel-heading");
                }
            });
        }
    });
},
/**
             * Lessons Toggle
             */
lessonToggle: function () {

    jQuery(document).on('click', '.sc-course-lesson-toggle-wrapper', function () {

        const id = jQuery(this).data('id');
        const item = jQuery("[data-id='" + id + "']");
        item.toggleClass("active_tab_by_suncode");
        item.next('.panel-group').slideToggle();
    });

    jQuery(document).on('click.sc_toggle_all', '.sc-toggle-all-sections', function (e) {
        e.stopPropagation();

        var $openBtn = jQuery('.sc-toggle-all-sections.sc-open-all');
        var $closeBtn = jQuery('.sc-toggle-all-sections.sc-close-all');

        var allOpen = true;
        jQuery('.sc-course-lesson-toggle-wrapper').each(function () {
            if (!jQuery(this).hasClass('active_tab_by_suncode')) {
                allOpen = false;
                return false;
            }
        });

        if (allOpen) {
            // Close all
            jQuery('.sc-course-lesson-toggle-wrapper.active_tab_by_suncode').each(function () {
                jQuery(this).removeClass('active_tab_by_suncode');
                jQuery(this).next('.panel-group').slideUp();
            });
            $openBtn.removeClass('sc-toggle-hidden');
            $closeBtn.addClass('sc-toggle-hidden');
        } else {
            // Open all
            jQuery('.sc-course-lesson-toggle-wrapper').each(function () {
                if (!jQuery(this).hasClass('active_tab_by_suncode')) {
                    jQuery(this).addClass('active_tab_by_suncode');
                    jQuery(this).next('.panel-group').slideDown();
                }
            });
            $openBtn.addClass('sc-toggle-hidden');
            $closeBtn.removeClass('sc-toggle-hidden');
        }
    });

    if (typeof window.scDefaultOpen !== 'undefined') {
        const item = jQuery("[data-id='" + window.scDefaultOpen + "']");
        item.addClass("active_tab_by_suncode");
        item.next('.panel-group').slideDown();
    }

},


            /**
             * Count Down Timer
             */
            countDownTimer: function () {
                $('.countdown-item').each(function(){
                    $(this).countdown($(this).data('date'), function(event) {
                        $(this).html(event.strftime(''
                            + '<div class="countdown-col"><span class="countdown-unit countdown-days"><span class="number">%-D </span><span class="text">' + studiare_options.countdown_days + '</span></span></div> '
                            + '<div class="countdown-col"><span class="countdown-unit countdown-hours"><span class="number">%H </span><span class="text">' + studiare_options.countdown_hours + '</span></span></div> '
                            + '<div class="countdown-col"><span class="countdown-unit countdown-min"><span class="number">%M </span><span class="text">' + studiare_options.countdown_mins + '</span></span></div> '
                            + '<div class="countdown-col"><span class="countdown-unit countdown-sec"><span class="number">%S </span><span class="text">' + studiare_options.countdown_sec + '</span></span></div>'));
                    });
                })
            },

            /**
             * Gallery LightBox
             */
            galleryLightbox: function () {
                var galleryWrapper = $('.gallery-wrapper');

                galleryWrapper.each( function () {
                    var _this = $(this);

                    _this.magnificPopup({
                        mainClass: 'mfp-zoom-in',
                        type: 'image',
                        delegate: 'a.gallery-lightbox-link',
                        removalDelay: 400,
                        gallery: {
                            enabled:true
                        }
                    });
                });
            },

            /**
             * Gallery Carousel
             */
            galleryCarousel: function () {
                var carousel = $('.gallery-wrapper .owl-carousel');

                if ( carousel.length ) {

                    carousel.each( function() {
                        var owl = $(this),
                            autoplay = true,
                            pagination = owl.data('pagination') ? owl.data('pagination') : false,
                            navigation = owl.data('navigation') ? owl.data('navigation') : false,
                            loop = owl.data('loop');

                        owl.owlCarousel({
                            items: 1,
                            dots: pagination,
                            nav: navigation,
                            autoplay: autoplay,
                            autoheight: true,
                            navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
                            loop: loop,

                            onRefreshed: function() {
                                $(window).resize();
                            }
                        });
                    });

                }

            },

        }
    }());

})(jQuery);

jQuery(document).ready(function() {

    studiareTheme.init();

});


/* convert dropdown to radio button variation product */
jQuery(document).on('change', '.variation-radios input', function() {
  jQuery('select[name="'+jQuery(this).attr('name')+'"]').val(jQuery(this).val()).trigger('change');
});
jQuery(document).on('woocommerce_update_variation_values', function() {
  jQuery('.variation-radios input').each(function(index, element) {
    jQuery(element).removeAttr('disabled');
    var thisName = jQuery(element).attr('name');
    var thisVal  = jQuery(element).attr('value');
    if(jQuery('select[name="'+thisName+'"] option[value="'+thisVal+'"]').is(':disabled')) {
      jQuery(element).prop('disabled', true);
    }
  });
});


/* set cookie to show notifbar */
function closeNotifBar(reopenTime) {
    jQuery(".studi_notif_bar").slideUp();
    let expireTime = new Date();
    expireTime.setTime(expireTime.getTime() + reopenTime * 1000);
    document.cookie = "notif_closed_time=" + Math.floor(Date.now() / 1000) + "; path=/; expires=" + expireTime.toUTCString();
}

jQuery(document).ready(function () {
    if (document.cookie.indexOf("notif_closed_time") !== -1) {
        let closedTime = parseInt(document.cookie.replace(/(?:(?:^|.*;\s*)notif_closed_time\s*\=\s*([^;]*).*$)|^.*$/, "$1"), 10);
        let currentTime = Math.floor(Date.now() / 1000);
        let reopenTime = parseInt(jQuery(".studi_notif_bar").attr("data-reopen-time"), 10) || 30;

        if (currentTime - closedTime >= reopenTime) {
            document.cookie = "notif_closed_time=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            jQuery(".studi_notif_bar").slideDown();
        }
    }
});
/* for reset cookies notifbar*/
jQuery(document).ready(function () {
    let resetTime = parseInt("<?php echo get_option('sc_top_notifbar_reset_flag', 0); ?>", 10);
    let userLastCloseTime = parseInt(document.cookie.replace(/(?:(?:^|.*;\s*)notif_closed_time\s*\=\s*([^;]*).*$)|^.*$/, "$1"), 10) || 0;

    if (resetTime > userLastCloseTime) {
        document.cookie = "notif_closed_time=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        location.reload();
    }
});



jQuery(document).ready(function($){
    jQuery(".off-canvas-main .subtri").click(function(){
        jQuery(this).closest("li").toggleClass("sub_active");
    });
    
    
    jQuery(".top-bar-search.top-bar-search-main-header .search-form-opener").click(function(){
        if(document.body.contains(document.getElementById('stHsearchCloser'))){}else{
            jQuery(".site-search-wrapper .search-form").append('<button id="stHsearchCloser"><i class="fal fa-times"></i></button>');
        }
    });
    

    jQuery(document).on('click', '#stHsearchCloser', function(e) {
        e.preventDefault();
        jQuery(".search-capture-click").click();
    });
    
});
 
function sc_auto_copy_text(link,copylink,copied) {

 
  
  var temp = jQuery("<input>");
    jQuery("body").append(temp);
    temp.val(link).select();
    document.execCommand("copy");
    temp.remove();
    
    
    //alert(copied);
    jQuery(".sc_autocopy").attr("aria-label", copied);
    
    setTimeout(function(){
         jQuery(".sc_autocopy").attr("aria-label", copylink);
    },3000);

}


//lessons dl button toaster
document.addEventListener("DOMContentLoaded", function () {
  // Handle click on disabled download buttons
  document.querySelectorAll(".stuadiare_dl_btn.st_disable").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();

      var title = el.dataset.toastTitle || "Notification";
      var message = el.dataset.toastMessage || "Something went wrong!";
      var type = el.dataset.toastType || "info"; // info, warning, error, success

      if (typeof toastr !== "undefined" && typeof toastr[type] === "function") {
        toastr[type](message, title, {
          positionClass: "toast-bottom-center",
          closeButton: true,
          progressBar: true
        });
      }
    });
  });

  // Handle Ajax add to cart event
  jQuery(document.body).on("added_to_cart", function (e, fragments, cart_hash, button) {
    // Get toast data from the clicked button
    var title = button[0].dataset.toastTitle || "Notification";
    var message = button[0].dataset.toastMessage || "Product added to cart!";
    var type = button[0].dataset.toastType || "success";

    // Display Toastr notification if Toastr is available
    if (typeof toastr !== "undefined" && typeof toastr[type] === "function") {
      toastr[type](message, title, {
        positionClass: "toast-bottom-center",
        closeButton: true,
        progressBar: true,
        timeOut: 3000 // Notification display duration in milliseconds
      });
    }
  });
});
/* Mobile off-canvas account menu */
document.addEventListener("DOMContentLoaded", function () {

    const mainHamburger = document.querySelector(".sc_dashboard_hamburger");
    const secondHamburger = document.querySelector(".scam-hamburger-btn");
    const offcanvasMenu = document.querySelector(".mobile-dropdown-menu");
    const backdrop = document.querySelector(".sc-offcanvas-backdrop");
    const body = document.body;

    const isMobileView = window.matchMedia("(max-width: 1200px)");

    /* Function: open offcanvas */
    function openOffcanvas() {
        if (!offcanvasMenu || !backdrop) return;
        offcanvasMenu.classList.add("active");
        backdrop.classList.add("active");
        body.classList.add("sc-offcanvas-open");
    }

    /* Function: close offcanvas */
    function closeOffcanvas() {
        if (!offcanvasMenu || !backdrop) return;
        offcanvasMenu.classList.remove("active");
        backdrop.classList.remove("active");
        body.classList.remove("sc-offcanvas-open");
    }


    /* -----------------------------------------
       Main dashboard hamburger
    ----------------------------------------- */
    if (mainHamburger) {
        mainHamburger.addEventListener("click", function (e) {

            // Always toggle dashboard sidebar
            mainHamburger.classList.toggle("active");
            body.classList.toggle("sc_woonav_in_side");

            // On mobile also toggle offcanvas menu
            if (isMobileView.matches) {
                e.stopPropagation();
                if (offcanvasMenu.classList.contains("active")) {
                    closeOffcanvas();
                } else {
                    openOffcanvas();
                }
            }
        });
    }


    /* -----------------------------------------
       Second hamburger (account menu)
    ----------------------------------------- */
    if (secondHamburger) {
        secondHamburger.addEventListener("click", function (e) {
            if (!isMobileView.matches) return;

            e.stopPropagation();

            if (offcanvasMenu.classList.contains("active")) {
                closeOffcanvas();
            } else {
                openOffcanvas();
            }
        });
    }


    /* -----------------------------------------
       Click on backdrop closes offcanvas
    ----------------------------------------- */
    if (backdrop) {
        backdrop.addEventListener("click", function () {
            closeOffcanvas();

            if (mainHamburger) {
                mainHamburger.classList.remove("active");
                body.classList.remove("sc_woonav_in_side");
            }
        });
    }


    /* -----------------------------------------
       Click outside closes menu
    ----------------------------------------- */
    document.addEventListener("click", function (e) {

        if (!isMobileView.matches) return;

        // Close offcanvas if open and click outside
        if (
            offcanvasMenu &&
            offcanvasMenu.classList.contains("active") &&
            !offcanvasMenu.contains(e.target) &&
            !(secondHamburger && secondHamburger.contains(e.target)) &&
            !(mainHamburger && mainHamburger.contains(e.target))
        ) {
            closeOffcanvas();
        }

        // Close dashboard hamburger if clicked outside
        if (
            mainHamburger &&
            mainHamburger.classList.contains("active") &&
            !mainHamburger.contains(e.target)
        ) {
            mainHamburger.classList.remove("active");
            body.classList.remove("sc_woonav_in_side");
        }
    });

});
