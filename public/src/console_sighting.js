// const form = document.querySelector("#your-form")
// const url = "https://jsonplaceholder.typicode.com/posts"

// form.addEventListener('submit', e => {
//   e.preventDefault()

//   const data = new FormData(e.target)
 
//   fetch(url, {
//     method: 'POST',
//     body: new URLSearchParams(data)
//   })
// })

// Data Picker Range Initialization
// $(function() {
//   $('input[class="daterange"]').daterangepicker({
//     opens: 'left'
//   }, function(start, end, label) {
//     console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
//   });
// });

// Data Picker Initialization
$('.datepicker').datepicker({
  dateFormat: "yy/mm/dd",
});

const input = document.querySelector('input[type="file"]')
const dropzone = document.querySelector('.dropzone')

dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
});
dropzone.addEventListener('dragenter', (event) => {
  event.stopPropagation();
  event.target.classList.add('dropzone--droppable')
});
dropzone.addEventListener('dragleave', (event) => {
  event.stopPropagation();
  event.target.classList.remove('dropzone--droppable')
});

dropzone.addEventListener('drop', (event) => {
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