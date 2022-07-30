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
    cursor: pointer;
}

button:hover {
    cursor: pointer;
    background-color: #464646;
    transition: 0.05s;
}

.util {
    position:absolute;
    left: 0;
    top: 0;
    min-height: 100%;
    width: 30vh;
    background-color: black;
    display: flex;
    flex-direction: column;
}

.hide {
    transform: translateX(-100%);
}

.show {
    transform: translateX(0);
}

.sidebar-toggle {
    margin-left: auto;
    width: 50px;
    height: 50px;
    background-color: #232323;
    color: #fff;
    font-size: 1.75rem;
    border-radius:10px;
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
    margin-top: 15vh;
}

button:hover {
    cursor: pointer;
    box-shadow: 0 0 0 1px #fff, 0 0 0 1px #fff;
    background-color: #102F4A !important;
    color: #fff;
    cursor: pointer;
}

#button-logout {
    margin: 10px 0 0 30px;
    color: #fff;
    font-size: 1rem;
    background-color: #39708f;
    display: block;
    width: 20vh;
    height: 40px;
}

  </style>
  <sidebar>
    <div class="util">
    <button class="sidebar-toggle" onclick="close()">☰</button>
    <ul>
        <li><a id="sighting">鯨豚目擊紀錄</a></li>
        <li><a id="database">鯨豚目擊資料庫</a></li>
        <li><a id="users">使用者管理</a></li>
    </ul>
    <button id="button-logout">登出</button>
    </div>
  </sidebar>
`;

const script = document.createElement('script');
script.textContent = `
document.querySelector('sidebar-component').shadowRoot.querySelector('.sidebar-toggle').addEventListener('click', function close(event) {
    document.querySelector('sidebar-component').shadowRoot.querySelector('.util').classList.toggle("hide");
});

document.querySelector('sidebar-component').shadowRoot.querySelector('#sighting').addEventListener('click', async function(event) {
    window.location.href = '/console_sighting.html';
});

document.querySelector('sidebar-component').shadowRoot.querySelector('#database').addEventListener('click', async function(event) {
    window.location.href = '/console_db.html';
});

document.querySelector('sidebar-component').shadowRoot.querySelector('#users').addEventListener('click', async function(event) {
    window.location.href = '/console_users.html';
});


(async () => {
    try {
        const accessToken = localStorage.getItem('access_token');
        let url ='/admin/console/users/login'
        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + accessToken
            },
        }
        async function getData(url, options) {
            try {
                let rawData = await fetch(url, options);
                let data = await rawData.json();
                return data;
        } catch (err) {
            console.log(err.message);
            }
        };
    let result = await getData(url, options)
    // document.querySelector('sidebar-component').shadowRoot.querySelector('.user-name').innerText = result.name
    // document.querySelector('sidebar-component').shadowRoot.querySelector('.user-admin').innerText = result.role_id
    } catch (err) {
        console.log(err);
    }
})()

document.querySelector('sidebar-component').shadowRoot.querySelector('#button-logout').addEventListener('click', function(event) {
    localStorage.removeItem('access_token')
    window.location.href = '/admin/console'
  });
`;

class Sidebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(sidebarTemplate.content);
    shadowRoot.appendChild(script);
  }
}

customElements.define('sidebar-component', Sidebar);
