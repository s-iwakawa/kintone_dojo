(() => {
	'use strict';

	//ドロップダウン内の製品と対応する製品コードの定義
	const dropdownData = {
		'kintone': 'KN',
		'Garoon': 'GR',
		'サイボウズ Office': 'OF',
		'Mailwise': 'MW'
	};

	const avoidDuplication = (event) => {
		//日付からハイフンを抜いた文字列を作成
		const dateStr = event.record.日付.value.replace(/-/g, '');

		//ドロップダウンで選択された製品に対応する製品コードの文字列を作成
		const productCode = dropdownData[event.record.サイボウズ製品.value];

		//入力された管理番号の文字列を作成
		const manageNumber = event.record.管理番号.value;

		//重複禁止項目に入力する文字列の作成
		event.record.重複禁止項目_文字列.value = `${dateStr}-${productCode}-${manageNumber}`;

		return event;
	};

	//新規レコード、レコード編集画面になった時に、重複禁止項目の編集を不可にする
	kintone.events.on(['app.record.create.show', 'app.record.edit.show'], ((event) => {
		event.record.重複禁止項目_文字列.disabled = true;
		return event;
	}));

	//新規レコード作成時およびレコード編集時に日付、製品、管理番号が変更されたら関数を実行する
	kintone.events.on([
		'app.record.create.change.日付',
		'app.record.create.change.サイボウズ製品',
		'app.record.create.change.管理番号',
		'app.record.edit.change.日付',
		'app.record.edit.change.サイボウズ製品',
		'app.record.edit.change.管理番号'
	], avoidDuplication);
})();