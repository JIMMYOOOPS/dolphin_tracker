async function signin() {
    try{ 
        const userEmail = $('.email').val();
        const userPassword = $('.password').val();
        const body = {
            email: userEmail,
            password: userPassword,
        };
        let url = `/admin/console/login`
        let options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        }
        let rawSigninResponse = await fetch(url, options);
        let signinResponse = await rawSigninResponse.json();
        localStorage.setItem("access_token", signinResponse.access_token);
        if (signinResponse.error) {
            alert('User account does not exist!')
        } else {
            window.location.href = "/console.html";
            alert('You have successfully loggedin.')
        }
    } catch(err) {
        console.log('Error', err )
    }
}

function createSignup() {
        $('.signin').html(
            `<div>
                <div class = 'signup_title'>
                <h1>建立帳號</h1>
                </div>
                <div class = 'signup-form'>
                    <div class = 'name-box'>
                        <label for="name">使用者名字：</label><br>
                        <input type="name" value="test" class="name" name="name" required>
                    </div>
                    <div class = 'email-box'>
                        <label for="email">使用者帳號：</label><br>
                        <input type="email" value="test@email.com" class="email" name="email" required>
                    </div>
                    <div class = 'password-box'>
                        <label for="password">使用者密碼：</label><br>
                        <input type="password" value="test" class="password" name="password"  required>
                    </div>
                    <button type="button" class="signup-submit" onclick="signup()">建立帳號</button>
                </div>
            </div>`
            )
}

async function signup() {
    try{
        const userName = $('.name').val();
        const userEmail = $('.email').val();
        const userPassword = $('.password').val();
        const body = {
            name: userName,
            email: userEmail,
            password: userPassword,
        };
    let url = `/admin/console/signup`
    let options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
    }
    let rawSignupResponse = await fetch(url, options);
    let signupResponse = await rawSignupResponse.json();
    console.log(signupResponse)
    localStorage.setItem("access_token", signupResponse.access_token);
    if (signupResponse.access_token) {
        window.location.href = "/console.html";
        alert('You have successfully signedup.')
    }
    } catch(err) {
        console.log('Error', err )
    }
}
