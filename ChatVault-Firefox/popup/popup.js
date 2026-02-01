// Platform detection and configuration
const PLATFORMS = {
  chatgpt: {
    name: 'ChatGPT',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg',
    patterns: ['chatgpt.com', 'chat.openai.com'],
    color: '#10a37f'
  },
  claude: {
    name: 'Claude',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg',
    patterns: ['claude.ai'],
    color: '#d4a27f'
  },
  gemini: {
    name: 'Gemini',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg',
    patterns: ['gemini.google.com'],
    color: '#4285f4'
  },
  zai: {
    name: 'Z.AI',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zai.svg',
    patterns: ['chat.z.ai'],
    color: '#8b5cf6'
  },
  deepseek: {
    name: 'DeepSeek',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek.svg',
    patterns: ['chat.deepseek.com', 'deepseek.com/chat'],
    color: '#4d6bfe'
  },
  kimi: {
    name: 'Kimi',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/moonshot.svg',
    patterns: ['kimi.com', 'www.kimi.com'],
    color: '#6366f1'
  },
  qwen: {
    name: 'Qwen',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg',
    patterns: ['chat.qwen.ai', 'tongyi.aliyun.com', 'qwen.aliyun.com'],
    color: '#624aff'
  }
};

// DOM Elements
const elements = {
  statusContainer: document.getElementById('status-container'),
  statusIcon: document.getElementById('status-icon'),
  statusMessage: document.getElementById('status-message'),
  platformInfo: document.getElementById('platform-info'),
  platformIcon: document.getElementById('platform-icon'),
  platformIconWrapper: document.getElementById('platform-icon-wrapper'),
  platformName: document.getElementById('platform-name'),
  messageCount: document.getElementById('message-count'),
  exportBtn: document.getElementById('export-btn'),
  exportBtnText: document.getElementById('export-btn-text'),
  progressContainer: document.getElementById('progress-container'),
  progressFill: document.getElementById('progress-fill'),
  progressText: document.getElementById('progress-text'),
  progressPercent: document.getElementById('progress-percent'),
  includeTimestamps: document.getElementById('include-timestamps'),
  includeThinking: document.getElementById('include-thinking'),
  darkMode: document.getElementById('dark-mode'),
  filename: document.getElementById('filename')
};

let currentPlatform = null;
let currentTab = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Get current tab - Firefox uses browser.* API
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;

    // Detect platform
    const platform = detectPlatform(tab.url);

    if (!platform) {
      showError('This website is not supported. Please navigate to ChatGPT, Claude, Gemini, or Z.AI.');
      return;
    }

    currentPlatform = platform;

    // Show platform info
    showPlatformInfo(platform);

    // Check for chat content
    await checkChatContent();

  } catch (error) {
    console.error('Initialization error:', error);
    showError('Failed to initialize. Please try refreshing the page.');
  }
});

// Detect platform from URL
function detectPlatform(url) {
  for (const [key, platform] of Object.entries(PLATFORMS)) {
    if (platform.patterns.some(pattern => url.includes(pattern))) {
      return { key, ...platform };
    }
  }
  return null;
}

// Show platform info
function showPlatformInfo(platform) {
  elements.platformInfo.classList.remove('hidden');
  // Set the platform icon src directly
  elements.platformIcon.src = platform.icon;
  elements.platformIcon.alt = platform.name;
  elements.platformName.textContent = platform.name;
  // Apply platform color to the icon wrapper border
  if (elements.platformIconWrapper) {
    elements.platformIconWrapper.style.borderColor = platform.color;
    elements.platformIconWrapper.style.boxShadow = `0 4px 12px ${platform.color}33`;
  }
}

// Check for chat content on the page
async function checkChatContent() {
  try {
    // Firefox MV2 uses browser.tabs.executeScript
    const results = await browser.tabs.executeScript(currentTab.id, {
      code: `(${detectChatMessages.toString()})('${currentPlatform.key}')`
    });

    const result = results[0];

    if (result && result.count > 0) {
      elements.messageCount.textContent = `${result.count} messages found`;
      elements.exportBtn.disabled = false;
    } else {
      elements.messageCount.textContent = 'No messages found';
      showError('No chat messages detected. Make sure you have an active conversation.');
    }
  } catch (error) {
    console.error('Error checking chat content:', error);
    showError('Could not access page content. Please refresh and try again.');
  }
}

// Function to be injected into the page
function detectChatMessages(platformKey) {
  const selectors = {
    chatgpt: {
      messages: 'article[data-testid*="conversation-turn"], [data-message-author-role]',
      userMessage: 'article[data-turn="user"], [data-message-author-role="user"]',
      assistantMessage: 'article[data-turn="assistant"], [data-message-author-role="assistant"]'
    },
    claude: {
      messages: '[data-testid="user-message"], .standard-markdown',
      userMessage: '[data-testid="user-message"]',
      assistantMessage: '.standard-markdown'
    },
    gemini: {
      messages: '.conversation-container',
      userMessage: '.query-content, .user-query-content',
      assistantMessage: '.response-container'
    },
    zai: {
      messages: '.user-message, [class*="message-"][class*="svelte"]',
      userMessage: '.user-message',
      assistantMessage: '[class*="message-"][class*="svelte"]'
    },
    deepseek: {
      messages: '.ds-markdown[style*="--ds-md-zoom"], .fbb737a4',
      userMessage: '.fbb737a4',
      assistantMessage: '.ds-markdown[style*="--ds-md-zoom"]'
    },
    kimi: {
      messages: '.chat-content-item-user, .chat-content-item-assistant',
      userMessage: '.segment-user .user-content, .chat-content-item-user',
      assistantMessage: '.segment-assistant .markdown, .chat-content-item-assistant'
    },
    qwen: {
      messages: '.qwen-chat-message',
      userMessage: '.qwen-chat-message-user',
      assistantMessage: '.qwen-chat-message-assistant'
    }
  };

  const config = selectors[platformKey];
  if (!config) return { count: 0 };

  const messages = document.querySelectorAll(config.messages);

  if (platformKey === 'gemini') {
    return { count: messages.length * 2 };
  }
  return { count: messages.length };
}

// Export button click handler
elements.exportBtn.addEventListener('click', async () => {
  if (!currentPlatform || !currentTab) return;

  const options = {
    includeTimestamps: elements.includeTimestamps.checked,
    includeThinking: elements.includeThinking.checked,
    darkMode: elements.darkMode.checked,
    filename: elements.filename.value.trim() || 'chat-export'
  };

  try {
    setExporting(true);
    updateProgress(0, 'Preparing export...');

    let chatData;

    // For ChatGPT, use incremental extraction due to DOM virtualization
    if (currentPlatform.key === 'chatgpt') {
      updateProgress(5, 'Scanning conversation...');

      // Incremental extraction for ChatGPT
      const incrementalResults = await browser.tabs.executeScript(currentTab.id, {
        code: `(async () => {
          const allMessages = new Map();
          const scrollContainer = document.querySelector('[data-scroll-root="true"]') ||
            document.querySelector('main') ||
            document.documentElement;

          if (!scrollContainer) return { messages: [], title: document.title };

          const extractVisibleMessages = () => {
            const articles = document.querySelectorAll('article[data-testid*="conversation-turn"]');
            const extracted = [];

            articles.forEach((article) => {
              const testId = article.getAttribute('data-testid') || '';
              const turnNumber = parseInt(testId.match(/conversation-turn-(\\d+)/)?.[1] || '0');
              if (turnNumber === 0) return;

              let role = article.getAttribute('data-turn');
              if (!role || (role !== 'user' && role !== 'assistant')) {
                const roleEl = article.querySelector('[data-message-author-role]');
                role = roleEl?.getAttribute('data-message-author-role');
              }
              if (!role || (role !== 'user' && role !== 'assistant')) return;

              let content = '';
              let contentType = 'text';
              if (role === 'user') {
                const userTextEl = article.querySelector('.whitespace-pre-wrap');
                content = userTextEl?.innerText?.trim() || '';
              } else {
                const markdownEl = article.querySelector('.markdown.prose') ||
                  article.querySelector('div.markdown') ||
                  article.querySelector('[class*="markdown-new-styling"]');
                if (markdownEl) {
                  content = markdownEl.innerHTML?.trim() || '';
                  contentType = 'html';
                }
              }

              if (content) {
                extracted.push({ role, content, turnNumber, contentType });
              }
            });

            return extracted;
          };

          scrollContainer.scrollTop = 0;
          await new Promise(r => setTimeout(r, 400));

          extractVisibleMessages().forEach(msg => {
            if (!allMessages.has(msg.turnNumber)) {
              allMessages.set(msg.turnNumber, msg);
            }
          });

          const scrollHeight = scrollContainer.scrollHeight;
          const viewportHeight = scrollContainer.clientHeight;
          const scrollStep = viewportHeight * 0.5;

          let currentScroll = 0;
          let iterations = 0;
          const maxIterations = 100;

          while (currentScroll < scrollHeight && iterations < maxIterations) {
            currentScroll += scrollStep;
            scrollContainer.scrollTo({ top: currentScroll, behavior: 'instant' });
            await new Promise(r => setTimeout(r, 200));

            extractVisibleMessages().forEach(msg => {
              if (!allMessages.has(msg.turnNumber)) {
                allMessages.set(msg.turnNumber, msg);
              }
            });

            iterations++;
          }

          scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'instant' });
          await new Promise(r => setTimeout(r, 300));
          extractVisibleMessages().forEach(msg => {
            if (!allMessages.has(msg.turnNumber)) {
              allMessages.set(msg.turnNumber, msg);
            }
          });

          const messages = Array.from(allMessages.values())
            .sort((a, b) => a.turnNumber - b.turnNumber);

          let title = document.title || 'Chat Export';

          return {
            messages,
            title,
            platform: 'chatgpt',
            exportedAt: new Date().toISOString()
          };
        })()`
      });

      chatData = incrementalResults[0];
      updateProgress(35, 'Processing messages...');

    } else {
      updateProgress(20, 'Extracting messages...');

      // For other platforms, use the standard extraction
      const optionsStr = JSON.stringify(options);
      const results = await browser.tabs.executeScript(currentTab.id, {
        code: `(${extractChatContent.toString()})('${currentPlatform.key}', ${optionsStr})`
      });

      chatData = results[0];
    }

    if (!chatData || chatData.messages.length === 0) {
      throw new Error('No messages could be extracted');
    }

    updateProgress(40, 'Generating PDF...');

    // Generate PDF
    const platformStr = JSON.stringify(currentPlatform);
    const optionsStr = JSON.stringify(options);
    const chatDataStr = JSON.stringify(chatData);
    
    await browser.tabs.executeScript(currentTab.id, {
      code: `(${generatePDF.toString()})(${chatDataStr}, ${optionsStr}, ${platformStr})`
    });

    updateProgress(100, 'Complete!');

    setTimeout(() => {
      setExporting(false);
      showSuccess('PDF exported successfully!');
    }, 500);

  } catch (error) {
    console.error('Export error:', error);
    setExporting(false);
    showError(`Export failed: ${error.message}`);
  }
});

// Extract chat content from the page
function extractChatContent(platformKey, options) {
  const extractors = {
    chatgpt: () => {
      const messages = [];
      const conversationTurns = Array.from(document.querySelectorAll('article[data-testid*="conversation-turn"]'));

      conversationTurns.forEach((article) => {
        const testId = article.getAttribute('data-testid') || '';
        const turnNumber = parseInt(testId.match(/conversation-turn-(\d+)/)?.[1] || '0');

        if (turnNumber === 0) return;

        let role = article.getAttribute('data-turn');

        if (!role || (role !== 'user' && role !== 'assistant')) {
          const roleEl = article.querySelector('[data-message-author-role]');
          role = roleEl?.getAttribute('data-message-author-role');
        }

        if (!role || (role !== 'user' && role !== 'assistant')) return;

        const isUser = role === 'user';
        let content = '';

        if (isUser) {
          const userTextEl = article.querySelector('.whitespace-pre-wrap');
          content = userTextEl?.innerText?.trim() || '';

          if (!content) {
            const messageEl = article.querySelector('[data-message-author-role="user"]');
            content = messageEl?.innerText?.trim() || '';
          }
        } else {
          const markdownEl = article.querySelector('.markdown.prose') ||
            article.querySelector('div.markdown') ||
            article.querySelector('[class*="markdown-new-styling"]');

          if (markdownEl) {
            content = markdownEl.innerHTML?.trim() || '';
          }

          if (!content) {
            const messageEl = article.querySelector('[data-message-author-role="assistant"]');
            content = messageEl?.innerHTML?.trim() || '';
          }
        }

        if (content) {
          messages.push({
            role: isUser ? 'user' : 'assistant',
            content: content,
            contentType: isUser ? 'text' : 'html',
            turnNumber: turnNumber
          });
        }
      });

      messages.sort((a, b) => a.turnNumber - b.turnNumber);

      return messages;
    },

    claude: () => {
      const messages = [];
      const seenContent = new Set();

      const userMessages = document.querySelectorAll('[data-testid="user-message"]');

      userMessages.forEach((el, i) => {
        const textEl = el.querySelector('p.whitespace-pre-wrap') || el.querySelector('p') || el;
        const content = textEl.innerText?.trim() || el.innerText?.trim() || '';

        if (content && !seenContent.has(content)) {
          seenContent.add(content);
          messages.push({
            role: 'user',
            content: content,
            index: i * 2
          });
        }
      });

      const assistantContainers = document.querySelectorAll('.standard-markdown');

      assistantContainers.forEach((el, i) => {
        const htmlContent = el.innerHTML?.trim() || '';
        const textContent = el.innerText?.trim() || '';

        if (htmlContent && textContent && !seenContent.has(textContent)) {
          seenContent.add(textContent);
          messages.push({
            role: 'assistant',
            content: htmlContent,
            contentType: 'html',
            index: i * 2 + 1
          });
        }
      });

      if (assistantContainers.length === 0) {
        const responseParagraphs = document.querySelectorAll('.font-claude-response-body');
        let currentResponse = '';
        let currentResponseText = '';
        let responseIndex = 0;

        responseParagraphs.forEach((el, i) => {
          const parent = el.closest('[data-testid="user-message"]');
          if (parent) return;

          currentResponse += (currentResponse ? '<br><br>' : '') + el.innerHTML?.trim();
          currentResponseText += (currentResponseText ? '\n\n' : '') + el.innerText?.trim();

          const nextEl = responseParagraphs[i + 1];
          const isLastOrDifferentMessage = !nextEl ||
            el.closest('.standard-markdown') !== nextEl?.closest('.standard-markdown');

          if (isLastOrDifferentMessage && currentResponse && !seenContent.has(currentResponseText)) {
            seenContent.add(currentResponseText);
            messages.push({
              role: 'assistant',
              content: currentResponse,
              contentType: 'html',
              index: responseIndex * 2 + 1
            });
            currentResponse = '';
            currentResponseText = '';
            responseIndex++;
          }
        });
      }

      return messages.sort((a, b) => a.index - b.index);
    },

    gemini: () => {
      const messages = [];

      const conversationTurns = document.querySelectorAll('.conversation-container');

      if (conversationTurns.length > 0) {
        conversationTurns.forEach((turn, index) => {
          const queryContainer = turn.querySelector('.query-content, .user-query-content, [class*="query-content"]');
          const queryText = turn.querySelector('.query-text');
          const userQueryEl = queryContainer || queryText;

          if (userQueryEl) {
            const content = userQueryEl.innerText?.trim();
            if (content) {
              messages.push({
                role: 'user',
                content: content,
                index: index * 2
              });
            }
          }

          const responseContainer = turn.querySelector('.response-container');
          if (responseContainer) {
            const responseText = responseContainer.querySelector('.model-response-text, message-content, .markdown-main-panel, .markdown') || responseContainer;
            const htmlContent = responseText.innerHTML?.trim();
            if (htmlContent) {
              messages.push({
                role: 'assistant',
                content: htmlContent,
                contentType: 'html',
                index: index * 2 + 1
              });
            }
          }
        });
      }

      if (messages.length === 0) {
        const userQueryContainers = document.querySelectorAll('.query-content, user-query-content');
        const seenContent = new Set();

        userQueryContainers.forEach((el, i) => {
          const content = el.innerText?.trim();
          if (content && !seenContent.has(content)) {
            seenContent.add(content);
            messages.push({
              role: 'user',
              content: content,
              index: i * 2
            });
          }
        });

        const responses = document.querySelectorAll('.response-container .model-response-text, .response-container message-content');
        const seenResponses = new Set();

        responses.forEach((el, i) => {
          const htmlContent = el.innerHTML?.trim();
          const textContent = el.innerText?.trim();
          if (htmlContent && textContent && !seenResponses.has(textContent)) {
            seenResponses.add(textContent);
            messages.push({
              role: 'assistant',
              content: htmlContent,
              contentType: 'html',
              index: i * 2 + 1
            });
          }
        });
      }

      if (messages.length === 0) {
        const promptHeadings = document.querySelectorAll('h2.query-text, [class*="prompt-text"]');
        promptHeadings.forEach((el, i) => {
          const content = el.innerText?.trim();
          if (content) {
            messages.push({
              role: 'user',
              content: content,
              index: i * 2
            });
          }
        });

        const responseTexts = document.querySelectorAll('.model-response-text, .markdown-main-panel');
        responseTexts.forEach((el, i) => {
          const htmlContent = el.innerHTML?.trim();
          if (htmlContent) {
            messages.push({
              role: 'assistant',
              content: htmlContent,
              contentType: 'html',
              index: i * 2 + 1
            });
          }
        });
      }

      return messages.sort((a, b) => a.index - b.index);
    },

    zai: () => {
      const messages = [];
      const seenUserContent = new Set();
      const seenAssistantContent = new Set();

      const userMessageContainers = document.querySelectorAll('.user-message');

      userMessageContainers.forEach((el, i) => {
        const textEl = el.querySelector('.chat-user') || el;
        const content = textEl.innerText?.trim();

        if (content && !seenUserContent.has(content)) {
          seenUserContent.add(content);
          messages.push({
            role: 'user',
            content: content,
            index: i * 2
          });
        }
      });

      if (messages.length === 0) {
        const chatUserElements = document.querySelectorAll('.chat-user');
        chatUserElements.forEach((el, i) => {
          const content = el.innerText?.trim();
          if (content && !seenUserContent.has(content)) {
            seenUserContent.add(content);
            messages.push({
              role: 'user',
              content: content,
              index: i * 2
            });
          }
        });
      }

      const assistantContainers = document.querySelectorAll('[class*="message-"][class*="svelte"]');

      assistantContainers.forEach((el, i) => {
        let content = '';
        let finalResponseContent = '';

        const responseArea = el.querySelector('.chat-assistant .markdown-prose') ||
          el.querySelector('.chat-assistant') ||
          el.querySelector('.markdown-prose');

        if (!responseArea) return;

        const responseClone = responseArea.cloneNode(true);

        // ALWAYS remove thinking section from the response clone
        const thinkingSelectors = [
          '.thinking-chain-container',
          '[class*="thinking-block"]',
          '[class*="thinking"]',
          '[class*="Thought"]'
        ];
        
        thinkingSelectors.forEach(selector => {
          const thinkingElements = responseClone.querySelectorAll(selector);
          thinkingElements.forEach(thinkingEl => {
            thinkingEl.remove();
          });
        });

        finalResponseContent = responseClone.innerHTML?.trim() || '';

        if (options.includeThinking) {
          const thinkingContainer = el.querySelector('.thinking-chain-container, [class*="thinking"], [class*="Thought"]');
          
          if (thinkingContainer) {
            const thinkingBlockquote = thinkingContainer.querySelector('blockquote');
            const thinkingContent = thinkingBlockquote?.innerText?.trim() || '';

            if (thinkingContent) {
              content = `[Thinking Process]\n${thinkingContent}\n\n[Response]\n${finalResponseContent}`;
            } else {
              content = finalResponseContent;
            }
          } else {
            content = finalResponseContent;
          }
        } else {
          content = finalResponseContent;
        }

        const textForDedup = responseClone.innerText?.trim() || '';

        if (content && textForDedup && !seenAssistantContent.has(textForDedup)) {
          seenAssistantContent.add(textForDedup);
          messages.push({
            role: 'assistant',
            content: content,
            contentType: 'html',
            index: i * 2 + 1
          });
        }
      });

      if (seenAssistantContent.size === 0) {
        const chatAssistantElements = document.querySelectorAll('.chat-assistant');
        chatAssistantElements.forEach((el, i) => {
          const clone = el.cloneNode(true);
          
          if (!options.includeThinking) {
            const thinkingSelectors = [
              '.thinking-chain-container',
              '[class*="thinking-block"]',
              '[class*="thinking"]',
              '[class*="Thought"]'
            ];
            
            thinkingSelectors.forEach(selector => {
              const thinkingElements = clone.querySelectorAll(selector);
              thinkingElements.forEach(thinkingEl => {
                thinkingEl.remove();
              });
            });
          }
          
          const htmlContent = clone.innerHTML?.trim();
          const textContent = clone.innerText?.trim();
          if (htmlContent && textContent && !seenAssistantContent.has(textContent)) {
            seenAssistantContent.add(textContent);
            messages.push({
              role: 'assistant',
              content: htmlContent,
              contentType: 'html',
              index: i * 2 + 1
            });
          }
        });
      }

      return messages.sort((a, b) => a.index - b.index);
    },

    deepseek: () => {
      const messages = [];
      const seenContent = new Set();

      const allMessageElements = document.querySelectorAll('.fbb737a4, .ds-markdown[style*="--ds-md-zoom"]');

      allMessageElements.forEach((el, i) => {
        const isUserMessage = el.classList.contains('fbb737a4');
        const isAssistantMessage = el.classList.contains('ds-markdown');

        if (isUserMessage) {
          const content = el.innerText?.trim() || '';
          if (content && content.length > 0 && !seenContent.has(content)) {
            seenContent.add(content);
            messages.push({
              role: 'user',
              content: content,
              contentType: 'text',
              index: i
            });
          }
        } else if (isAssistantMessage) {
          const htmlContent = el.innerHTML?.trim() || '';
          const textContent = el.innerText?.trim() || '';

          if (textContent && !seenContent.has(textContent)) {
            seenContent.add(textContent);
            messages.push({
              role: 'assistant',
              content: htmlContent,
              contentType: 'html',
              index: i
            });
          }
        }
      });

      return messages.sort((a, b) => a.index - b.index);
    },

    kimi: () => {
      const messages = [];
      const seenContent = new Set();

      const chatItems = document.querySelectorAll('.chat-content-item');

      chatItems.forEach((item, i) => {
        const isUser = item.classList.contains('chat-content-item-user');
        const isAssistant = item.classList.contains('chat-content-item-assistant');

        if (isUser) {
          const contentEl = item.querySelector('.user-content') ||
            item.querySelector('.segment-content-box') ||
            item.querySelector('.segment-content');
          const content = contentEl?.innerText?.trim() || '';

          if (content && !seenContent.has(content)) {
            seenContent.add(content);
            messages.push({
              role: 'user',
              content: content,
              contentType: 'text',
              index: i
            });
          }
        } else if (isAssistant) {
          const contentEl = item.querySelector('.markdown-container .markdown') ||
            item.querySelector('.markdown') ||
            item.querySelector('.segment-content');
          const htmlContent = contentEl?.innerHTML?.trim() || '';
          const textContent = contentEl?.innerText?.trim() || '';

          if (textContent && !seenContent.has(textContent)) {
            seenContent.add(textContent);
            messages.push({
              role: 'assistant',
              content: htmlContent,
              contentType: 'html',
              index: i
            });
          }
        }
      });

      if (messages.length === 0) {
        const userSegments = document.querySelectorAll('.segment-user');
        const assistantSegments = document.querySelectorAll('.segment-assistant');

        userSegments.forEach((el, i) => {
          const contentEl = el.querySelector('.user-content') || el.querySelector('.segment-content');
          const content = contentEl?.innerText?.trim() || '';
          if (content && !seenContent.has(content)) {
            seenContent.add(content);
            messages.push({ role: 'user', content, contentType: 'text', index: i * 2 });
          }
        });

        assistantSegments.forEach((el, i) => {
          const contentEl = el.querySelector('.markdown') || el.querySelector('.segment-content');
          const htmlContent = contentEl?.innerHTML?.trim() || '';
          const textContent = contentEl?.innerText?.trim() || '';
          if (textContent && !seenContent.has(textContent)) {
            seenContent.add(textContent);
            messages.push({ role: 'assistant', content: htmlContent, contentType: 'html', index: i * 2 + 1 });
          }
        });
      }

      return messages.sort((a, b) => a.index - b.index);
    },

    qwen: () => {
      const messages = [];
      const seenContent = new Set();

      const allMessages = document.querySelectorAll('.qwen-chat-message');

      allMessages.forEach((msgEl, i) => {
        const isUser = msgEl.classList.contains('qwen-chat-message-user');
        const isAssistant = msgEl.classList.contains('qwen-chat-message-assistant');

        if (isUser) {
          const contentEl = msgEl.querySelector('.user-message-content') ||
            msgEl.querySelector('.chat-user-message');
          const content = contentEl?.innerText?.trim() || '';

          if (content && !seenContent.has(content)) {
            seenContent.add(content);
            messages.push({
              role: 'user',
              content: content,
              contentType: 'text',
              index: i
            });
          }
        } else if (isAssistant) {
          const contentEl = msgEl.querySelector('.qwen-markdown') ||
            msgEl.querySelector('.custom-qwen-markdown') ||
            msgEl.querySelector('.response-message-content');
          const htmlContent = contentEl?.innerHTML?.trim() || '';
          const textContent = contentEl?.innerText?.trim() || '';

          if (textContent && !seenContent.has(textContent)) {
            seenContent.add(textContent);
            messages.push({
              role: 'assistant',
              content: htmlContent,
              contentType: 'html',
              index: i
            });
          }
        }
      });

      if (messages.length === 0) {
        const userMessages = document.querySelectorAll('.chat-user-message, .user-message-content');
        userMessages.forEach((el, i) => {
          const content = el.innerText?.trim() || '';
          if (content && !seenContent.has(content)) {
            seenContent.add(content);
            messages.push({
              role: 'user',
              content: content,
              contentType: 'text',
              index: i * 2
            });
          }
        });

        const assistantMessages = document.querySelectorAll('.qwen-markdown, .response-message-content');
        assistantMessages.forEach((el, i) => {
          const htmlContent = el.innerHTML?.trim() || '';
          const textContent = el.innerText?.trim() || '';
          if (textContent && !seenContent.has(textContent)) {
            seenContent.add(textContent);
            messages.push({
              role: 'assistant',
              content: htmlContent,
              contentType: 'html',
              index: i * 2 + 1
            });
          }
        });
      }

      return messages.sort((a, b) => a.index - b.index);
    }
  };

  const extractor = extractors[platformKey];
  if (!extractor) return { messages: [], title: 'Chat Export' };

  const messages = extractor();

  let title = 'Chat Export';

  if (platformKey === 'zai') {
    // For Z.ai: Look for selected chat in sidebar
    // The selected chat has bg-[#F2F4F6] (light) or bg-[#37383B] (dark)
    const sidebar = document.querySelector('#sidebar');
    if (sidebar) {
      // Find buttons with the active/selected background color
      const activeButtons = sidebar.querySelectorAll('button[class*="bg-[#F2F4F6]"], button[class*="bg-[#37383B]"]');
      
      for (const btn of activeButtons) {
        // Skip if this is the new chat button
        if (btn.id === 'sidebar-new-chat-button' || 
            btn.classList.contains('siderNewChatButton') ||
            btn.querySelector('svg')) {
          continue;
        }
        
        // The title is in div[dir="auto"] inside the button
        const titleDiv = btn.querySelector('div[dir="auto"]');
        if (titleDiv && titleDiv.innerText?.trim()) {
          const text = titleDiv.innerText.trim();
          if (text.length > 0 && text.length < 200) {
            title = text;
            break;
          }
        }
        
        // Fallback: try to get any text from the button (excluding menu icons)
        const textNodes = Array.from(btn.querySelectorAll('div, span'))
          .filter(el => !el.querySelector('svg') && el.innerText?.trim());
        
        for (const node of textNodes) {
          const text = node.innerText.trim();
          if (text && text.length > 0 && text.length < 200 && 
              text !== 'Chat Menu' && !text.includes('•••')) {
            title = text;
            break;
          }
        }
        
        if (title !== 'Chat Export') break;
      }
    }

    // Strategy 2: Look for draggable chat items that contain the active button
    if (title === 'Chat Export') {
      const draggableItems = document.querySelectorAll('[draggable="true"]');
      for (const item of draggableItems) {
        const activeBtn = item.querySelector('button[class*="bg-[#F2F4F6]"], button[class*="bg-[#37383B]"]');
        if (activeBtn) {
          const titleDiv = activeBtn.querySelector('div[dir="auto"]');
          if (titleDiv && titleDiv.innerText?.trim()) {
            const text = titleDiv.innerText.trim();
            if (text.length > 0 && text.length < 200) {
              title = text;
              break;
            }
          }
        }
      }
    }

    // Strategy 3: Try to extract from URL path (chat ID might be present)
    if (title === 'Chat Export') {
      const urlMatch = window.location.pathname.match(/\/c\/([^\/]+)/) || 
                       window.location.pathname.match(/\/chat\/([^\/]+)/);
      if (urlMatch && urlMatch[1]) {
        title = `Chat ${urlMatch[1].substring(0, 8)}`;
      }
    }

    // Strategy 4: Fallback to first user message if no title found
    if (title === 'Chat Export') {
      const firstUserMsg = document.querySelector('.user-message .chat-user, .user-message');
      if (firstUserMsg) {
        const msgText = firstUserMsg.innerText?.trim();
        if (msgText) {
          title = msgText.length > 50 ? msgText.substring(0, 50) + '...' : msgText;
        }
      }
    }
  } else if (platformKey === 'qwen') {
    const selectedChatItem = document.querySelector('.chat-item.active, .chat-item-active, .sidebar-item.active, [class*="chat-item"][class*="active"]');
    if (selectedChatItem) {
      const titleEl = selectedChatItem.querySelector('.chat-item-title, .item-title, [class*="title"]');
      if (titleEl && titleEl.innerText) {
        title = titleEl.innerText.trim();
      }
    }

    if (title === 'Chat Export') {
      const headerTitle = document.querySelector('.chat-header-title, .conversation-title, .chat-title, [class*="header"] [class*="title"]');
      if (headerTitle && headerTitle.innerText) {
        title = headerTitle.innerText.trim();
      }
    }

    if (title === 'Chat Export') {
      const tooltip = document.querySelector('.ant-tooltip-inner');
      if (tooltip && tooltip.innerText && tooltip.innerText.length > 3 && tooltip.innerText.length < 100) {
        title = tooltip.innerText.trim();
      }
    }

    if (title === 'Chat Export') {
      const firstUserMsg = document.querySelector('.qwen-chat-message-user .user-message-content, .chat-user-message');
      if (firstUserMsg) {
        const msgText = firstUserMsg.innerText?.trim();
        if (msgText) {
          title = msgText.length > 50 ? msgText.substring(0, 50) + '...' : msgText;
        }
      }
    }
  } else {
    title = document.title || 'Chat Export';
    const titleEl = document.querySelector('h1, [class*="title"], [class*="Title"]');
    if (titleEl && titleEl.innerText) {
      title = titleEl.innerText.trim();
    }
  }

  return {
    messages,
    title,
    platform: platformKey,
    exportedAt: new Date().toISOString()
  };
}

// Generate PDF from chat data
function generatePDF(chatData, options, platform) {
  const { messages, title } = chatData;

  const platformIcons = {
    chatgpt: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg',
    claude: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg',
    gemini: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg',
    zai: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zai.svg',
    deepseek: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek.svg',
    kimi: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/moonshot.svg',
    qwen: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg'
  };

  const userIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  function markdownToHtml(text) {
    if (!text) return '';

    let html = text;

    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      if (lang.toLowerCase() === 'mermaid') {
        return `<div class="mermaid">${code.trim()}</div>`;
      }
      return `<pre class="code-block"><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
    });

    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    html = html.replace(/^---$/gm, '<hr>');

    html = html.replace(/\n/g, '<br>');

    html = html.replace(/<\/li><br><li>/g, '</li><li>');
    html = html.replace(/<ul><br>/g, '<ul>');
    html = html.replace(/<br><\/ul>/g, '</ul>');

    return html;
  }

  function processMessageContent(content, isThinkingIncluded, contentType) {
    const thinkingMatch = content.match(/\[Thinking Process\]\n([\s\S]*?)\n\n\[Response\]\n([\s\S]*)/);

    if (thinkingMatch && isThinkingIncluded) {
      const thinking = thinkingMatch[1];
      const response = thinkingMatch[2];

      const processedResponse = contentType === 'html' ? sanitizeHtml(response) : markdownToHtml(response);

      return `
        <div class="thinking-trace">
          <div class="thinking-header">💭 Thinking Process</div>
          <div class="thinking-content">${markdownToHtml(thinking)}</div>
        </div>
        <div class="response-content">${processedResponse}</div>
      `;
    }

    if (contentType === 'html') {
      return sanitizeHtml(content);
    }

    return markdownToHtml(content);
  }

  function processMermaidBlocks(html) {
    if (!html) return html;

    let processed = html;
    
    processed = processed.replace(/<svg[^>]*(?:class="[^"]*mermaid[^"]*"|id="mermaid[^"]*")[^>]*>[\s\S]*?<\/svg>/gi, (match) => {
      return `<div class="mermaid-diagram">${match}</div>`;
    });

    processed = processed.replace(/<pre[^>]*>\s*<code[^>]*class="[^"]*language-mermaid[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (match, code) => {
      const decoded = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      return `<div class="mermaid">${decoded.trim()}</div>`;
    });

    processed = processed.replace(/<code[^>]*class="[^"]*language-mermaid[^"]*"[^>]*>([\s\S]*?)<\/code>/gi, (match, code) => {
      const decoded = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      return `<div class="mermaid">${decoded.trim()}</div>`;
    });

    processed = processed.replace(/<div[^>]*class="[^"]*mermaid[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (match, content) => {
      return `<div class="mermaid">${content.trim()}</div>`;
    });

    return processed;
  }

  function sanitizeHtml(html) {
    if (!html) return '';

    let cleaned = processMermaidBlocks(html);

    cleaned = cleaned
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\s*on\w+="[^"]*"/gi, '')
      .replace(/\s*on\w+='[^']*'/gi, '');

    cleaned = cleaned.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '');

    cleaned = cleaned.replace(/<div[^>]*class="[^"]*chatItemMenu[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

    cleaned = cleaned.replace(/<div[^>]*class="[^"]*flex[^"]*items-center[^"]*gap[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

    cleaned = cleaned.replace(/<div[^>]*class="[^"]*action-bar[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    cleaned = cleaned.replace(/<div[^>]*data-testid="action-bar[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

    cleaned = cleaned.replace(/<div[^>]*class="[^"]*code-block-decoration[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

    cleaned = cleaned.replace(/<svg(?![^>]*(?:class="[^"]*(?:mermaid|flowchart|sequence|gantt|pie|graph)[^"]*"|id="mermaid[^"]*"))[^>]*>[\s\S]*?<\/svg>/gi, (match) => {
      if (match.includes('class="root"') || 
          match.includes('flowchart') || 
          match.includes('mermaid') ||
          match.includes('sequence') ||
          match.includes('gantt') ||
          match.length > 1000) {
        return match;
      }
      return '';
    });
    
    cleaned = cleaned.replace(/<mat-icon[^>]*>[\s\S]*?<\/mat-icon>/gi, '');

    cleaned = cleaned.replace(/<(span|div)[^>]*>\s*<\/(span|div)>/gi, '');

    return cleaned;
  }

  const styles = options.darkMode ? `
    body { background: #1a1a2e; color: #e0e0e0; }
    .message { background: #252545; border-color: #3a3a5a; }
    .user .label { color: #a5b4fc; }
    .assistant .label { color: #86efac; }
    .code-block { background: #1e1e3f; border-color: #3a3a5a; }
    .inline-code { background: #2d2d4a; color: #f8b4d9; }
    .thinking-trace { background: #1e1e3f; border-color: #4a4a6a; }
    blockquote { border-left-color: #6366f1; background: #1e1e3f; }
    a { color: #93c5fd; }
    hr { border-color: #3a3a5a; }
    th, td { border-color: #3a3a5a; }
    th { background: #2d2d4a; }
    .codespan, code.cursor-pointer { background: #2d2d4a; color: #f8b4d9; }
    pre { background: #1e1e3f; color: #e5e7eb; }
  ` : `
    body { background: #ffffff; color: #1a1a1a; }
    .message { border-color: #e5e7eb; }
    .user .label { color: #4f46e5; }
    .assistant .label { color: #059669; }
    .code-block { background: #1f2937; color: #e5e7eb; border-color: #374151; }
    .inline-code { background: #f3f4f6; color: #c026d3; }
    .thinking-trace { background: #f0f9ff; border-color: #bae6fd; }
    blockquote { border-left-color: #6366f1; background: #f5f3ff; }
    a { color: #2563eb; }
    hr { border-color: #e5e7eb; }
  `;

  const aiIconUrl = platformIcons[platform.key] || platformIcons.chatgpt;

  const messagesHtml = messages.map(msg => `
    <div class="message ${msg.role}">
      <div class="message-start">
        <div class="label">
          ${msg.role === 'user'
      ? `<span class="icon user-icon">${userIconSvg}</span><span>You</span>`
      : `<img src="${aiIconUrl}" alt="${platform.name}" class="icon ai-icon" onerror="this.style.display='none'"><span>${platform.name}</span>`
    }
        </div>
      </div>
      <div class="content">${processMessageContent(msg.content, options.includeThinking, msg.contentType)}</div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          padding: 40px;
          line-height: 1.7;
          font-size: 14px;
        }
        ${styles}
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 2px solid currentColor;
          opacity: 0.9;
        }
        .header h1 {
          font-size: 26px;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .header .meta {
          font-size: 13px;
          opacity: 0.65;
        }
        
        .messages {
          max-width: 820px;
          margin: 0 auto;
        }
        
        .message {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(128, 128, 128, 0.2);
        }
        .message:last-child {
          border-bottom: none;
        }
        
        .label {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .message-start {
          break-inside: avoid;
          page-break-inside: avoid;
          break-after: avoid;
          page-break-after: avoid;
        }
        .icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        .user-icon {
          display: inline-flex;
        }
        .ai-icon {
          border-radius: 4px;
        }
        
        .content {
          font-size: 14px;
          line-height: 1.75;
        }
        
        h1, h2, h3 {
          margin: 16px 0 8px 0;
          font-weight: 600;
        }
        h1 { font-size: 1.5em; }
        h2 { font-size: 1.3em; }
        h3 { font-size: 1.15em; }
        
        strong { font-weight: 600; }
        em { font-style: italic; }
        del { text-decoration: line-through; opacity: 0.7; }
        
        .code-block {
          padding: 16px;
          border-radius: 8px;
          margin: 12px 0;
          overflow-x: auto;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 13px;
          line-height: 1.5;
          border: 1px solid;
        }
        .code-block code {
          white-space: pre;
        }
        .inline-code {
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.9em;
        }
        
        ul, ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        li {
          margin: 4px 0;
        }
        
        blockquote {
          border-left: 4px solid;
          padding: 12px 16px;
          margin: 12px 0;
          border-radius: 0 8px 8px 0;
        }
        
        a {
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        
        hr {
          border: none;
          border-top: 1px solid;
          margin: 20px 0;
        }
        
        .thinking-trace {
          border: 1px solid;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .thinking-header {
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 10px;
          opacity: 0.8;
        }
        .thinking-content {
          font-style: italic;
          opacity: 0.85;
          font-size: 13px;
          line-height: 1.6;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 13px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background: #f3f4f6;
          font-weight: 600;
        }
        
        .codespan, code.cursor-pointer {
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.9em;
          background: #f3f4f6;
          color: #c026d3;
        }
        pre {
          padding: 16px;
          border-radius: 8px;
          margin: 12px 0;
          overflow-x: auto;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 13px;
          line-height: 1.5;
          background: #1f2937;
          color: #e5e7eb;
        }
        pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 24px;
          border-top: 1px solid currentColor;
          opacity: 0.5;
          font-size: 12px;
        }
        
        .prose p { margin: 8px 0; }
        .prose ul, .prose ol { margin: 8px 0; padding-left: 24px; }
        .prose li { margin: 4px 0; }
        .prose strong { font-weight: 600; }
        .prose em { font-style: italic; }
        .prose h1, .prose h2, .prose h3 { margin: 16px 0 8px 0; font-weight: 600; }
        .prose pre { margin: 12px 0; }
        .prose code { font-family: 'SFMono-Regular', Consolas, monospace; }
        
        .standard-markdown p { margin: 8px 0; }
        .standard-markdown ul, .standard-markdown ol { margin: 8px 0; padding-left: 24px; }
        .standard-markdown li { margin: 4px 0; }
        .standard-markdown strong { font-weight: 600; }
        .standard-markdown em { font-style: italic; }
        .font-claude-response-body { line-height: 1.7; }
        
        .markdown-main-panel p { margin: 8px 0; }
        .markdown-main-panel ul, .markdown-main-panel ol { margin: 8px 0; padding-left: 24px; }
        .markdown-main-panel li { margin: 4px 0; }
        .model-response-text p { margin: 8px 0; }
        
        .hljs-keyword { color: #c792ea; }
        .hljs-string { color: #c3e88d; }
        .hljs-number { color: #f78c6c; }
        .hljs-function { color: #82aaff; }
        .hljs-comment { color: #676e95; font-style: italic; }
        .hljs-built_in { color: #ffcb6b; }
        .hljs-tag { color: #f07178; }
        .hljs-attr { color: #ffcb6b; }
        .hljs-title { color: #82aaff; }
        
        .katex { font-size: 1.1em; }
        .math-inline { display: inline; }
        .math-block { display: block; margin: 12px 0; text-align: center; }
        
        .mermaid, .mermaid-diagram {
          display: flex;
          justify-content: center;
          margin: 16px 0;
          padding: 16px;
          background: ${options.darkMode ? '#1e1e3f' : '#f8fafc'};
          border-radius: 8px;
          overflow-x: auto;
        }
        .mermaid svg, .mermaid-diagram svg {
          max-width: 100%;
          height: auto;
        }
        .mermaid-diagram svg.mermaid-svg,
        .mermaid-diagram svg.flowchart,
        .mermaid-diagram svg[id^="mermaid"] {
          width: 100%;
          max-height: 80vh;
        }
        .mermaid-error {
          color: #ef4444;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 13px;
        }
        
        .code-container { display: block; white-space: pre; }
        
        p { margin: 8px 0; }
        
        @page {
          margin: 0.75in;
          @top-left { content: none; }
          @top-center { content: none; }
          @top-right { content: none; }
          @bottom-left { content: none; }
          @bottom-center { content: none; }
          @bottom-right { content: none; }
        }
        
        @media print {
          body { 
            padding: 20px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .message { 
            break-inside: auto;
            page-break-inside: auto;
            border-bottom: none;
          }
          
          .label { 
            break-after: avoid;
            page-break-after: avoid;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .message > .label + .content > *:first-child {
            break-before: avoid;
            page-break-before: avoid;
          }
          
          .code-block, pre, table, blockquote {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          h1, h2, h3, h4, h5, h6 {
            break-after: avoid;
            page-break-after: avoid;
          }
          
          p {
            widows: 3;
            orphans: 3;
          }
          
          .thinking-trace {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .footer {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          a { color: inherit; }
        }
      </style>
    </head>
    <body>
      <style>
        .print-instructions {
          display: none;
        }
        @media print {
          .print-instructions {
            display: none !important;
          }
        }
      </style>
      <div class="print-instructions" style="background: #fff3cd; border: 1px solid #ffc107; padding: 12px; margin-bottom: 20px; border-radius: 4px; font-size: 12px;">
        <strong>Tip:</strong> To remove the date/URL from the top of each page, go to "More settings" in the print dialog and uncheck "Headers and footers".
      </div>
      <div class="header">
        <h1>${escapeHtml(title)}</h1>
        <div class="meta">
          Exported from ${platform.name} on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      </div>
      <div class="messages">
        ${messagesHtml}
      </div>
      <div class="footer">
        Exported with ChatVault • ${messages.length} messages
      </div>
      
      <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
      <script>
        mermaid.initialize({
          startOnLoad: true,
          theme: '${options.darkMode ? 'dark' : 'default'}',
          securityLevel: 'loose',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
        });
        
        window.mermaidReady = false;
        mermaid.run().then(() => {
          window.mermaidReady = true;
        }).catch((err) => {
          console.error('Mermaid rendering error:', err);
          window.mermaidReady = true;
        });
      </script>
    </body>
    </html>
  `;

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Firefox requires using Blob URL to avoid cross-origin issues
  const blob = new Blob([html], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);
  
  const printWindow = window.open(blobUrl, '_blank');
  
  if (!printWindow) {
    URL.revokeObjectURL(blobUrl);
    throw new Error('Failed to open print window. Please allow popups for this site.');
  }

  // Wait for the window to load, then trigger print
  const checkAndPrint = setInterval(() => {
    try {
      if (printWindow.document && printWindow.document.readyState === 'complete') {
        clearInterval(checkAndPrint);
        
        // Wait for Mermaid to render
        const waitForMermaid = () => {
          try {
            if (printWindow.mermaidReady) {
              setTimeout(() => {
                printWindow.print();
                // Clean up blob URL after a delay
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
              }, 500);
            } else {
              setTimeout(waitForMermaid, 100);
            }
          } catch (e) {
            // If we can't access the window anymore, clean up
            clearTimeout(waitForMermaid);
            URL.revokeObjectURL(blobUrl);
          }
        };
        
        setTimeout(waitForMermaid, 250);
        
        // Fallback timeout
        setTimeout(() => {
          try {
            if (!printWindow.mermaidReady && !printWindow.closed) {
              printWindow.mermaidReady = true;
            }
          } catch (e) {
            // Window might be closed or inaccessible
          }
        }, 5000);
      }
    } catch (e) {
      // If we can't access the window, stop trying
      clearInterval(checkAndPrint);
      URL.revokeObjectURL(blobUrl);
    }
  }, 100);
  
  // Safety timeout to clean up
  setTimeout(() => {
    clearInterval(checkAndPrint);
  }, 10000);

  return { success: true, messageCount: messages.length };
}

// UI Helper functions
function showError(message) {
  elements.statusContainer.classList.remove('hidden', 'success');
  elements.statusContainer.classList.add('error');
  elements.statusIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#ef4444" stroke-width="2"/><path d="M7 7l6 6M13 7l-6 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>';
  elements.statusMessage.textContent = message;
}

function showSuccess(message) {
  elements.statusContainer.classList.remove('hidden', 'error');
  elements.statusContainer.classList.add('success');
  elements.statusIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#22c55e" stroke-width="2"/><path d="M6 10l3 3 5-5" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  elements.statusMessage.textContent = message;
}

function setExporting(isExporting) {
  elements.exportBtn.disabled = isExporting;
  elements.progressContainer.classList.toggle('hidden', !isExporting);

  if (isExporting) {
    elements.exportBtnText.textContent = 'Exporting...';
    elements.exportBtn.querySelector('svg').classList.add('hidden');
  } else {
    elements.exportBtnText.textContent = 'Export to PDF';
    elements.exportBtn.querySelector('svg').classList.remove('hidden');
  }
}

function updateProgress(percent, text) {
  elements.progressFill.style.width = `${percent}%`;
  elements.progressText.textContent = text;
  if (elements.progressPercent) {
    elements.progressPercent.textContent = `${Math.round(percent)}%`;
  }
}
