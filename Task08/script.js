(() => {
  'use strict';

  const getRecord = (event) => {
		const apiURL = kintone.api.url('/k/v1/app/form/fields.json'); //https://…　ではなく、kintone.api.url() を使うことで短縮できる
		const getParams = {
			"app": 46,
			"lang": "default"
		};

		return kintone.api(apiURL, 'GET', getParams).then((resp) => {
			
			//アプリのドロップダウンに格納されている選択肢の配列を取得
			let dropdownData = resp.properties.Table.fields.Action5.options;

			const orderedDropdown = []; //空の配列を作成

			//全てのindexとlabelの配列を空配列に追加
			Object.keys(dropdownData).forEach((key) => {
				orderedDropdown.push(dropdownData[key]);
			});

			//インデックスの昇順で並べ替え
			orderedDropdown.sort((a,b) => {
				if (a.index < b.index) return -1;
				if (a.index > b.index) return 1;
				return 0;
			});

			//１番目ドロップダウンのaction5の値を挿入
			event.record.Table.value[0].value.Action5.value = orderedDropdown[0].label;

			//２番目以降のテーブルにaction5を記載した状態で、追加
			for (let count = 1; count < Object.keys(orderedDropdown).length; count++) {
				event.record.Table.value.push({
					id: null,
					value: {
						'Action5': {
							type: "DROP_DOWN",
							value: orderedDropdown[count].label
						},
						'課題': {
							type: "MULTI_LINE_TEXT",
							value: ""
						},
						'状況': {
							type: "CHECK_BOX",
							value: ["未振り返り"]
						}
					}
				});
			};
			return event;
		});
  };

	kintone.events.on('app.record.create.show', getRecord);


})();