const sidebarTemplate = document.createElement('template');

sidebarTemplate.innerHTML = `
<style>

a {
    font-weight: 700;
    color: #fff;
    text-decoration: none;
}

a:hover {
    padding-bottom: 5px;
    box-shadow: inset 0 -2px 0 0 #fff;
}

.util {
    min-height: 100%;
    width: 30vh;
    background-color: black;
}

.user {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    height: 20vh;
    width: 30vh;
}

.user-logo-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    height: 15vh;
    width: 15vh;
}

.user-logo {
    height: 13vh;
    width: 13vh;
    margin-top: 30px;
    border-radius: 50%;
    background-color: #bbb;
}

.user-info {
    height: 15vh;
    width: 15vh;
    color: white;
    /* margin-top: 50px; */
}

.user-name {
    color: white;
    margin-top: 50px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
}

.user-admin {
    color: white;
    font-family: "Maison Neue Book","Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    margin-top: 10px;
    margin-left: 20px;
}
  
ul li {
    list-style: none;
    height: 5vh;
    width: 30vh;
    margin: 0 20px;
}


ul {
    margin-top: 100px
}
  </style>
  <sidebar>
    <div class="util">
    <div class="user">
        <div class="user-logo"></div>
        <div class="user-info">
            <div class="user-name" >劉寯碩 </div> 
            <br>
            <div class="user-admin" >權限： </div>
        </div>
    </div>
    <ul>
        <li><a href="http://localhost:3000/console_sighting.html">鯨豚目擊紀錄</a></li>
        <li><a href="http://localhost:3000/console_db.html">鯨豚目擊資料庫</a></li>
        <li><a href="http://localhost:3000/console_statistic.html">統計資料</a></li>
        <li><a href="http://localhost:3000/console_users.html">使用者管理</a></li>
    </ul>   
    </div>
  </sidebar>
`;

class Sidebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.appendChild(sidebarTemplate.content);
  }
}

customElements.define('sidebar-component', Sidebar);