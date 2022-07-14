(() => {
  'use strict';

	const avoidDuplication = (event) => {
		const apiURL = kintone.api.url('/k/v1/records.json'); //https://…　ではなく、kintone.api.url() を使うことで短縮できる
		const getParams = {
			"app": 51,
		};

		return kintone.api(apiURL, 'GET', getParams).then((response) => {
			//アプリ内に保存されたレコードの参照
			const lookupArray = response.records;

			//参照したデータ配列の数、処理を繰り返す
			for (let count = 0; count <= lookupArray.length; count++) {
				//比較する重複禁止項目の文字列の定義
				const currentData = event.record.重複禁止項目.value;
				const chkStr = lookupArray[count].重複禁止項目.value;

				//文字列の比較での条件分岐
				if (currentData === chkStr) {
					//他のレコードに重複があった際に、そのまま保存するか保存をキャンセルするか
					if (window.confirm('項目が重複しています。このまま保存しますか？')) {
						window.alert('保存しました');
						break;
					}else{
						 event.error = chkStr + 'は重複しているため、保存キャンセルしました。'
						break
					}
				}else{
					return ;
				};
			};
			return event;
		});
	};

	//新規レコード作成の保存時に上記関数を実行
	kintone.events.on('app.record.create.submit', avoidDuplication);

	//レコード編集の保存時に上記関数を実行
	kintone.events.on('app.record.edit.submit', avoidDuplication);

})();