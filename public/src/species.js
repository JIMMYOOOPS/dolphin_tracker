const pageSize = 4;
(async () => {
  try {
    const url = `/api/1.0/data/dolphins/all`;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };

    async function getData(url, options) {
      let data;
      try {
        const rawData = await fetch(url, options);
        data = await rawData.json();
        return data;
      } catch (err) {
        console.log(err.message);
      }
    }

    result = await getData(url, options);
    let dolphinData = result['data'];
    function createInfoCard(numInfos, pageSize) {
      for (i = numInfos; i < numInfos + pageSize; i++) {
        const dolphinInfo = $('<a></a>', {
          id: `intro-${i}`,
          class: 'intro-box',
          href: `/species_detail.html?id=${i}`,
        }).appendTo('.intro');
        const dolphinImage = $('<div></div>', {
          id: `intro${i}-image`,
          class: 'intro-image',
        }).appendTo(`#intro-${i}`);
        const dolphinName = $('<div></div>', {
          id: `intro${i}-name`,
          class: 'intro-name',
        }).appendTo(`#intro-${i}`);
        const dolphinAlias = $('<div></div>', {
          id: `intro${i}-alias`,
          class: 'intro-alias',
        }).appendTo(`#intro-${i}`);
        const dolphinNameEng = $('<div></div>', {
          id: `intro${i}-nameEng`,
          class: 'intro-nameEng',
        }).appendTo(`#intro-${i}`);
      }
    }
    function insertInfoCard(numInfos, pageSize) {
      for (i = numInfos; i < numInfos + pageSize; i++) {
        $(`#intro${i}-image`).css(
          'background-image',
          `url('${dolphinData[i - numInfos].img}')`
        );
        $(`#intro${i}-name`).text(`${dolphinData[i - numInfos].name}`);
        $(`#intro${i}-alias`).text(`${dolphinData[i - numInfos].alias}`);
        $(`#intro${i}-nameEng`).text(`${dolphinData[i - numInfos].name_eng}`);
      }
    }
    insertInfoCard(0, pageSize);
    $('.intro').infiniteScroll({
      // options
      path: '.pagination__next',
      responseBody: 'json',
      status: '.scroller-status',
      maxPage: 6,
      history: false,
    });

    const infScroll = $('.intro').data('infiniteScroll');
    $('.intro')
      .infiniteScroll('loadNextPage')
      .then(
        $('.intro').on('load.infiniteScroll', function (event, response) {
          if (infScroll.pageIndex < 7) {
            dolphinData = response['data'];
            pageNum = infScroll.pageIndex;
            const numInfos = pageNum * pageSize;
            createInfoCard(numInfos, pageSize);
            insertInfoCard(numInfos, pageSize);
          }
        })
      );
  } catch (err) {
    console.log(err);
  }
})();
