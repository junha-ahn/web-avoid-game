/**
 * @param  {Player[]} players 
 * 
 * example of players
	[{
		endedAt: 1595751494926
		id: "qanecFSgkuGS3VxsAAAB" // nickname : 앞4글자만 사용
		isMine: true // 나인지 아닌지, 
		score: 12107 
		startedAt: 1595751482819
	}]
 */
function PlayerList(players) {

	for (let i = 0; i < players.length; i++) {
		if (players[i].isMine) {
			const myScoreArea = document.querySelector('.myScore')

			myScoreArea.querySelector('tr > td:nth-child(1)').innerText = i + 1;
			myScoreArea.querySelector('tr > td:nth-child(2)').innerText = players[i].id;
			myScoreArea.querySelector('tr > td:nth-child(3)').innerText = players[i].score;
		} else if (players[i].startedAt !== null) {
			const user_tbody = document.getElementById('user-tbody');
			const row = user_tbody.insertRow(user_tbody.rows.length);
			row.insertCell(0).innerText = i + 1
			row.insertCell(1).innerText = players[i].id
			row.insertCell(2).innerText = players[i].score

			if (isDied(players[i])) { // 죽으면
				row.classList.add('diedUser')
			}
		}
	}
}

function isDied(player) { // 죽음
	return player.startedAt !== null && player.endedAt !== null
}
function isPlaying(player) { // 게임중
	return player.startedAt !== null && player.endedAt === null
}
const data = [{
	endedAt: null, // 1번 사용자는 죽지 않음
	id: "dd1",
	isMine: false,
	score: 1,
	startedAt: 1595751482819,
}, {
	endedAt: 1595751494926, // 난 죽음
	id: "dd2",
	isMine: true,
	score: 333,
	startedAt: 1595751482819,
}, {
	endedAt: 1595751494926, // 얘 죽음
	id: "dd3",
	isMine: false,
	score: 22,
	startedAt: 1595751482819,
}, {
	endedAt: null,
	id: "dd4",
	isMine: false,
	score: 0,
	startedAt: null, // 플레이 중이 아님
}]
PlayerList(data)