// Set controllers for fieldset
let current_fs, next_fs, previous_fs;
let left, opacity, scale;
<<<<<<< HEAD
let current = 1;
let steps = $("fieldset").length; 
let animating;

setProgressBar(current);

=======
let animating;

>>>>>>> aa6fd82edf6edb3ef3c24688f480f8f5338badd9
$(".next").on('click', (function () {
  // Point to field set and next fieldset
  current_fs = $(this).parent();
  next_fs = $(this).parent().next();
<<<<<<< HEAD
  $(window).scrollTop(0);
  // Add Class Active according to step
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  // Show next fieldset
  next_fs.show();
  // Hide current fieldset 
  current_fs.animate({ opacity: 0 }, {
      step: function (now) {
        // Making fielset appear animation
=======
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
  // Show next fieldset
  next_fs.show();
  // Hide current fieldset 
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now) {
>>>>>>> aa6fd82edf6edb3ef3c24688f480f8f5338badd9
        opacity = 1 - now;
        next_fs.css({opacity: opacity });
      },
      complete: function () {
        current_fs.hide();
      },
<<<<<<< HEAD
    });
    setProgressBar(++current);
    
=======
    }
  );
>>>>>>> aa6fd82edf6edb3ef3c24688f480f8f5338badd9
}));

$(".previous").on('click', (function () {
  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();
<<<<<<< HEAD
  $(window).scrollTop(0);
  //Remove class active
  $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
  previous_fs.show();

  current_fs.animate({ opacity: 0 }, {
=======
  $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
  previous_fs.show();
  current_fs.animate(
    { opacity: 0 },
    {
>>>>>>> aa6fd82edf6edb3ef3c24688f480f8f5338badd9
      step: function (now) {
        opacity = 1 - now;
        previous_fs.css({opacity: opacity});
      },
      complete: function () {
        current_fs.hide();
      },
      easing: "easeInOutBack"
<<<<<<< HEAD
    });
  setProgressBar(--current);
}));

function setProgressBar(currentStep){
  let percent = parseFloat(100 / steps) * currentStep;
  percent = percent.toFixed();
  $(".progress-bar")
    .css("width",percent+"%")   
}
=======
    }
  );
})
);
>>>>>>> aa6fd82edf6edb3ef3c24688f480f8f5338badd9

// Data Picker Initialization
$('.datepicker').datepicker({
  dateFormat: "yy/mm/dd",
  timeFormat: 'HH:mm',
  onSelect: function(dateText, inst) {
    $('#'+inst.id).attr('value', dateText);
<<<<<<< HEAD
=======
    console.log($('.datepicker').val())
>>>>>>> aa6fd82edf6edb3ef3c24688f480f8f5338badd9
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

<<<<<<< HEAD
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
=======

function dragdrop() {
  console.log('here')
  const input = $('input[type="file"]')
  const dropzone = $('.dropzone')
  console.log('here1')
  dropzone.on('dragover', (event) => {
    event.preventDefault();
  });
  dropzone.on('dragenter', (event) => {
    event.stopPropagation();
    event.target.classList.add('dropzone--droppable')
  });
  dropzone.on('dragleave', (event) => {
    event.stopPropagation();
    event.target.classList.remove('dropzone--droppable')
  });

  dropzone.on('drop', (event) => {
    event.preventDefault();
    event.target.classList.remove('dropzone--droppable')

    let files = event.dataTransfer.files

    if (!input.multiple && files.length > 1) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(files[0])
      files = dataTransfer.files
    }
    
    input.files = files

    input.focus()
    input.dispatchEvent(new Event('change'));
  });

  input.addEventListener('change', (event) => {
    const files = Array.from(event.target.files)
    console.log('Do something with files:', files)
  })
};
>>>>>>> aa6fd82edf6edb3ef3c24688f480f8f5338badd9
