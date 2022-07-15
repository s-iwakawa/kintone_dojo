(() => {
  'use strict';

	const avoidDuplication = (event) => {
		const apiURL = kintone.api.url('/k/v1/records.json'); //https://…　ではなく、kintone.api.url() を使うことで短縮できる
		//新規レコード作成をデフォルトとしてparameterの変数を定義
		const paramsField = (event.type === 'app.record.create.submit') ? ['重複禁止項目'] : ['重複禁止項目', '$id'];
		const paramsQuery = (event.type === 'app.record.create.submit') ? `重複禁止項目 = "${event.record.重複禁止項目.value}"` : `重複禁止項目 = "${event.record.重複禁止項目.value}" and $id not in ("${event.record.$id.value}")`;
		const getParams = {
			app: kintone.app.getId(),
			fields: paramsField,
			paramsQuery,
			totalCount: true
		};

		return kintone.api(apiURL, 'GET', getParams).then((response) => {
			//GETリクエストで値が入っていない場合（他の重複禁止項目と重複していない）そのまま保存イベントを終了
			if (response.totalCount === '0') return event;
			//他のレコードに重複があった際に、そのまま保存するか保存をキャンセルするか確認する
			if (window.confirm('項目が重複しています。このまま保存しますか？')) {
				window.alert('保存しました');
			}else{
				event.error = event.record.重複禁止項目.value + 'は重複しているため、保存キャンセルしました。'; //falseの場合はerrorを書き込む
			}
			return event;
		});
	};

	//新規レコード作成の保存時、およびレコード編集の保存時に上記関数を実行
	kintone.events.on([
		'app.record.create.submit',
		'app.record.edit.submit'
	],avoidDuplication);

})();