function analyze(){
  const today = parseFloat(document.getElementById("today").value);
  const d30 = parseFloat(document.getElementById("d30").value);
  const spin = parseInt(document.getElementById("spin").value);
  const table = document.getElementById("table").value;

  const box = document.getElementById("result");

  if(isNaN(today)||isNaN(d30)||isNaN(spin)||!table){
    box.innerHTML = "<div class='result bad'>請完整填寫所有欄位</div>";
    return;
  }

  let text="不建議", cls="bad";

  if(today>=115 && d30>=95 && spin>=150){
    text="✅ 可進";
    cls="ok";
  }else if(today>=105 && d30>=90){
    text="⚠️ 觀察";
    cls="wait";
  }

  box.innerHTML = `
    <div class="result ${cls}">
      桌號 ${table}<br><br>
      分析結果：<b>${text}</b>
    </div>
  `;
}
