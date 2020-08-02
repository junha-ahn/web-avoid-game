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
	const user_tbody=document.querySelector('#user-tbody')
	user_tbody.innerHTML= ''
	
	for (let i = 0; i < players.length; i++) {
		if (players[i].isMine) {
			MyLife(players[i].life)
			const myScoreArea = document.querySelector('.myScore')
			myScoreArea.querySelector('tr > td:nth-child(1)').innerText = i + 1;
			myScoreArea.querySelector('tr > td:nth-child(2)').innerText = getNameFromID(players[i].id)
			myScoreArea.querySelector('tr > td:nth-child(3)').innerText = players[i].score;
		} else if (players[i].startedAt !== null) {
			const row = user_tbody.insertRow(user_tbody.rows.length);
			row.insertCell(0).innerText = i + 1
			row.insertCell(1).innerText = getNameFromID(players[i].id)
			
			row.insertCell(2).innerText = players[i].score

			if (isDied(players[i])) { // 죽으면
				row.classList.add('diedUser')
			}
		}
	}
}
function MyLife(life) {
	let heart = '' 

	for (let i=0; i<life; i++) {
		heart += '<img src="./images/heart.png" style="margin-right:2px;">'
	}

	document.querySelector('.lifeArea').innerHTML = heart
}

function getNameFromID(id) {
	return id.substring(0,8);
}
function isDied(player) { // 죽음
	return player.startedAt !== null && player.endedAt !== null
}
function isPlaying(player) { // 게임중
	return player.startedAt !== null && player.endedAt === null
}