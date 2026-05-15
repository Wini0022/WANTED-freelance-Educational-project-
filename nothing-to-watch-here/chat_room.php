<?php
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id'])) { header('Location: /index.php'); exit; }

$userId = (int)$_SESSION['user_id'];
$chatId = (int)($_GET['chat_id'] ?? 0);

$isAdmin = ((int)($_SESSION['user_role'] ?? 0) === 1);
$cancelHref = $isAdmin
  ? './superSecret_adminRoom.php'
  : '../index.php'; 
  

$stmt = $mysqli->prepare("
    SELECT
    c.owner_id,
    c.created_at,
    c.application_id,
    a.status AS application_status,
    CASE
        WHEN c.owner_id = ? THEN u_exec.name
        ELSE u_owner.name
    END AS peer_name,
    CASE
        WHEN c.owner_id = ? THEN u_exec.avatar
        ELSE u_owner.avatar
    END AS peer_avatar
    FROM chats c
    JOIN Applications a ON a.id = c.application_id
    JOIN users u_owner ON u_owner.id = c.owner_id
    JOIN users u_exec  ON u_exec.id  = c.executor_id
    WHERE c.id = ? AND (c.owner_id = ? OR c.executor_id = ?)
    LIMIT 1
");
$stmt->bind_param('iiiii', $userId, $userId, $chatId, $userId, $userId);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    header('Location: ' . $cancelHref);
    exit;
}

$time_created = $row['created_at'];

$peerName = $row['peer_name'] ?? 'Unknown';
$peerAvatar = trim((string)($row['peer_avatar'] ?? 'user_default.png'));

$applicationId = (int)($row['application_id']);

$appStatus = $row['application_status']


?>



<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chat with <?=$peerName?></title>
</head>
<body>
    <section class = "chat_area">

        <div class = "chat_area_top">
            <button type="button" id="chat-cancel">Cancel</button>
            <h3 class = "chat_name"><?=$peerName?></h3>
            <div class="chat_actions">
                <button type="button" id="chat-actions-toggle">⋯</button>
                <div id="chat-actions-menu" hidden>
                    <button type="button" class="chat-action-btn" data-action="complete">Completed!</button>
                    <button type="button" class="chat-action-btn" data-action="reject_candidate">Reject candidate</button>
                </div>
            </div>
            <img src="../users_avatars/<?= $peerAvatar?> ">
        </div>

        <div id="messages"></div>

        <form id="send-form">
            <input id="body" name="body" type="text" autocomplete="off" required placeholder="Write a message...">
            <button type="submit">Send</button>
        </form>
    <section>


<script>
const chatId = new URLSearchParams(window.location.search).get('chat_id'); //получение переменной из ссылки
const messagesEl = document.getElementById('messages');
const form = document.getElementById('send-form');
const bodyInput = document.getElementById('body');
const currentUserId  = <?= (int)$userId ?>;

const appStatus = <?= $appStatus ?>;
if (appStatus === 3) {
  form.style.display = 'none'; 
}

async function loadMessages() {
  const res = await fetch(`chat_messages.php?chat_id=${encodeURIComponent(chatId)}`); 
  const data = await res.json();

  if (!data.ok) return;
  messagesEl.innerHTML = '';

  let lastDateKey = null;

  for (const m of data.messages) {
    const isMine = Number(m.sender_id) === currentUserId;
    const isAdminSender = Number(m.sender_role) === 1;
    const isBlue = isMine || isAdminSender;

    const d = new Date(m.created_at.replace(' ', 'T')); // "2026-05-03 16:01:34" -> 2026-05-03T16:01:34 (стабильнее)
    const hh = String(d.getHours()).padStart(2, '0'); // padStart дополняет слева нулем до длины 2
    const mm = String(d.getMinutes()).padStart(2, '0');
    const time = `${hh}:${mm}`;

    const yyyy = d.getFullYear()
    const month = String(d.getMonth() +1).padStart(2,'0')
    const day = String(d.getDate()).padStart(2,'0')
    const dateKey = `${yyyy}-${month}-${day}`

    if (dateKey !== lastDateKey){
        const dayDivider = document.createElement('div')
        dayDivider.classList.add("message__day_divider")

        const currentYear = new Date().getFullYear();
        const dayLabel = (yyyy === currentYear)
        ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        dayDivider.textContent = dayLabel;
        messagesEl.appendChild(dayDivider)
        lastDateKey = dateKey
    }

    const div = document.createElement('div');
    const peerIcon = m.is_read_by_peer ? 'message-checked-icon.svg' : 'message-nonchecked-icon.svg'

    div.innerHTML = `
    <p class = "message_text" >${m.body}</p>
    <div class = "message_bottom">
        ${isMine ? `<img class="message_peer_icon" src="../images/${peerIcon}">` : ''}
        <span class="message_time">${time}</span>
    </div>

    `;

    div.classList.add('message');
    div.style.background = isBlue ? '#E6FDFF' : '#fff';

    messagesEl.appendChild(div);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData();
  fd.append('chat_id', chatId);
  fd.append('body', bodyInput.value.trim());
  const res = await fetch('chat_send.php', { method: 'POST', body: fd });
  const data = await res.json();
  if (data.ok) {
    bodyInput.value = '';
    await loadMessages();
  }
});

loadMessages();
setInterval(loadMessages, 2500);

document.getElementById('chat-cancel').addEventListener('click', () => {
  window.location.href = <?= json_encode($cancelHref) ?>;
});
const toggleBtn = document.getElementById('chat-actions-toggle');
const menu = document.getElementById('chat-actions-menu');

toggleBtn.addEventListener('click', () => {
  menu.hidden = !menu.hidden; 
});

const applicationId = <?= $applicationId ?>;

document.addEventListener('click', async (e)=>{
    const btn = e.target.closest('.chat-action-btn')
    if (!btn) return
    const action = btn.dataset.action;
    const text = action === 'complete'
        ? 'Mark this application as Completed?'
        : 'Reject current candidate and reopen application?';

    const fd = new FormData()
    fd.append('application_id', applicationId)
    fd.append('action', btn.dataset.action)

    const res = await fetch('chat_application_action.php', {method: 'POST', body: fd})
    const Data = await res.json()

    if(!Data.ok) alert(Data.error)

    window.location.href = <?= json_encode($cancelHref) ?>;

})
</script>
</body>
</html>
