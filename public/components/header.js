const headerTemplate = document.createElement('template');

headerTemplate.innerHTML = `
  <style>
    nav {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background-color:  #102F4A;
    }

    ul {
      padding: 0;
    }
    
    ul li {
      list-style: none;
      display: inline;
      vertical-align: middle;
    }
    
    a {
      font-weight: 700;
      margin: 0 40px;
      color: #fff;
      text-align: center !important;
      text-decoration: none;
      width: 80px;
      display: inline-block;
    }
    
    a:hover {
      padding-bottom: 5px;
      box-shadow: inset 0 -2px 0 0 #fff;
    }

    #logo:hover {
      padding-bottom: 5px;
      box-shadow: none;
    }

    .logo {
      background-color: #f8f9fa;
      border-radius: 100%;
      display:inline-block;
      width: 50px;
      height:50px;
    }

    img {
      display: inline-block;
      width: 44%;
      background-color: #f5f3f4;
      border-radius: 100%;
      border: 3px solid #f5f3f4;
    }

  </style>
  <header>
    <nav>
      <ul>
        <li>
          <a href="/index.html" id="logo">
            <img src="/assets/icon.png" height="35px" alt="Logo">
          </a>
        </li>
        <li><a href="/tracker.html">追蹤鯨豚</a></li>
        <li><a href="/species.html">認識鯨豚</a></li>
        <li><a href="/console_login.html">進入後台</a></li>
      </ul>
    </nav>
  </header>
`;

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.appendChild(headerTemplate.content);
  }
}

customElements.define('header-component', Header);
