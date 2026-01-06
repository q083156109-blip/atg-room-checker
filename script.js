function analyze() {
  const text = document.getElementById("input").value.trim();
  if (!text) {
    alert("請先貼上資料");
    return;
  }

  const lines = text.split("\n");
  const header = lines.shift(); // 移除表頭

  const data = {};
  let today = null;

  lines.forEach(line => {
    const parts = line.split(",");
    if (parts.length < 3) return;

    const room = parts[0].trim();
    const result = parts[1].trim();
    const date = parts[2].trim();

    if (!today) today = date;

    if (!data[room]) data[room] = [];
    data[room].push({ result, date });
  });

  let html = `
    <table>
      <tr>
        <th>房間</th>
        <th>前2把%</th>
        <th>今日%</th>
        <th>近30%</th>
        <th>連敗</th>
        <th>建議</th>
      </tr>
  `;

  for (const room in data) {
    const records = data[room];

    const last2 = records.slice(-2);
    const last30 = records.slice(-30);
    const todayRec = records.filter(r => r.date === today);

    const winRate = arr => {
      if (arr.length === 0) return 0;
      return arr.filter(r => r.result === "win").length / arr.length * 100;
    };

    let loseStreak = 0;
    for (let i = records.length - 1; i >= 0; i--) {
      if (records[i].result === "lose") loseStreak++;
      else break;
    }

    const rateLast2 = winRate(last2);
    const rateToday = winRate(todayRec);
    const rate30 = winRate(last30);

    const isYes =
      rateToday >= 30 &&
      rate30 >= 35 &&
      loseStreak <= 3 &&
      rateLast2 >= 50;

    html += `
      <tr class="${isYes ? "yes" : "no"}">
        <td>${room}</td>
        <td>${rateLast2.toFixed(1)}%</td>
        <td>${rateToday.toFixed(1)}%</td>
        <td>${rate30.toFixed(1)}%</td>
        <td>${loseStreak}</td>
        <td>${isYes ? "YES" : "NO"}</td>
      </tr>
    `;
  }

  html += "</table>";
  document.getElementById("output").innerHTML = html;
}
