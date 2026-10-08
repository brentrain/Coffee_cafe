document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');
  const messagesContainer = document.getElementById('messages');
  const drawer = document.getElementById('chat-drawer');
  const trigger = document.getElementById('chat-trigger');
  const submitButton = document.getElementById('send-button');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  let conversationHistory = [];

  // Tricolor Mobile Hamburger Menu Toggle
  window.toggleMobileNav = function() {
    if (!hamburgerBtn || !navLinks) return;
    const isActive = hamburgerBtn.classList.toggle('is-active');
    navLinks.classList.toggle('open', isActive);
  };

  window.closeMobileNav = function() {
    if (!hamburgerBtn || !navLinks) return;
    hamburgerBtn.classList.remove('is-active');
    navLinks.classList.remove('open');
  };

  // Chat Drawer open/close
  window.toggleChat = function(forceState) {
    closeMobileNav();
    const isOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !drawer.classList.contains('open');

    if (isOpen) {
      drawer.classList.add('open');
      if (trigger) trigger.style.display = 'none';
      input.focus();
    } else {
      drawer.classList.remove('open');
      if (trigger) trigger.style.display = 'flex';
    }
  };

  window.openChatWithPrompt = function(promptText) {
    toggleChat(true);
    input.value = promptText;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });
    input.value = '';

    input.disabled = true;
    submitButton.disabled = true;

    const thinkingMsg = appendMessage('bot', 'Preparing response...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      });

      thinkingMsg.remove();

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        appendMessage('bot', `⚠️ ${errorData.reply || 'Could not process request.'}`);
        return;
      }

      const data = await response.json();
      appendMessage('bot', data.reply);
      conversationHistory.push({ role: 'assistant', content: data.reply });

    } catch (err) {
      thinkingMsg.remove();
      appendMessage('bot', '⚠️ Connection error. Please check your backend terminal.');
    } finally {
      input.disabled = false;
      submitButton.disabled = false;
      input.focus();
    }
  });

  function appendMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `msg ${role}`;
    msg.textContent = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msg;
  }
});
