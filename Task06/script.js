(() => {
	'use strict';
	
	//ドロップダウンの項目のオブジェクトの定義　
	const dropdownData = {
		0: 'あくなき探求',
		1: '不屈の心体',
		2: '理想への共感',
		3: '心を動かす',
		4: '知識を増やす',
		5: '公明正大'
	};

	const showEvent = (event) => {
		event.record.Table.value[0].value.Action5.value = dropdownData[0];
		for (let count = 1; count < Object.keys(dropdownData).length; count++) {
			event.record.Table.value.push({
				id: null,
				value: {
					'Action5': {
						type: "DROP_DOWN",
						value: dropdownData[count]
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
	};
	
	kintone.events.on('app.record.create.show', showEvent);


})();