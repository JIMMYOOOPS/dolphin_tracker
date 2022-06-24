(async () => {
    try {
        result = await (async function getData() {
            let data;
            try {
                const url = {
                dolphins: 'http://localhost:3000/api/1.0/data/dolphins'
                };
                const options = {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                };
                let rawData = await fetch(url.dolphins, options);
                data = await rawData.json();
            } catch (err) {
                console.log(err.message);
            }
            return data;
            })();
        
            // $('.intro').clone().appendTo('.intro')
            
            let data = result['data']
            for (i=0; i < data.length; i++) {                
                $(`#intro${i}-image`).css('background-image', `url('${data[i].img}')`)
                $(`#intro${i}-name`).text(`${data[i].name}`)
                $(`#intro${i}-alias`).text(`${data[i].alias}`)
                $(`#intro${i}-nameEng`).text(`${data[i].name_eng}`)
            }
            // $(document).ready(function (){
            //     $('main').infiniteScroll({
            //         // options
            //         path: '/api/1.0/data/dolphins?paging=1',
            //         itemSelector: '.intro',
            //         append: '.intro',
            //         status: ".scroller-status",
            //         maxPage: 7,
            //         history: false,
            //     });
            // });  
        } catch (err) {
            console.log(err.message);
        }
  })()