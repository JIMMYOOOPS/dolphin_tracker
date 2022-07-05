const api = '1.0';

//Set Selection for URL Params
let urlParam = new URL(window.location).searchParams;
let id = parseInt(urlParam.get("id")) + 1;
if (!id) { id = 1 };


(async () => {
    try {
        let url =`/api/${api}/data/dolphins/details?id=${id}`;
        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        };
        //Get Dolphin Detail Info from Backend
        async function getData(url, options) {
            let data;
            try {
                let rawData = await fetch(url, options);
                console.log(url);
                data = await rawData.json();
            } catch (err) {
                console.log(err.message);
            };
            return data;
            };
        result = await getData(url, options);
        let dolphinData = result['data'];
        $('.intro-image').css('background-image', `url('${dolphinData[0].img}')`)
        $('.intro-name').text(`${dolphinData[0].name}`)
        $('.intro-alias').text(`${dolphinData[0].alias}`)
        $('.intro-nameEng').text(`${dolphinData[0].name_eng}`)
        $('.intro-scientificname').text(`學名：${dolphinData[0].name_scientific}`)
        $('.intro-text').text(`${dolphinData[0].text}`)
        } catch (err) {
            console.log(err);
        };
  })();