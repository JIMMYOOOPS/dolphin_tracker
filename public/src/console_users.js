(async () => {
  try {
      const accessToken = localStorage.getItem('access_token');
      let url =`/admin/console/users`
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
      let userData = result['data']
      function createUserCard(userData) {
        for (i= 0 ; i < userData.length; i++) {
          const user = $('<div></div>', {
            id: `user-${i}`,
            class: "user"
          }).appendTo(`.user-card`);
          const imageContainer = $('<div></div>', {
            id: `image-container-${i}`,
            class: "image-container"
          }).appendTo(`#user-${i}`);
          const userInfo = $('<div></div>', {
            id: `user-info-${i}`,
            class: "user-info"
          }).appendTo(`#user-${i}`);
          const image = $('<div></div>', {
            id: `image-${i}`,
            class: "image"
          }).appendTo(`#image-container-${i}`);
          const imageLine = $('<span></span>', {
            class: "line"
          }).appendTo(`#image-container-${i}`);
          const name = $('<div></div>', {
            id: `name-${i}`,
            class: "name"
          }).appendTo(`#user-info-${i}`);
          const email = $('<div></div>', {
            id: `email-${i}`,
            class: "email"
          }).appendTo(`#user-info-${i}`);
          const roleID = $('<div></div>', {
            id: `role_id-${i}`,
            class: "role_id",
            contenteditable: "true"
          }).appendTo(`#user-info-${i}`);
          const lastSeen = $('<div></div>', {
            id: `login_at-${i}`,
            class: "login_at"
          }).appendTo(`#user-info-${i}`);
          const buttonContainer = $('<div></div>', {
            id: `button-container-${i}`,
            class: "button-container"
          }).appendTo(`#user-info-${i}`);
          const updateButton = $('<button></button>', {
            id: `update-user-${i}`,
            class: "user-button",
            onclick: "updateSubmit()"
          }).appendTo(`#button-container-${i}`);
          const deleteButton = $('<button></button>', {
            id: `delete-user-${i}`,
            class: "user-button",
            onclick: "deleteSubmit()"
          }).appendTo(`#button-container-${i}`);
        }
      }
      createUserCard(userData)
      function insertInfoCard(userData) {
        for (i= 0 ; i < userData.length; i++) {
            $(`#image-${i}`).css('background-image', `url('${userData[i].picture}')`)
            $(`#name-${i}`).text(`名稱： ${userData[i].name}`)
            $(`#email-${i}`).text(`信箱： ${userData[i].email}`)
            $(`#role_id-${i}`).text(`使用者身份： ${userData[i].role_id}`)
            $(`#login_at-${i}`).text(`最後上線時間： ${userData[i].login_at}`)
            $(`#update-user-${i}`).text(`更新`)
            $(`#delete-user-${i}`).text(`刪除`)
        }
      }
      insertInfoCard(userData);
          // $('.intro').infiniteScroll({
          //     // options
          //     path: '.pagination__next',
          //     responseBody: 'json',
          //     status: ".scroller-status",
          //     maxPage: 5,
          //     history: false,
          // });
          // $('.intro').on( 'load.infiniteScroll', function( event, data ) {
          //     dolphinData = data.data
          //     pageNum = data.next_paging -1
          //     pageSize = 4
          //     let numInfos = pageNum * pageSize
          //         createInfoCard(numInfos, pageSize);
          //         insertInfoCard(numInfos, pageSize);
          //     });
          // $('.intro').infiniteScroll('loadNextPage');
      } catch (err) {
          console.log(err);
      }
})()

async function updateSubmit() {
  try{
     const accessToken = localStorage.getItem('access_token');
     let id = event.target.id;
     let idSplit = id.split('-')
     id = idSplit[2]

      let email = $(`#email-${id}`).text()
      let role_id = $(`#role_id-${id}`).text()
      let emailSplit = email.split(' ')
      let role_idSplit = role_id.split(' ')
      email = emailSplit[1];
      role_id = role_idSplit[1];
      const body = {
        email,
        role_id
      };

      let url = `${window.location.origin}/admin/console/users`
      let options = {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + accessToken
          },
      }
      let rawUpdateDataResponse = await fetch(url, options);
      let updateDataResponse = await rawUpdateDataResponse.json();
      if (updateDataResponse.success) {
          alert('update user successful!');
          window.location.href = "/console_users.html";
      } else {
          alert('the user has not been updated.')
      }
  } catch(err) {
      console.log('Error', err )
  }
}

async function deleteSubmit() {
  try{
    if (window.confirm("Do you want to delete the user?")) {
      const accessToken = localStorage.getItem('access_token');
      let id = event.target.id;
      let idSplit = id.split('-')
      id = idSplit[2]
  
      let email = $(`#email-${id}`).text()
      let emailSplit = email.split(' ')
      email = emailSplit[1];
      const body = {
        email
      };
  
      let url = `${window.location.origin}/admin/console/users`
      let options = {
          method: 'DELETE',
          body: JSON.stringify(body),
          headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + accessToken
          },
      }
      let rawUpdateDataResponse = await fetch(url, options);
      let updateDataResponse = await rawUpdateDataResponse.json();
      if (updateDataResponse.success) {
          alert('delete user successful!');
          window.location.href = "/console_users.html";
      } else {
          alert('the user has not been deleted.')
      }
    } else {
      window.location.href = "/console_users.html"
    }
  } catch(err) {
      console.log('Error', err )
  }
}

// Toggle sidebar
$('.toggle-button').on('click', () => {
  document.querySelector('sidebar-component').shadowRoot.querySelector('.util')
  .classList.remove("hide");
})
