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
		const dateData =() => {
			const dateStr = event.record.日付.value;	
			return dateStr.replace(/-/g, '');
		} ;

		//ドロップダウンで選択された製品に対応する製品コードの文字列を作成
		const productCode = dropdownData[event.record.サイボウズ製品.value];

		//入力された管理番号の文字列を作成
		const manageNumber = event.record.管理番号.value;

		//重複禁止項目に入力する文字列の作成
		event.record.重複禁止項目_文字列.value = dateData() + '-' + productCode + '-' + manageNumber;

		//重複禁止項目の編集を不可にする
		event.record.重複禁止項目_文字列.disabled = true;	

		return event;
	};

	//新規レコード作成時に日付、製品、管理番号が変更されたら関数を実行する
	kintone.events.on('app.record.create.change.日付', avoidDuplication);
	kintone.events.on('app.record.create.change.サイボウズ製品', avoidDuplication);
	kintone.events.on('app.record.create.change.管理番号', avoidDuplication);
	
	
	//レコード編集時に日付、製品、管理番号が変更されたら関数を実行する
	kintone.events.on('app.record.edit.change.日付', avoidDuplication);
	kintone.events.on('app.record.edit.change.サイボウズ製品', avoidDuplication);
	kintone.events.on('app.record.edit.change.管理番号', avoidDuplication);



})();