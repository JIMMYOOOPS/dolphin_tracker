// Toggle sidebar
$('.toggle-button').on('click', () => {
    document.querySelector('sidebar-component').shadowRoot.querySelector('.util')
    .classList.remove("hide")
    .classList.toggle("show");
  })