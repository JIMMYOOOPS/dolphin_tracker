// Set controllers for fieldset
let current_fs, next_fs, previous_fs;
let left, opacity, scale;
let current = 1;
let steps = $("fieldset").length; 
let animating;

setProgressBar(current);

$(".next").on('click', (function () {
  // Point to field set and next fieldset
  current_fs = $(this).parent();
  next_fs = $(this).parent().next();
  $(window).scrollTop(0);
  // Add Class Active according to step
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  // Show next fieldset
  next_fs.show();
  // Hide current fieldset 
  current_fs.animate({ opacity: 0 }, {
      step: function (now) {
        // Making fielset appear animation
        opacity = 1 - now;
        next_fs.css({opacity: opacity });
      },
      complete: function () {
        current_fs.hide();
      },
    });
    setProgressBar(++current);
    
}));

$(".previous").on('click', (function () {
  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();
  $(window).scrollTop(0);
  //Remove class active
  $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
  previous_fs.show();

  current_fs.animate({ opacity: 0 }, {
      step: function (now) {
        opacity = 1 - now;
        previous_fs.css({opacity: opacity});
      },
      complete: function () {
        current_fs.hide();
      },
      easing: "easeInOutBack"
    });
  setProgressBar(--current);
}));

function setProgressBar(currentStep){
  let percent = parseFloat(100 / steps) * currentStep;
  percent = percent.toFixed();
  $(".progress-bar")
    .css("width",percent+"%")   
}

// Data Picker Initialization
$('.datepicker').datepicker({
  dateFormat: "yy/mm/dd",
  timeFormat: 'HH:mm',
  onSelect: function(dateText, inst) {
    $('#'+inst.id).attr('value', dateText);
  }
});

// Time Picker Initialization
$('input.timepicker').timepicker({ timeFormat: 'HH:mm'});

// Default Value for Check boxes
$("form").on('submit', function () {
  let thisForm = $(this);
  thisForm.find('input[type="checkbox"]').each( function () {
      //Set unchecked values as 0
      let thisCheckbox = $(this);
      if( thisCheckbox.is(":checked") == true ) {
        thisCheckbox.attr('value','1');
      } else {
        thisCheckbox.prop('checked',true);    
        thisCheckbox.attr('value','0');
      }
  })
})

// Images upload
function readURL(input) {
  if (input.files && input.files[0]) {

    let reader = new FileReader();

    reader.onload = function(e) {
      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);

  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
  });
  $('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});
