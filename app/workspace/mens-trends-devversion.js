$(document).ready(function () {

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
    if (window.innerWidth > 700) { hero.style.marginTop = fixedMenuHeight + 'px'; } else { hero.style.marginTop = 0; }
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


    $(".fixed-menu .c1").click(function() {
        $('html, body').animate({
            scrollTop: $("#courtside-prep").offset().top -145
        }, 600);
    });
    $(".fixed-menu .c2").click(function() {
        $('html, body').animate({
            scrollTop: $("#modern-miami").offset().top -145
        }, 600);
    });
    $(".fixed-menu .c3").click(function() {
        $('html, body').animate({
            scrollTop: $("#mexicana").offset().top -145
        }, 600);
    });
    $(".fixed-menu .c4").click(function() {
        $('html, body').animate({
            scrollTop: $("#new-heritage").offset().top -145
        }, 600);
    });




    // $(function () {
    //     if (window.innerWidth <= 700) {


    //     }
    // }

            // $('.fixed-menu .c1').on('click', function (e) {

            // $(".c1").scrollTo('#courtside-prep');
            // $(".c2").scrollTo('#modern-miami');
            // $(".c3").scrollTo('#mexicana');
            // $(".c4").scrollTo('#new-heritage');

            // if $(".fixed-menu .c1").click(function () {
            //     $('html, body').animate({
            //         scrollTop: $("#courtside-prep").offset().top
            //     }, 1000);
            // } else if {
            //     $(".fixed-menu .c2").click(function() {
            //         $('html, body').animate({
            //             scrollTop: $("#modern-miami").offset().top
            //         }, 1000);
            //     }
            // } else if {
            //     $(".fixed-menu .c3").click(function() {
            //         $('html, body').animate({
            //             scrollTop: $("#mexicana").offset().top
            //         }, 1000);
            //     }
            // } else if {
            //     $(".fixed-menu .c4").click(function() {
            //         $('html, body').animate({
            //             scrollTop: $("#new-heritage").offset().top
            //         }, 1000);
            //     }
            // }
        
    


                    // $(".fixed-menu .c2").click(function() {
                    //     $('html, body').animate({
                    //         scrollTop: $("#modern-miami").offset().top
                    //     }, 1000);
                    // });


                // $('.campaign-1, .campaign-2, .campaign-3, .campaign-4').css(unactive);
                // $('.fixed-menu-underline').removeClass('fixed-menu-underline');
                // window.scrollTo(0, 0);
                // if (e.currentTarget.classList[0] === 'c1') {
                //     // $('.campaign-1').css(active);
                //     e.currentTarget.classList.add('fixed-menu-underline');
                // } else if (e.currentTarget.classList[0] === 'c2') {
                //     // $('.campaign-2').css(active);
                //     e.currentTarget.classList.add('fixed-menu-underline');
                // } else if (e.currentTarget.classList[0] === 'c3') {
                //     // $('.campaign-3').css(active);
                //     e.currentTarget.classList.add('fixed-menu-underline');
                // } else if (e.currentTarget.classList[0] === 'c4') {
                //     // $('.campaign-4').css(active);
                //     e.currentTarget.classList.add('fixed-menu-underline');
                // }
            // });





        //     $( ".fixed-menu" ).click(function( event ) {
        //         event.preventDefault();

        //                 // Select all links with hashes

            //                   $("a[href*='#courtside-prep']").scrollTo('#courtside-prep-mob');
            // $("a[href*='#modern-miami']").scrollTo('#modern-miami-mob');
            // $("a[href*='#mexicana']").scrollTo('#mexicana-mob');
            // $("a[href*='#new-heritage']").scrollTo('#new-heritage-mob');


            // $("a[href*='#courtside-prep']")
            // $("a[href*='#modern-miami']")
            // $("a[href*='#mexicana']")
            // $("a[href*='#new-heritage']")
            // // $('a[href*="#"]')
            // // Remove links that don't actually link to anything
            // .not('[href="#"]')
            // .not('[href="#0"]')
            // .click(function(event) {
            // // On-page links
            // if (
            //     location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
            //     && 
            //     location.hostname == this.hostname
            // ) {
            //     // Figure out element to scroll to
            //     var target = $(this.hash);
            //     target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            //     // Does a scroll target exist?
            //     if (target.length) {
            //     // Only prevent default if animation is actually gonna happen
            //     event.preventDefault();
            //     $('html, body').animate({
            //         scrollTop: target.offset().top
            //     }, 1000, function() {
            //         // Callback after animation
            //         // Must change focus!
            //         var $target = $(target);
            //         $target.focus();
            //         if ($target.is(":focus")) { // Checking if the target was focused
            //         return false;
            //         } else {
            //         $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            //         $target.focus(); // Set focus again
            //         };
            //     });
            //     }
            // }
            // });

            //           });







            // $("a[href*='#courtside-prep']").scrollTo('#courtside-prep-mob');
            // $("a[href*='#modern-miami']").scrollTo('#modern-miami-mob');
            // $("a[href*='#mexicana']").scrollTo('#mexicana-mob');
            // $("a[href*='#new-heritage']").scrollTo('#new-heritage-mob');

        // } else {
            // $('.fixed-menu li').on('click', function (e) {
            //     // $('.campaign-1, .campaign-2, .campaign-3, .campaign-4').css(unactive);
            //     $('.fixed-menu-underline').removeClass('fixed-menu-underline');
            //     window.scrollTo(0, 0);
            //     if (e.currentTarget.classList[0] === 'c1') {
            //         // $('.campaign-1').css(active);
            //         e.currentTarget.classList.add('fixed-menu-underline');
            //     } else if (e.currentTarget.classList[0] === 'c2') {
            //         // $('.campaign-2').css(active);
            //         e.currentTarget.classList.add('fixed-menu-underline');
            //     } else if (e.currentTarget.classList[0] === 'c3') {
            //         // $('.campaign-3').css(active);
            //         e.currentTarget.classList.add('fixed-menu-underline');
            //     } else if (e.currentTarget.classList[0] === 'c4') {
            //         // $('.campaign-4').css(active);
            //         e.currentTarget.classList.add('fixed-menu-underline');
            //     }
            // });
    //     }
    // });


    // CAMPAIGN SELECTOR
    // var active = { 'z-index': 5, 'opacity': 1, 'position': 'relative' };
    // var unactive = { 'z-index': 1, 'opacity': 0, 'position': 'absolute' };



    // $('.fixed-menu li').on('click', function (e) {
    //     $('.fixed-menu-underline').removeClass('fixed-menu-underline');
    //     if (e.currentTarget.classList[0] === 'c1') {
    //         e.currentTarget.classList.add('fixed-menu-underline');
    //     } else if (e.currentTarget.classList[0] === 'c2') {
    //         e.currentTarget.classList.add('fixed-menu-underline');
    //     } else if (e.currentTarget.classList[0] === 'c3') {
    //         e.currentTarget.classList.add('fixed-menu-underline');
    //     } else if (e.currentTarget.classList[0] === 'c4') {
    //         e.currentTarget.classList.add('fixed-menu-underline');
    //     }
    // });

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
            // console.log(mobTopHeroBottom);
            fixedMenu.style.top = headerHeight + 'px';
        } else {
            fixedMenu.style.position = 'absolute';
            // console.log(mobTopHeroBottom);
            // console.log(findDistance(mobTopHeroHeight) - mobTopHero);
            // console.log("mobile-fire");
            // console.log(mobTopHero);
            // console.log(mobTopHeroHeight);
            fixedMenu.style.top = mobTopHeroHeight + 'px';
        }
    }

    $(function () {
        if (window.innerWidth <= 700) {
            // $("a[href*='#courtside-prep']").attr('href', '#courtside-prep-mob');
            // $("a[href*='#modern-miami']").attr('href', '#modern-miami-mob');
            // $("a[href*='#mexicana']").attr('href', '#mexicana-mob');
            // $("a[href*='#new-heritage']").attr('href', '#new-heritage-mob');

            // $('.fixed-menu a#courtside-prep').attr('href', '#courtside-prep-mob');
            // $('.fixed-menu a#modern-miami').attr('href', '#modern-miami-mob');
            // $('.fixed-menu a#mexicana').attr('href', '#mexicana-mob');
            // $('.fixed-menu a#new-heritage').attr('href', '#new-heritage-mob');
            fixedMenuPosMob();





            $(".fixed-menu .c1").click(function() {
                $('html, body').animate({
                    scrollTop: $("#courtside-prep-mob").offset().top -93
                }, 600);
            });
            $(".fixed-menu .c2").click(function() {
                $('html, body').animate({
                    scrollTop: $("#modern-miami-mob").offset().top -93
                }, 600);
            });
            $(".fixed-menu .c3").click(function() {
                $('html, body').animate({
                    scrollTop: $("#mexicana-mob").offset().top -93
                }, 600);
            });
            $(".fixed-menu .c4").click(function() {
                $('html, body').animate({
                    scrollTop: $("#new-heritage-mob").offset().top -93
                }, 600);
            });




        } else {
            fixedMenuPos();
        }
    });

    // FIXED SCROLLING
    $(window).on('scroll', function () {
        if (window.innerWidth <= 700) {
            fixedMenuPosMob();
        } else {
            fixedMenuPos();
        }
    });

    // $(window).on('resize', function () {
    //     headerHeight = header.offsetHeight;
    //     heroBottom = findDistance(hero) - headerHeight;
    //     fixedMenuHeight = fixedMenu.offsetHeight;
    //     if (window.innerWidth > 700) { hero.style.marginTop = fixedMenuHeight + 'px'; } else { hero.style.marginTop = 0; }
    //     window.innerWidth > 700 ? $('.tfw').addClass('ri-true-fw') : $('.tfw').removeClass('ri-true-fw');
    // });

});