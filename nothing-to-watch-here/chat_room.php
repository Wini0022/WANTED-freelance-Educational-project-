<?php
require_once __DIR__ . '/../auth_bootstep.php';
require_once __DIR__ . '/../connect.php';

if (!isset($_SESSION['user_id'])) { header('Location: /index.php'); exit; }

$userId = (int)$_SESSION['user_id'];
$chatId = (int)($_GET['chat_id'] ?? 0);

$isAdmin = ((int)($_SESSION['user_role'] ?? 0) === 1);
$isAdminInt = $isAdmin ? 1 : 0;
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
    WHERE c.id = ? AND (? = 1 OR c.owner_id = ? OR c.executor_id = ?)
    LIMIT 1
");
$stmt->bind_param('iiiiii', $userId, $userId, $chatId, $isAdminInt, $userId, $userId);
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

$appStatus = $row['application_status'];


?>



<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat with <?=$peerName?></title>
    <link rel="stylesheet" href="../style.css">
</head>
<body class="chat-page">
    <section class = "chat_area">

        <div class = "chat_area_top">
            <button class = "chat__close_button" type="button" id="chat-cancel"><img class = "chat__leave_button" src = "../images/chat__leave-button.svg"></button>
            <h3 class = "chat_name"><?=$peerName?></h3>
            <?php if ($isAdmin): ?>
            <div class="chat_actions">
                <button type="button" id="chat-actions-toggle">⋯</button>
                <div id="chat-actions-menu" hidden>
                    <button type="button" class="chat-action-btn" data-action="complete">Completed!</button>
                    <button type="button" class="chat-action-btn" data-action="reject_candidate">Reject candidate</button>
                </div>
            </div> 
            <?php endif; ?>
            <img class = "chat__avatar" src="../users_avatars/<?= $peerAvatar?> ">
        </div>

        <div id="messages"></div>

        <form id="send-form">
            <input id="body" name="body" type="text" autocomplete="off" required placeholder="Write a message...">
            <button type="submit"><img class = "submit__image" src = "../images/chat_send_image.svg"></button>
        </form>
    </section>


<script>
const chatId = new URLSearchParams(window.location.search).get('chat_id'); //получение переменной из ссылки
const messagesEl = document.getElementById('messages');
const form = document.getElementById('send-form');
const bodyInput = document.getElementById('body');
const currentUserId  = <?= (int)$userId ?>;

function syncSendButton() {
  const hasText = bodyInput.value.trim().length > 0;
  form.classList.toggle('send-form-active', hasText);
}

bodyInput.addEventListener('input', syncSendButton);
syncSendButton();

const appStatus = <?= $appStatus ?>;
if (appStatus === 3) {
  form.style.display = 'none'; 
}

let lastMessageId = 0;
let lastDateKey = null;

function shortUrl(url) {
  const maxLength = 35;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const path = parsed.pathname === '/' ? '' : parsed.pathname;
    const visible = `${host}${path}`;

    return visible.length > maxLength
      ? visible.slice(0, maxLength) + '...'
      : visible;
  } catch {
    return url.length > maxLength
      ? url.slice(0, maxLength) + '...'
      : url;
  }
}

function appendMessageText(container, text) {
  const value = String(text ?? '');
  const urlRegex = /https?:\/\/[^\s]+/g;
  let lastIndex = 0;

  for (const match of value.matchAll(urlRegex)) {
    const url = match[0];
    const index = match.index;

    if (index > lastIndex) {
      container.appendChild(
        document.createTextNode(value.slice(lastIndex, index))
      );
    }

    const link = document.createElement('a');
    link.href = url;
    link.textContent = shortUrl(url);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    container.appendChild(link);

    lastIndex = index + url.length;
  }

  if (lastIndex < value.length) {
    container.appendChild(
      document.createTextNode(value.slice(lastIndex))
    );
  }
}

async function loadMessages() {
  const res = await fetch(`chat_messages.php?chat_id=${encodeURIComponent(chatId)}&after_id=${lastMessageId}`);
  const data = await res.json();

  if (!data.ok) return;

  for (const m of data.messages) {
    const isMine = Number(m.sender_id) === currentUserId;

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
    div.classList.add('message');

    if (isMine) {
        div.classList.add('sender');
    }

    const peerIcon = m.is_read_by_peer
    ? 'message-checked-icon.svg'
    : 'message-nonchecked-icon.svg';

    const messageText = document.createElement('p');
    messageText.classList.add('message_text');
    appendMessageText(messageText, m.body);

    const messageBottom = document.createElement('div');
    messageBottom.classList.add('message_bottom');

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('message_time');
    timeSpan.textContent = time;

    messageBottom.appendChild(timeSpan);

    if (isMine) {
        const icon = document.createElement('img');
        icon.classList.add('message_peer_icon');
        icon.src = `../images/${peerIcon}`;
        messageBottom.appendChild(icon);
        }

        div.appendChild(messageText);
        div.appendChild(messageBottom);

        messagesEl.appendChild(div);
        lastMessageId = Number(m.id);
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
    syncSendButton();
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

if (toggleBtn && menu) {
  toggleBtn.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
  });
}

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
