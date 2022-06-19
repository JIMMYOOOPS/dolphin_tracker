const footerTemplate = document.createElement('template');

footerTemplate.innerHTML = `
  <style>
    footer {
      height: 60px;
      padding: 0 10px;
      display: flex;
      flex-shrink: 0;
      justify-content: flex-end;
      align-items: center;
      background-color: #102F4A;
    }

    ul {
      padding: 0;
    }
    
    ul li {
      list-style: none;
      display: inline;
    }
    

    a {
      font-weight: 700;
      margin: 0 40px;
      color: #fff;
      text-decoration: none;
    }
    
    #contribute {
      font-size: 0.25rem;
    }

    a:hover {
      padding-bottom: 5px;
      box-shadow: inset 0 -2px 0 0 #fff;
    }
  </style>
  <footer>
    <ul>
      <li><a href="about.html">Facebook</a></li>
      <li><a href="work.html">Insagram</a></li>
      <li><a href="contact.html">Youtube</a></li>
      <li id = "contribute"><a href="http://www.freepik.com">Designed by rawpixel.com/Freepik</a><li>
    </ul>
  </footer>
`;

class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // const fontAwesome = document.querySelector('link[href*="font-awesome"]'); //for cutomizing fonts
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    // if (fontAwesome) {
    //   shadowRoot.appendChild(fontAwesome.cloneNode());
    // } else {
        shadowRoot.appendChild(footerTemplate.content);
    // }
  }
}

customElements.define('footer-component', Footer);