$(document).ready(function(){

  //SVG Fallback
  if(!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function() {
      return $(this).attr("src").replace(".svg", ".png");
    });
  };

  // Tooltip
  $('.tooltip').tooltipster({
    contentAsHTML: true,
    hideOnClick: true,
    trigger: 'hover',
    interactive: true,
    interactiveTolerance: 1500,
    functionInit: function(){
        return $('#my-tooltip').html();
    },
    functionReady: function(){
        $('#my-tooltip').attr('aria-hidden', false);
    },
    functionAfter: function(){
        $('#my-tooltip').attr('aria-hidden', true);
    }
  });

  $('.tooltip2').tooltipster({
    contentAsHTML: true,
    hideOnClick: true,
    trigger: 'hover',
    interactive: true,
    interactiveTolerance: 1500,
    functionInit: function(){
        return $('#my-tooltip2').html();
    },
    functionReady: function(){
        $('#my-tooltip2').attr('aria-hidden', false);
    },
    functionAfter: function(){
        $('#my-tooltip2').attr('aria-hidden', true);
    }
  });

  // Magnific popup gallery
  $('.gallery').each(function() {
    $(this).magnificPopup({
      delegate: '.gallery-item',
      type: 'image',
      gallery:{
        enabled:true
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  });

  //Chrome Smooth Scroll
  try {
      $.browserSelector();
      if($("html").hasClass("chrome")) {
          $.smoothScroll();
      }
  } catch(err) {

  };

  // Teachers carousel
  function teachersRow() {
    var checkWidth = $(window).width();
    var demo = $("#teachers__row");
    if (checkWidth > 767) {
      demo.data('owlCarousel') && demo.data('owlCarousel').destroy();
      demo.removeClass('owl-carousel');
    } else if (checkWidth < 768) {
      demo.owlCarousel({
        dots: false,
        navigation: true,
        singleItem: true,
        navigationText : ["",""],
        autoPlay: true
      });
    }
  }
  $(document).ready(teachersRow);
  $(window).resize(teachersRow);

  // Footer top accordion
  function menuAccordion(){
    var checkWidth = $(window).width();
    if (checkWidth <= 991) {
      $('.footer__top nav li ul').hide();
      $('.footer__top nav > ul > li > a').removeClass('active');
      $('.footer__top nav > ul > li > a').click(function(){
        if ($(this).attr('class') != 'active'){
          $('.footer__top nav li ul').slideUp();
          $(this).next().slideToggle();
          $('.footer__top nav li a').removeClass('active');
          $(this).addClass('active');
        }
        return false;
      });
    } else if (checkWidth > 992) {
      $('.footer__top nav > ul > li > a').unbind('click');
      $('.footer__top nav li ul').show();
      $('.footer__top nav > ul > li > a').removeClass('active');
    }
  }
  $(document).ready(menuAccordion);
  $(window).resize(menuAccordion);

  // Teachers carousel
  function calendarRow() {
    var checkWidth = $(window).width();
    var demo = $("#calendar__year__row");
    if (checkWidth > 767) {
      demo.data('owlCarousel') && demo.data('owlCarousel').destroy();
      demo.removeClass('owl-carousel');
    } else if (checkWidth < 768) {
      demo.owlCarousel({
        dots: false,
        navigation: true,
        singleItem: true,
        navigationText : ["",""],
        autoPlay: false,
        touchDrag: false,
        loop: true
      });
    }
  }
  $(document).ready(calendarRow);
  $(window).resize(calendarRow);

  // croll
  $(window).load(function(){
      var amount=Math.max.apply(Math,$(".yogaCenters__body .div").map(function(){return $(this).outerWidth(true);}).get());

      $(".yogaCenters__body").mCustomScrollbar({
        axis:"x",
        mouseWheel: true,
        //scrollInertia: 10
      });
  });

  // About scroll
  function aboutBodyCollapse(){
    var checkWidth = $(window).width();
    if (checkWidth <= 767) {
      $("#aboutBody__description").collapse('hide');
      $("#aboutBody__description").on("hide.bs.collapse", function(){
        $(".aboutBody__introtext .btn").html('Подробнее');
      });
      $("#aboutBody__description").on("show.bs.collapse", function(){
        $(".aboutBody__introtext .btn").html('Свернуть');
      });
    } else if (checkWidth > 768){
      $("#aboutBody__description").collapse('show');
    }
  }
  $(document).ready(aboutBodyCollapse);
  $(window).resize(aboutBodyCollapse);

  // menu
  $(".sandwich").click(function() {
    slideout.toggle();
    $(".sandwich").toggleClass('active');
    return false;
  });

  var slideout = new Slideout({
    'panel': document.getElementById('base'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70,
    'touch': false,
    'side': 'right'
  });
  slideout.on('beforeopen', function() {
    document.querySelector('html').classList.add('slideout-open');
  });
  slideout.off('beforeclose', function() {
    document.querySelector('html').classList.remove('slideout-open');
  });

  // scroll top
  $("#back-top").hide();
  $(function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 250) {
        $('#back-top').fadeIn();
      } else {
        $('#back-top').fadeOut();
      }
    });
  $('#back-top').click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 800);
    return false;
    });
  });

  // styler
  $('input.styler, select.styler').styler();

  // simpleForm
  simpleForm('form.form-callback');
})

$(window).load(function() {
  // $(".loader_inner").fadeOut();
  $(".loader").delay(400).fadeOut("slow");
});

/*
version 2015-09-23 14:30 GMT +2
*/
function simpleForm(form, callback) {
     $(document).on('submit', form, function(e){
        e.preventDefault();

        var formData = {};

        var hasFile = false;

        if ($(this).find('[type=file]').length < 1) {
            formData = $(this).serialize();
        }
        else {
            formData = new FormData();
            $(this).find('[name]').each(function(){

                switch($(this).prop('type')) {

                    case 'file':
                        if ($(this)[0]['files'].length > 0) {
                            formData.append($(this).prop('name'), $(this)[0]['files'][0]);
                            hasFile = true;
                        }
                        break;

                    case 'radio':
                    case 'checkbox':
                        if (!$(this).prop('checked')) {
                            break;
                        }
                        formData.append($(this).prop('name'), $(this).val().toString());
                        break;

                    default:
                        formData.append($(this).prop('name'), $(this).val().toString());
                        break;
                }
            });
        }

        $.ajax({
            url: $(this).prop('action'),
            data: formData,
            type: 'POST',
            contentType : hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
            cache       : false,
            processData : false,
            success: function(response) {
                $(form).removeClass('ajax-waiting');
                $(form).html($(response).find(form).html());

                if (typeof callback === 'function') {
                    callback(response);
                }
            }
        });

        $(form).addClass('ajax-waiting');

        return false;
    });
}
