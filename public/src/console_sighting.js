(async function validateAccessToken() {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        alert('Please Sign In')
        return window.location.href = '/console_login.html'
        } else {
            const url = '/admin/console/sighting';
            const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + accessToken
            }
        };
        let rawSightingResponse = await fetch(url, options);
        if (rawSightingResponse.status !== 200) {
          alert('You are forbidden to enter this page.')
          return window.location.href = '/console_login.html';
        }
    }
  } catch(error) {
    throw error
  }
})()


// Toggle sidebar
document.querySelector('sidebar-component').shadowRoot.querySelector('.sidebar-toggle').addEventListener('click', function close(event) {
  $('#form-sighting').addClass("hide");
});

$('.toggle-button').on('click', () => {
  document.querySelector('sidebar-component').shadowRoot.querySelector('.util')
  .classList.remove("hide");
})

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

let date = new Date().toISOString().substring(0, 10);
$('.date').val(date);

// Time Picker Initialization
$('input.timepicker').timepicker({ 
  timeFormat: 'HH:mm',
  interval: 30,
  scrollbar: true
});

// Default Value for Check boxes
$("form").on('submit', async function (event) {
  let thisForm = $(this);
  event.preventDefault();
  thisForm.find('input[type="checkbox"]').each( function () {
      //Set unchecked values as 0
      let thisCheckbox = $(this);
      if( thisCheckbox.is(":checked") == true ) {
        thisCheckbox.attr('value','1');
      } else {
        thisCheckbox.prop('checked',true);    
        thisCheckbox.attr('value','0');
      }
  });

 const form =  document.getElementsByTagName("form")[0]
  const formData = new FormData(form)
  let url = '/admin/console/sighting'
  let options = {
    method: 'POST',
    body: formData,
  }

  let result = await fetch(url, options)
  if (result.status === 201) {
    alert('Files have been uploaded')
    window.location = '/console_sighting.html'
  } else {
    alert('Upload has failed')
  }
})