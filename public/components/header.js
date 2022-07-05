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
      text-decoration: none;
      width: 80px;
    }
    
    a:hover {
      padding-bottom: 5px;
      box-shadow: inset 0 -2px 0 0 #fff;
    }

    .logo {
      margin: 0 40px;
      display: inline-block;
      background-color: #fff;
      border-radius: 60%;
      width: 80px;
    }

    img {
      display: block;
      margin: auto;
      width: 50%;
    }
  </style>
  <header>
    <nav>
      <ul>
        <li>
          <span class="logo">
            <a href="/index.html">
              <img src="/assets/icon.png" height="45px" alt="Logo">
            </a>
          </span>
        </li>
        <li><a href="/tracker.html">追蹤鯨豚</a></li>
        <li><a href="/species.html">認識鯨豚</a></li>
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