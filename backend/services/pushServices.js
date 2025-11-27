// backend/services/pushServices.js

export async function sendExpoPushBatch(messages) {
  try {
    const chunks = [];

    for (let i = 0; i < messages.length; i += 100) {
      chunks.push(messages.slice(i, i + 100));
    }

    for (const batch of chunks) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      });

      console.log(`📨 Отправлен batch из ${batch.length} уведомлений`);
    }

    return true;
  } catch (err) {
    console.error("❌ Ошибка отправки PUSH batch:", err);
    return false;
  }
}