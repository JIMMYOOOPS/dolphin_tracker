(async () => {
    try {
        let url =`/api/1.0/data/dolphins/all`
        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        }
        async function getData(url, options) {
            let data;
            try {
                let rawData = await fetch(url, options);
                data = await rawData.json();
                return data;
            } catch (err) {
                console.log(err.message);
            }
        };
        result = await getData(url, options)
        console.log(result);
            let dolphinData = result['data']
            function createInfoCard(numInfos, pageSize) {
                    for (i= numInfos ; i < numInfos + pageSize; i++) {
                        const dolphinInfo = $('<a></a>', {
                            id: `intro-${i}`,
                            class: "intro-box",
                            href: `/species_detail.html?id=${i}`,
                        }).appendTo('.intro');
                        const dolphinImage = $('<div></div>', {
                            id: `intro${i}-image`,
                            class: "intro-image",
                        }).appendTo(`#intro-${i}`);
                        const dolphinName = $('<div></div>', {
                            id: `intro${i}-name`,
                            class: "intro-name",
                        }).appendTo(`#intro-${i}`);
                        const dolphinAlias = $('<div></div>', {
                            id: `intro${i}-alias`,
                            class: "intro-alias",
                        }).appendTo(`#intro-${i}`);
                        const dolphinNameEng = $('<div></div>', {
                            id: `intro${i}-nameEng`,
                            class: "intro-nameEng",
                        }).appendTo(`#intro-${i}`);
                    }
            }
            function insertInfoCard(numInfos, pageSize) {
                    for (i=numInfos; i < numInfos + pageSize; i++) {
                        $(`#intro${i}-image`).css('background-image', `url('${dolphinData[i-numInfos].img}')`)
                        $(`#intro${i}-name`).text(`${dolphinData[i-numInfos].name}`)
                        $(`#intro${i}-alias`).text(`${dolphinData[i-numInfos].alias}`)
                        $(`#intro${i}-nameEng`).text(`${dolphinData[i-numInfos].name_eng}`)
                    }
            }
            insertInfoCard(0, 4);
            $('.intro').infiniteScroll({
                // options
                path: '.pagination__next',
                responseBody: 'json',
                status: ".scroller-status",
                maxPage: 7,
                history: false,
            });
            $('.intro').on( 'load.infiniteScroll', function( event, data ) {
                dolphinData = data.data
                pageNum = data.next_paging -1
                pageSize = 4
                let numInfos = pageNum * pageSize
                console.log(dolphinData)
                    createInfoCard(numInfos, pageSize);

                    insertInfoCard(numInfos, pageSize);
                });
            $('.intro').infiniteScroll('loadNextPage');

        } catch (err) {
            console.log(err);
        }
  })()