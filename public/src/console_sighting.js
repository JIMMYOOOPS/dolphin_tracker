// Set controllers for fieldset
let current_fs, next_fs, previous_fs;
let left, opacity, scale;
let animating;

$(".next").on('click', (function () {
  // Point to field set and next fieldset
  current_fs = $(this).parent();
  next_fs = $(this).parent().next();
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
  // Show next fieldset
  next_fs.show();
  // Hide current fieldset 
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now) {
        opacity = 1 - now;
        next_fs.css({opacity: opacity });
      },
      complete: function () {
        current_fs.hide();
      },
    }
  );
}));

$(".previous").on('click', (function () {
  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();
  $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
  previous_fs.show();
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now) {
        opacity = 1 - now;
        previous_fs.css({opacity: opacity});
      },
      complete: function () {
        current_fs.hide();
      },
      easing: "easeInOutBack"
    }
  );
})
);

// Data Picker Initialization
$('.datepicker').datepicker({
  dateFormat: "yy/mm/dd",
  timeFormat: 'HH:mm',
  onSelect: function(dateText, inst) {
    $('#'+inst.id).attr('value', dateText);
    console.log($('.datepicker').val())
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