(async () => {
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

  //取得したレスポンスのdataのみを抽出
  const newsData = getNewsInfo.data;

  //main > tbl > tblBody の構造を持つように要素を追加
  const main = document.getElementsByTagName('main')[0];
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");

  //５件取得してきたnewsDataを一件ずつの処理に置き換えて、表を作成する
  newsData.forEach((key) => {
    const tblRow = document.createElement('tr');

    //td要素の作成と日付の書き込み
    const tblDayData = document.createElement('td');
    tblDayData.textContent = key.day.value;

    //td要素の作成とカテゴリの書き込み
    const tblCategoryData = document.createElement('td');
    tblCategoryData.textContent = key.category.value;

    //categoryによる背景色の条件分岐
    const label = key.label.value;
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

    //td要素の作成
    const tblContentData = document.createElement('td');

    //a要素の作成(リンクのため)
    const hrefInfo = document.createElement('a');
    hrefInfo.href = key.url.value; //url.valueに格納されたURLを参照
    hrefInfo.target = key.target.value;

    //30字以上だった場合「…」を追加し、それぞれの条件でa要素にURL情報を付与
    const checkContentLength = () => {
      const maxLength = 30;
      if (key.content.value.length > maxLength) {
        const newContentData = key.content.value.substr(0, maxLength) + '...';
        hrefInfo.textContent = newContentData
        return newContentData;
      }else{
        hrefInfo.textContent = key.content.value;
      }
    };

    //30字チェックの関数の実行
    checkContentLength();

    //要素に各情報を埋め込む
    tblContentData.appendChild(hrefInfo);
    tblRow.appendChild(tblDayData);
    tblRow.appendChild(tblCategoryData);
    tblRow.appendChild(tblContentData);
    tblBody.appendChild(tblRow);
    tbl.appendChild(tblBody);
    main.appendChild(tbl);
  });
})();

