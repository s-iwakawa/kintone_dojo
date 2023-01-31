(() => {
	'use strict';

	//勤怠管理アプリのアプリID
	const appId = 102;

	//勤怠管理アプリからレコードの取得
	const getRecord = async () => {
		const getApiUrl = kintone.api.url('/k/v1/records.json');
		const params = {
			'app': appId,
			'query': `モバイル用表示タイトル like "${kintone.getLoginUser().name}_${dateFns.format(new Date(), 'M月D日')}"`,
			'totalCount': true
		};
		return kintone.api(getApiUrl, 'GET', params);
	}

	//再打刻のアラート
	const chkRepushedButton = (title) => {
		const result = Swal.fire({
			title: title,
			showDenyButton: true,
			confirmButtonText: 'はい',
			denyButtonText: 'いいえ'
		});
		return result;
	};

	//勤務時間に応じて休憩時間があるかないか判定する関数
	const chkLunchTime = (startTime, finishTime) => {
		const startHour = startTime.substring(0, 2);
		const startMin = startTime.substring(3, 5);
		const finishHour = finishTime.substring(0, 2);
		const finishMin = finishTime.substring(3, 5);
		const calc = finishHour * 60 + Number(finishMin) - startHour * 60 - Number(startMin);
		if (calc >= 420) {
			return 60;
		} else {
			return 0;
		}
	};



	////
	//モバイルポータルが表示されたときに出/退勤ボタンを表示させる
	kintone.events.on('mobile.portal.show', async(event) => {
		//ロードした時にレコードを取得
		const loadRecord = await getRecord();

		//ポータルの上部を取得
		const getMobilePortalSpace = kintone.mobile.portal.getContentSpaceElement();

		//container要素の作成
		const timecardContainer = document.createElement('div');
		timecardContainer.className = 'timecard--container';

		//button wrapper(出勤ボタン)
		const startButtonWrapper = document.createElement('div');
		startButtonWrapper.className = 'timecard--button--wrapper';
		const showStartTime = document.createElement('p');
		showStartTime.className = 'timecard--showtime';
		showStartTime.innerText = '出勤時間';
		const getStartTime = document.createElement('p');
		getStartTime.innerText = (loadRecord.records.length !== 0) ? loadRecord.records[0].出勤時間.value : '';
		getStartTime.className = 'timecard--detailedTime';
		//button wrapper(退勤ボタン)
		const finishButtonWapper = document.createElement('div');
		finishButtonWapper.className = 'timecard--button--wrapper';
		const showFinishTime = document.createElement('p');
		showFinishTime.className = 'timecard--showtime';
		showFinishTime.innerText = '退勤時間';
		const getFinishTime = document.createElement('p');
		getFinishTime.innerText = (loadRecord.records.length !== 0) ? loadRecord.records[0].退勤時間.value : '';
		getFinishTime.className = 'timecard--detailedTime';

		//日付表示
		const today = dateFns.format(new Date(), 'YYYY年MM月DD日');
		const timecardDate = document.createElement('p');
		timecardDate.innerText = today;
		timecardDate.className = 'timecard--date';

		//ボタンの表示
		const startBtn = document.createElement('button');
		startBtn.className = 'button start--button';
		startBtn.innerText = '出勤';
		const finishBtn = document.createElement('button');
		finishBtn.className = 'button finish--button';
		finishBtn.innerText = '退勤';

		//親要素にappendする
		startButtonWrapper.appendChild(showStartTime);
		startButtonWrapper.appendChild(getStartTime);
		startButtonWrapper.appendChild(startBtn);
		finishButtonWapper.appendChild(showFinishTime);
		finishButtonWapper.appendChild(getFinishTime);
		finishButtonWapper.appendChild(finishBtn);
		timecardContainer.appendChild(timecardDate);
		timecardContainer.appendChild(startButtonWrapper);
		timecardContainer.appendChild(finishButtonWapper);
		getMobilePortalSpace.appendChild(timecardContainer);

		//出勤ボタンクリック時の操作
		document.getElementsByClassName('start--button')[0].onclick = async() => {
			try {
				const getResponse = await getRecord();
				const nowTime = dateFns.format(new Date(), 'HH:mm');
				if (getResponse.records.length === 0) {
					chkRepushedButton('出勤しますか？').then(async (result) => {
						if (result.value) {
							await kintone.api(kintone.api.url('/k/v1/record.json', true), 'POST', {
								'app': appId,
								'record': {
									'出勤時間': {
										'value': nowTime
									}
								}
							});
							getStartTime.innerText = nowTime;
							await Swal.fire({title: '出勤しました', icon: 'success'});
						}
					})
				} else {
					if (getResponse.records[0].退勤時間.value !== null) {
						await Swal.fire({title: 'すでに退勤しています。操作をキャンセルしました', icon: 'error'});
						return;
					} else {
						chkRepushedButton('現在の時刻で打刻しなおしますか？').then(async (result) => {
							if (result.value) {
								await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', {
									'app': appId,
									'id': getResponse.records[0].$id.value,
									'record': {
										'出勤時間': {
											'value': nowTime
										}
									}
								});
								await Swal.fire({title: '出勤時間を更新しました', icon: 'success'});
								getStartTime.innerText = nowTime;
							} else {
								Swal.fire('操作をキャンセルしました');
								return;
							}
						});
					}
				}
			} catch (err) {
				console.log(err);
			}
		}

		//退勤ボタンのクリック時の操作
		document.getElementsByClassName('finish--button')[0].onclick = async() => {
			try {
				const getResponse = await getRecord();
				const nowTime = dateFns.format(new Date(), 'HH:mm');
				if (getResponse.records.length === 0) {
					Swal.fire({title: '出勤していません', icon: 'error'});
				} else {
					if (getResponse.records[0].退勤時間.value === null) {
						chkRepushedButton('退勤しますか？').then(async (result) => {
							if (result.value) {
								await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', {
									'app': appId,
									'id': getResponse.records[0].$id.value,
									'record': {
										'退勤時間': {
											'value': nowTime
										},
										'休憩時間': {
											'value': chkLunchTime(getResponse.records[0].出勤時間.value, nowTime) //退勤時間ー出勤時間が７時間を超えていたら休憩時間６０分、それ以外は０分
										}
									}
								});
								getFinishTime.innerText = nowTime;
								await Swal.fire({title: '退勤しました', icon: 'success'});
							} else {
								Swal.fire('操作をキャンセルしました');
								return;
							}
						})
					} else {
						chkRepushedButton('現在の時刻で打刻しなおしますか？').then(async (result) => {
							if (result.value) {
								await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', {
									'app': appId,
									'id': getResponse.records[0].$id.value,
									'record': {
										'退勤時間': {
											'value': nowTime
										},
										'休憩時間': {
											'value': chkLunchTime(getResponse.records[0].出勤時間.value, nowTime) //退勤時間ー出勤時間が７時間を超えていたら休憩時間６０分、それ以外は０分
										}
									}
								});
								getFinishTime.innerText = nowTime;
								await Swal.fire({title: '退勤時間を更新しました', icon: 'success'});
							} else {
								Swal.fire('操作をキャンセルしました');
								return;
							}
						});
					}
				}
			} catch (err) {
				console.log(err);
			}
		}
	});

})();