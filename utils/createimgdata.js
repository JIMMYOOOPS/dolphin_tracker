const { queryPromise } = require('./mysql')
const mysql = require('mysql2/promise');
const { mysqlConfig } = require('./config');

(async () => {
    try {
        let createImgInfo = [
            ["", "Be"],
            ["https://drive.google.com/file/d/1-9HXRCYI4DNSlJBykqqmXH5xctqIqRGQ/view?usp=sharing","Bo"],
            ["", "Dc"],
            ["https://drive.google.com/file/d/1OjBPx1nnKwaslp0c6Sf7RSpXH9i2QjgT/view?usp=sharing","Fa"],
            ["https://drive.google.com/file/d/1ZaGXuLD4ivYN1DjMMkIkcNaTJjDDLzyx/view?usp=sharing","Gg"],
            ["https://drive.google.com/file/d/1A1yYHlo6_mlwaEeaAuF1Wq8a1DVXT9wC/view?usp=sharing","Gm"],
            ["", "Kb"],
            ["https://drive.google.com/file/d/1y6z8gM1eeIsGk8j4s7suCUbvO39PnPdB/view?usp=sharing","Ks"],
            ["https://drive.google.com/file/d/1ZBbnuGJH2C2yfxWq0D25e0wyDi5t4VUM/view?usp=sharing","Lh"],
            ["", "Mg"],
            ["https://drive.google.com/file/d/1DKU0spDTSItfQ0FcUyXRXyToLIR-5-6c/view?usp=sharing","Mn"],
            ["https://drive.google.com/file/d/1wFdwbR14Sah9-egaxCDNxtBARAfTaunr/view?usp=sharing","Oo"],
            ["https://drive.google.com/file/d/1bUUXMRR-jdAlqiI4wGxPG0f6DTcMbHAc/view?usp=sharing","Pc"],
            ["", "Pe"],
            ["https://drive.google.com/file/d/1AT5KJW8BsAoKfc6ITSiLhzUWpN8GsUrE/view?usp=sharing","Pm"],
            ["https://drive.google.com/file/d/12cBu2WX1aj6JZ2G_RHDQHjKQ4d6pYz87/view?usp=sharing", "Sa"],
            ["https://drive.google.com/file/d/1Xkih3KfoMt5RNbAn4-jZjVn6DRT6StML/view?usp=sharing", "Sb"],
            ["https://drive.google.com/file/d/1N_R8X7HMdgglnp8Zmd7FrG4DQ1TAPmck/view?usp=sharing", "Sl"],
            ["https://drive.google.com/file/d/1p7Fx4bWzICk7v-Ow6d8FTDNC80igIeAs/view?usp=sharing","Tt"],
            ["", "Z"],
            ["https://drive.google.com/file/d/1cIwstnYSZeAOYNuTVweHMnPA9bw6bUgQ/view?usp=sharing","Zc"],
        ]
        let sqlCreateImgInfo = 'INSERT INTO dolphin_img (img, obv_dolphin_type) VALUES (?)'
        // Create table dolphin_img
        for (i=0; i< createImgInfo.length; i++) {
            await queryPromise(sqlCreateImgInfo, [createImgInfo[i]]);
        }
        console.log('done');
    } catch (error) {
        console.log(error)
    }
})()


