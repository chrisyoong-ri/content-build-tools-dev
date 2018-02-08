'use strict';

$(document).ready(function () {

    // Refactor: mixing JQuery and Vanilla, remove embedded CSS (choose). Based on Womnen's trends
    window.innerWidth > 700 ? $('.tfw').addClass('ri-true-fw') : $('.tfw').removeClass('ri-true-fw');

    var header = document.getElementById('main-header');
    var headerHeight = header.offsetHeight;

    var topHero = document.getElementsByClassName('top-hero')[0];
    var topHeroHeight = topHero.offsetHeight;

    var mobTopHero = document.getElementsByClassName('mob-top-hero')[0];
    var mobTopHeroHeight = mobTopHero.offsetHeight;

    var fixedMenu = document.getElementsByClassName('fixed-menu')[0];
    var fixedMenuHeight = fixedMenu.offsetHeight;

    var hero = document.getElementsByClassName('hero')[0];
    var heroBottom = findDistance(hero) - headerHeight;

    var mobTopHeroBottom = findDistance(mobTopHero) - headerHeight;

    var promoOne = document.getElementsByClassName('promo-1')[0];
    if (window.innerWidth > 700) {
        hero.style.marginTop = fixedMenuHeight + 'px';
    } else {
        hero.style.marginTop = 0;
    }
    var promoThree = document.getElementsByClassName('promo-3')[0];

    // DISTANCE TO TOP
    function findDistance(element) {
        var distance = 0;
        while (element) {
            distance += element.offsetTop;
            element = element.offsetParent;
        }
        return distance;
    }

    // Scroll to link
    // Refactor: DRY, click is hijacked, progressive enhancement not possible.
    $(".fixed-menu .c1").click(function () {
        $('html, body').animate({
            scrollTop: $("#courtside-prep").offset().top - 145
        }, 600);
    });
    $(".fixed-menu .c2").click(function () {
        $('html, body').animate({
            scrollTop: $("#modern-miami").offset().top - 145
        }, 600);
    });
    $(".fixed-menu .c3").click(function () {
        $('html, body').animate({
            scrollTop: $("#mexicana").offset().top - 145
        }, 600);
    });
    $(".fixed-menu .c4").click(function () {
        $('html, body').animate({
            scrollTop: $("#new-heritage").offset().top - 145
        }, 600);
    });

    // Sticky menu for desktop and mobile. 
    // Refactor: adjust to class, not embedd CSS. Alter to shared function for all views.
    function fixedMenuPos() {
        if (window.scrollY >= heroBottom) {
            fixedMenu.style.position = 'fixed';
            fixedMenu.style.top = headerHeight + 'px';
        } else {
            fixedMenu.style.position = 'absolute';
            fixedMenu.style.top = topHeroHeight + 'px';
        }
    }
    fixedMenuPos();

    function fixedMenuPosMob() {
        if (window.scrollY >= mobTopHeroHeight) {
            fixedMenu.style.position = 'fixed';
            fixedMenu.style.top = headerHeight + 'px';
        } else {
            fixedMenu.style.position = 'absolute';
            fixedMenu.style.top = mobTopHeroHeight + 'px';
        }
    }

    // Sticky menu for desktop and mobile. 
    // Refactor: mobile first, DRY

    $(function () {
        if (window.innerWidth <= 700) {
            fixedMenuPosMob();
            $(".fixed-menu .c1").click(function () {
                $('html, body').animate({
                    scrollTop: $("#courtside-prep-mob").offset().top - 93
                }, 600);
            });
            $(".fixed-menu .c2").click(function () {
                $('html, body').animate({
                    scrollTop: $("#modern-miami-mob").offset().top - 93
                }, 600);
            });
            $(".fixed-menu .c3").click(function () {
                $('html, body').animate({
                    scrollTop: $("#mexicana-mob").offset().top - 93
                }, 600);
            });
            $(".fixed-menu .c4").click(function () {
                $('html, body').animate({
                    scrollTop: $("#new-heritage-mob").offset().top - 93
                }, 600);
            });
        } else {
            fixedMenuPos();
        }
    });

    // function isScrolledIntoView(elem) {
    //     var docViewTop = $(window).scrollTop();
    //     var docViewBottom = docViewTop + $(window).height();

    //     var elemTop = $(elem).offset().top;
    //     var elemBottom = elemTop + $(elem).height();

    //     return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    // }


    // $(window).scroll(function () {
    //     $('.campaign-1').each(function () {
    //        if (isScrolledIntoView(this) === true) {
    //            $('.c1').addClass('in-view')
    //        }
    //     });
    //     $('.campaign-2').each(function () {
    //         if (isScrolledIntoView(this) === true) {
    //             $('.c2').addClass('in-view')
    //         }
    //      });
    //      $('.campaign-3').each(function () {
    //         if (isScrolledIntoView(this) === true) {
    //             $('.c3').addClass('in-view')
    //         }
    //      });
    //      $('.campaign-4').each(function () {
    //         if (isScrolledIntoView(this) === true) {
    //             $('.c4').addClass('in-view')
    //         }
    //      });
    //  });


    // FIXED SCROLLING
    // Refactor: expensive, checks on every scroll event. Find alterntive.
    $(window).on('scroll', function () {
        if (window.innerWidth <= 700) {
            fixedMenuPosMob();
        } else {
            fixedMenuPos();
        }
    });
});