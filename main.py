import pandas as pd
import numpy as np
from datetime import date
from sklearn.linear_model import LogisticRegression

# ======================
# 讀取資料
# ======================
df = pd.read_csv("data/room_history.csv")
today = date.today().isoformat()

# ======================
# 建立 AI 訓練資料
# ======================
rows = []

for room_id, group in df.groupby("room_id"):
    group = group.reset_index(drop=True)

    if len(group) < 6:
        continue

    for i in range(5, len(group)):
        history = group.iloc[:i]

        win_rate = (history["result"] == "win").mean()
        avg_multiplier = history["multiplier"].mean()

        lose_streak = 0
        for r in reversed(history["result"].tolist()):
            if r == "lose":
                lose_streak += 1
            else:
                break

        recent_5 = history.tail(5)
        recent_win_rate = (recent_5["result"] == "win").mean()

        target = 1 if group.iloc[i]["result"] == "win" else 0

        rows.append([
            win_rate,
            avg_multiplier,
            lose_streak,
            recent_win_rate,
            target
        ])

dataset = pd.DataFrame(
    rows,
    columns=[
        "win_rate",
        "avg_multiplier",
        "lose_streak",
        "recent_win_rate",
        "target"
    ]
)

# ======================
# 訓練 AI
# ======================
X = dataset[["win_rate", "avg_multiplier", "lose_streak", "recent_win_rate"]]
y = dataset["target"]

model = LogisticRegression()
model.fit(X, y)

# ======================
# YES / NO 規則設定
# ======================
RULE_TODAY_RATE = 30
RULE_30_RATE = 35
RULE_LOSE_STREAK = 3
RULE_LAST2_RATE = 50
RULE_AI_RATE = 0.55

results = []

# ======================
# 分析所有房間
# ======================
for room_id, room in df.groupby("room_id"):
    room = room.reset_index(drop=True)

    last_2 = room.tail(2)
    last_2_rate = (last_2["result"] == "win").mean() * 100

    today_data = room[room["date"] == today]
    today_rate = (today_data["result"] == "win").mean() * 100 if not today_data.empty else 0

    last_30 = room.tail(30)
    last_30_rate = (last_30["result"] == "win").mean() * 100

    lose_streak = 0
    for r in reversed(room["result"].tolist()):
        if r == "lose":
            lose_streak += 1
        else:
            break

    win_rate = (room["result"] == "win").mean()
    avg_multiplier = room["multiplier"].mean()
    recent_5 = room.tail(5)
    recent_win_rate = (recent_5["result"] == "win").mean()

    features = np.array([[win_rate, avg_multiplier, lose_streak, recent_win_rate]])
    ai_win_rate = model.predict_proba(features)[0][1]

    conditions = [
        today_rate >= RULE_TODAY_RATE,
        last_30_rate >= RULE_30_RATE,
        lose_streak <= RULE_LOSE_STREAK,
        last_2_rate >= RULE_LAST2_RATE,
        ai_win_rate >= RULE_AI_RATE
    ]

    recommend = "YES" if all(conditions) else "NO"

    results.append({
        "room_id": room_id,
        "前2把%": round(last_2_rate, 1),
        "今日%": round(today_rate, 1),
        "近30把%": round(last_30_rate, 1),
        "連敗": lose_streak,
        "AI勝率%": round(ai_win_rate * 100, 1),
        "建議": recommend
    })

# ======================
# 輸出
# ======================
result_df = pd.DataFrame(results)
result_df = result_df.sort_values(
    by=["建議", "AI勝率%", "近30把%"],
    ascending=[False, False, False]
)

print("\n🤖 ATG 戰神賽特｜全房間 AI 選房掃描表 🤖\n")
print(result_df.to_string(index=False))

print("\n⚠️ 只挑 YES + AI勝率高的 1～2 間")
