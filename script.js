function analyze(){
  // 允許輸入 90%、90 %、90
  const today = parseFloat(
    document.getElementById("today").value.replace("%","").trim()
  );
  const d30 = parseFloat(
    document.getElementById("d30").value.replace("%","").trim()
  );
  const spin = parseInt(document.getElementById("spin").value);
  const tablesText = document.getElementById("tables").value;

  const box = document.getElementById("result");
  box.innerHTML = "";

  if(isNaN(today) || isNaN(d30) || isNaN(spin) || !tablesText){
    box.innerHTML = "<div class='result bad'>⚠️ 請確認所有欄位皆正確填寫</div>";
    return;
  }

  const tables = tablesText
    .split(/[\n,]+/)
    .map(t => t.trim())
    .filter(t => t);

  tables.forEach(table=>{
    let text="❌ 不建議", cls="bad";

    if(today>=115 && d30>=95 && spin>=150){
      text="✅ 可進";
      cls="ok";
    }else if(today>=105 && d30>=90){
      text="⚠️ 觀察";
      cls="wait";
    }

    const div = document.createElement("div");
    div.className = `result ${cls}`;
    div.innerHTML = `
      桌號 <b>${table}</b><br>
      今日：${today}%　｜　30日：${d30}%<br>
      未開轉數：${spin}<br><br>
      分析結果：<b>${text}</b>
    `;
    box.appendChild(div);
  });
}
