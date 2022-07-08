(async() => {
	'use strict';

  const URL = 'https://54o76ppvn8.execute-api.ap-northeast-1.amazonaws.com/prod/bb-dojo';
  const Limit = 'limit 5';
  const getNewsInfo = await axios.get(URL, {
    params: {
      id: 'dojo',
      query: Limit
    }
  }).catch((err) => {
    console.log('err', err);
  });
  
  const newsData = getNewsInfo.data;
  console.log(newsData);


  const main = document.getElementsByTagName('main')[0];
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");
    
  const row = Object.keys(newsData).forEach((key) => {
    const tblRow = document.createElement('tr');
    
    //td要素の作成と日付の書き込み
    const tblDayData = document.createElement('td');
    tblDayData.textContent = newsData[key].day.value;
    
    //td要素の作成とカテゴリの書き込み
    const tblCategoryData = document.createElement('td'); 
    tblCategoryData.textContent = newsData[key].category.value;
    
    //td要素の作成とコンテンツの書き込み(30字以上の内容には…で文字制限する)
    const tblContentData = document.createElement('td'); 
    const checkContentLength = () => {
      const contentLength = newsData[key].content.value.length;
      const maxLength = 30;
      if (contentLength > maxLength) {
        const newContentData = newsData[key].content.value.substr(0, maxLength) + '...'; 
        tblContentData.textContent = newContentData;
        return newContentData;
      }else{
        tblContentData.textContent = newsData[key].content.value;
      }
    };

    //categoryによる背景色の条件分岐
    const label = newsData[key].label.value;
    switch (label){
      case 'company':
        tblCategoryData.classList.add('backcolor_company');
        break;
        case 'product':
        tblCategoryData.classList.add('backcolor_product');
        break;
        case 'ir':
        tblCategoryData.classList.add('backcolor_ir');
        break;
    };
    
    checkContentLength();
    tblRow.appendChild(tblDayData);
    tblRow.appendChild(tblCategoryData);
    tblRow.appendChild(tblContentData);
    tblBody.appendChild(tblRow);
    tbl.appendChild(tblBody);
    main.appendChild(tbl);
  });
})();  

