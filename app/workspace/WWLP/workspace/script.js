$(document).ready(function() {
    var countDownDate = 1542931200000;
    var now = new Date().getTime();
    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
        clearInterval(x);
        document.getElementById("clock").innerHTML = "EXPIRED";
    }

    function updateTime() {
        now = new Date().getTime();
        distance = countDownDate - now;
        days = Math.floor(distance / (1000 * 60 * 60 * 24));
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('days').innerHTML = days + '<br><span style="font-size: 0.5em;" class="en-inline">DAYS</span><span style="font-size: 0.5em;" class="nl-inline">DAGEN</span><span style="font-size: 0.5em;" class="fr-inline">JOURS</span><span style="font-size: 0.5em;" class="de-inline">TAGE</span>';
        document.getElementById('hours').innerHTML = hours + '<br><span style="font-size: 0.5em;" class="en-inline">HOURS</span><span style="font-size: 0.5em;" class="nl-inline">UUR</span><span style="font-size: 0.5em;" class="fr-inline">HEURES</span><span style="font-size: 0.5em;" class="de-inline">STUNDEN</span>';
        document.getElementById('minutes').innerHTML = minutes + '<br><span style="font-size: 0.5em;" class="en-inline">MINUTES</span><span style="font-size: 0.5em;" class="nl-inline">MINUTEN</span><span style="font-size: 0.5em;" class="fr-inline">MINUTES</span><span style="font-size: 0.5em;" class="de-inline">MINUTEN</span>';
        document.getElementById('seconds').innerHTML = seconds + '<br><span style="font-size: 0.5em;" class="en-inline">SECONDS</span><span style="font-size: 0.5em;" class="nl-inline">SECONDEN</span><span style="font-size: 0.5em;" class="fr-inline">SECONDES</span><span style="font-size: 0.5em;" class="de-inline">SEKUNDEN</span>';
    }
    updateTime();

    var x = setInterval(function() {
        updateTime();
    }, 1000);


    var ajaxImages = (function(category) {
        function imageGrabber(category, target) {
            $.get(category, function(data) {
                // locating relevant image / link
                var imageSearch = $(data).find('.products-listing li > a > img');
                var linkSearch = $(data).find('.products-listing li > a');

                // transfer target image / link into an array
                var imageArray = $.map(imageSearch, function(imageVal, i) {
                    return imageVal;
                });
                var linkArray = $.map(linkSearch, function(linkVal, i) {
                    return linkVal;
                });

                // specify number of items to choose from
                var arrayLength = imageArray.length;

                function randomNum() {
                    return Math.floor(Math.random() * numCollection.length);
                }
                var numCollection = [];

                function randomNumArray() {
                    numCollection = [];
                    var num = 0;
                    while (numCollection.length < arrayLength) {
                        numCollection.push(num);
                        num++;
                    }
                    return numCollection;
                }
                // create image and link to be added to page
                function addLinkToImage(i) {
                    var linkedImage = '<a class="random-cat-image" href="' + linkArray[i].href + '"><img src="' + imageArray[i].src + '"></a>';
                    return linkedImage;
                }

                function insertImageIntoDom() {
                    randomNumArray();
                    var index1 = numCollection.splice(randomNum(), 1);

                    $(target).html(addLinkToImage(index1));
                }
                insertImageIntoDom();
            });
        }
        //change url to desired category
        function womens() {
            var targetUrl = "https://staging.riverisland.com/c/women/seasonal-offers";
            imageGrabber(targetUrl, '#product-1');
        }

        function mens() {
            var targetUrl = "https://staging.riverisland.com/c/men/seasonal-offers";
            imageGrabber(targetUrl, '#product-2');
        }

        function girls() {
            var targetUrl = "https://staging.riverisland.com/c/girls/gifts";
            imageGrabber(targetUrl, '#product-3');
        }

        function boys() {
            var targetUrl = "https://staging.riverisland.com/c/boys/gifts";
            imageGrabber(targetUrl, '#product-4');
        }

        function init() {
            womens();
            mens();
            girls();
            boys();
        }
        return {
            init: init
        };
    })();
    ajaxImages.init();
});