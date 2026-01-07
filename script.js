function analyze(){
  const text = document.getElementById("input").value.trim();
  if(!text){ alert("請貼上資料"); return; }

  const lines = text.split("\n");
  lines.shift(); // 移除表頭

  const grid = document.getElementById("grid");
  const detail = document.getElementById("detail");
  grid.innerHTML = "";
  detail.innerHTML = "點擊機台查看詳細";

  const machines = lines.map(l=>{
    const [id,today,d30,p1,p2] = l.split(",");
    return {
      id:id.trim(),
      today:parseFloat(today),
      d30:parseFloat(d30),
      pre1:parseInt(p1),
      pre2:parseInt(p2)
    };
  });

  machines.forEach(m=>{
    const div=document.createElement("div");
    div.className="card";
    div.innerHTML=`<div>${m.id}</div><div class="rate">${m.today}%</div>`;
    div.onclick=()=>show(m);
    grid.appendChild(div);
  });

  function show(m){
    let level="不建議", cls="bad";
    if(m.today>=115 && m.d30>=95 && m.pre1>=150 && m.pre2>=80){
      level="可進"; cls="ok";
    }else if(m.today>=105 && m.d30>=90){
      level="觀望"; cls="wait";
    }

    detail.innerHTML=`
      <b>機台 ${m.id}</b><br>
      今日：${m.today}%<br>
      近30天：${m.d30}%<br>
      前一：${m.pre1}<br>
      前二：${m.pre2}<br><br>
      <b class="${cls}">建議：${level}</b>
    `;
  }
}
