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
			lookupArray.some((key) => {

				//比較する重複禁止項目の文字列の定義
				const currentData = event.record.重複禁止項目.value;
				const chkStr = key.重複禁止項目.value;

				//保存しようとしている重複禁止項目と他のレコードに保存された項目の比較する関数（true,falseを返す）
				const chk = () => {
					if (currentData === chkStr) {
						return false;
					}else{
						return true;
					}
				};

				//chkがfalseのとき、警告を表示。trueの時は比較処理を継続する。
				if (chk()) {
					return false; //some関数内のreturn false; は処理の継続を意味する
				}else{
					//他のレコードに重複があった際に、そのまま保存するか保存をキャンセルするか
					if (window.confirm('項目が重複しています。このまま保存しますか？')) {
						window.alert('保存しました');
						return true;
					}else{
						 event.error = chkStr + 'は重複しているため、保存キャンセルしました。'
						return true;
					}
				};
			});
			return event;
		});
	};
	
	//新規レコード作成の保存時に上記関数を実行
	kintone.events.on('app.record.create.submit', avoidDuplication);

	//レコード編集の保存時に上記関数を実行
	kintone.events.on('app.record.edit.submit', avoidDuplication);

})();