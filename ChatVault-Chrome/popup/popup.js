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
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
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
    const results = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: detectChatMessages,
      args: [currentPlatform.key]
    });

    const result = results[0]?.result;

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
      // Use article conversation turns as primary, fallback to data-message-author-role
      messages: 'article[data-testid*="conversation-turn"], [data-message-author-role]',
      userMessage: 'article[data-turn="user"], [data-message-author-role="user"]',
      assistantMessage: 'article[data-turn="assistant"], [data-message-author-role="assistant"]'
    },
    claude: {
      // Use the exact selectors from Claude's DOM structure
      messages: '[data-testid="user-message"], .standard-markdown',
      userMessage: '[data-testid="user-message"]',
      assistantMessage: '.standard-markdown'
    },
    gemini: {
      // Count conversation containers for accurate message count
      messages: '.conversation-container',
      userMessage: '.query-content, .user-query-content',
      assistantMessage: '.response-container'
    },
    zai: {
      // Only count parent containers, not nested elements
      messages: '.user-message, [class*="message-"][class*="svelte"]',
      userMessage: '.user-message',
      assistantMessage: '[class*="message-"][class*="svelte"]'
    },
    deepseek: {
      // DeepSeek chat structure - user messages in .fbb737a4, assistant in .ds-markdown
      messages: '.ds-markdown[style*="--ds-md-zoom"], .fbb737a4',
      userMessage: '.fbb737a4',
      assistantMessage: '.ds-markdown[style*="--ds-md-zoom"]'
    },
    kimi: {
      // Kimi chat structure based on DOM analysis
      messages: '.chat-content-item-user, .chat-content-item-assistant',
      userMessage: '.segment-user .user-content, .chat-content-item-user',
      assistantMessage: '.segment-assistant .markdown, .chat-content-item-assistant'
    },
    qwen: {
      // Qwen chat structure based on DOM analysis
      messages: '.qwen-chat-message',
      userMessage: '.qwen-chat-message-user',
      assistantMessage: '.qwen-chat-message-assistant'
    }
  };

  const config = selectors[platformKey];
  if (!config) return { count: 0 };

  const messages = document.querySelectorAll(config.messages);

  // For Gemini, count conversation turns (each has user + assistant)
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

      // Incremental extraction: scroll to each message and capture
      const incrementalResults = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: async () => {
          const allMessages = new Map(); // Use Map to deduplicate by turn number

          // Find the scrollable container
          const scrollContainer = document.querySelector('[data-scroll-root="true"]') ||
            document.querySelector('main') ||
            document.documentElement;

          if (!scrollContainer) return { messages: [], title: document.title };

          // Helper to extract messages currently in DOM
          const extractVisibleMessages = () => {
            const articles = document.querySelectorAll('article[data-testid*="conversation-turn"]');
            const extracted = [];

            articles.forEach((article) => {
              const testId = article.getAttribute('data-testid') || '';
              const turnNumber = parseInt(testId.match(/conversation-turn-(\d+)/)?.[1] || '0');
              if (turnNumber === 0) return;

              // Get role
              let role = article.getAttribute('data-turn');
              if (!role || (role !== 'user' && role !== 'assistant')) {
                const roleEl = article.querySelector('[data-message-author-role]');
                role = roleEl?.getAttribute('data-message-author-role');
              }
              if (!role || (role !== 'user' && role !== 'assistant')) return;

              // Extract content - use innerHTML to preserve markdown formatting
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
                  // Use innerHTML to preserve formatting (code blocks, lists, etc.)
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

          // Scroll to top first
          scrollContainer.scrollTop = 0;
          await new Promise(r => setTimeout(r, 400));

          // Extract initial messages
          extractVisibleMessages().forEach(msg => {
            if (!allMessages.has(msg.turnNumber)) {
              allMessages.set(msg.turnNumber, msg);
            }
          });

          // Scroll through in small increments, extracting at each position
          const scrollHeight = scrollContainer.scrollHeight;
          const viewportHeight = scrollContainer.clientHeight;
          const scrollStep = viewportHeight * 0.5; // 50% overlap for better coverage

          let currentScroll = 0;
          let iterations = 0;
          const maxIterations = 100; // Safety limit

          while (currentScroll < scrollHeight && iterations < maxIterations) {
            currentScroll += scrollStep;
            scrollContainer.scrollTo({ top: currentScroll, behavior: 'instant' });
            await new Promise(r => setTimeout(r, 200)); // Wait for render

            // Extract visible messages at this scroll position
            extractVisibleMessages().forEach(msg => {
              if (!allMessages.has(msg.turnNumber)) {
                allMessages.set(msg.turnNumber, msg);
              }
            });

            iterations++;
          }

          // One final extraction at the bottom
          scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'instant' });
          await new Promise(r => setTimeout(r, 300));
          extractVisibleMessages().forEach(msg => {
            if (!allMessages.has(msg.turnNumber)) {
              allMessages.set(msg.turnNumber, msg);
            }
          });

          // Convert to sorted array
          const messages = Array.from(allMessages.values())
            .sort((a, b) => a.turnNumber - b.turnNumber);

          // Get title
          let title = document.title || 'Chat Export';

          return {
            messages,
            title,
            platform: 'chatgpt',
            exportedAt: new Date().toISOString()
          };
        }
      });

      chatData = incrementalResults[0]?.result;
      updateProgress(35, 'Processing messages...');

    } else {
      // For other platforms, use the standard extraction
      updateProgress(20, 'Extracting messages...');

      const results = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: extractChatContent,
        args: [currentPlatform.key, options]
      });

      chatData = results[0]?.result;
    }

    if (!chatData || chatData.messages.length === 0) {
      throw new Error('No messages could be extracted');
    }

    updateProgress(40, 'Generating PDF...');

    // Generate PDF
    const pdfResults = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: generatePDF,
      args: [chatData, options, currentPlatform]
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

      // Get all conversation turns using article elements
      // Each article has data-testid="conversation-turn-N" and data-turn="user"|"assistant"
      const conversationTurns = Array.from(document.querySelectorAll('article[data-testid*="conversation-turn"]'));

      conversationTurns.forEach((article) => {
        const testId = article.getAttribute('data-testid') || '';
        const turnNumber = parseInt(testId.match(/conversation-turn-(\d+)/)?.[1] || '0');

        if (turnNumber === 0) return;

        // Get role from data-turn attribute on the article (primary method)
        // Fallback to nested data-message-author-role if data-turn not present
        let role = article.getAttribute('data-turn');

        if (!role || (role !== 'user' && role !== 'assistant')) {
          const roleEl = article.querySelector('[data-message-author-role]');
          role = roleEl?.getAttribute('data-message-author-role');
        }

        // Skip if we still can't determine the role
        if (!role || (role !== 'user' && role !== 'assistant')) return;

        const isUser = role === 'user';
        let content = '';

        if (isUser) {
          // User messages are in .whitespace-pre-wrap div
          const userTextEl = article.querySelector('.whitespace-pre-wrap');
          content = userTextEl?.innerText?.trim() || '';

          // Fallback: try getting from the message container directly
          if (!content) {
            const messageEl = article.querySelector('[data-message-author-role="user"]');
            content = messageEl?.innerText?.trim() || '';
          }
        } else {
          // Assistant messages are in .markdown.prose div
          // The full class is: "markdown prose dark:prose-invert w-full wrap-break-word dark markdown-new-styling"
          const markdownEl = article.querySelector('.markdown.prose') ||
            article.querySelector('div.markdown') ||
            article.querySelector('[class*="markdown-new-styling"]');

          if (markdownEl) {
            // Use innerHTML to preserve markdown formatting (code blocks, lists, bold, etc.)
            content = markdownEl.innerHTML?.trim() || '';
          }

          // Fallback: try getting from the message container directly
          if (!content) {
            const messageEl = article.querySelector('[data-message-author-role="assistant"]');
            content = messageEl?.innerHTML?.trim() || '';
          }
        }

        // Only add if we have content
        if (content) {
          messages.push({
            role: isUser ? 'user' : 'assistant',
            content: content,
            contentType: isUser ? 'text' : 'html', // Preserve markdown for assistant messages
            turnNumber: turnNumber
          });
        }
      });

      // Sort by turn number to ensure correct order
      messages.sort((a, b) => a.turnNumber - b.turnNumber);

      return messages;
    },

    claude: () => {
      const messages = [];
      const seenContent = new Set();

      // Get user messages - using the exact structure from Claude
      const userMessages = document.querySelectorAll('[data-testid="user-message"]');

      userMessages.forEach((el, i) => {
        // Get text from the paragraph inside
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

      // Get assistant messages - using the standard-markdown container
      const assistantContainers = document.querySelectorAll('.standard-markdown');

      assistantContainers.forEach((el, i) => {
        // Use innerHTML to preserve markdown formatting (code blocks, lists, bold, etc.)
        const htmlContent = el.innerHTML?.trim() || '';
        const textContent = el.innerText?.trim() || ''; // For deduplication

        if (htmlContent && textContent && !seenContent.has(textContent)) {
          seenContent.add(textContent);
          messages.push({
            role: 'assistant',
            content: htmlContent,
            contentType: 'html', // Preserve markdown formatting
            index: i * 2 + 1
          });
        }
      });

      // Fallback: if standard-markdown not found, try font-claude-response-body
      if (assistantContainers.length === 0) {
        const responseParagraphs = document.querySelectorAll('.font-claude-response-body');
        // Group consecutive response paragraphs as one message
        let currentResponse = '';
        let currentResponseText = ''; // For deduplication
        let responseIndex = 0;

        responseParagraphs.forEach((el, i) => {
          const parent = el.closest('[data-testid="user-message"]');
          // Skip if this is inside a user message
          if (parent) return;

          currentResponse += (currentResponse ? '<br><br>' : '') + el.innerHTML?.trim();
          currentResponseText += (currentResponseText ? '\n\n' : '') + el.innerText?.trim();

          // Check if next sibling is also a response or if this is the last one
          const nextEl = responseParagraphs[i + 1];
          const isLastOrDifferentMessage = !nextEl ||
            el.closest('.standard-markdown') !== nextEl?.closest('.standard-markdown');

          if (isLastOrDifferentMessage && currentResponse && !seenContent.has(currentResponseText)) {
            seenContent.add(currentResponseText);
            messages.push({
              role: 'assistant',
              content: currentResponse,
              contentType: 'html', // Preserve markdown formatting
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

      // Primary method: Look for conversation turns/containers
      // Each turn contains both the user query and AI response
      const conversationTurns = document.querySelectorAll('.conversation-container');

      if (conversationTurns.length > 0) {
        conversationTurns.forEach((turn, index) => {
          // Get user query - look for the query content container, not individual lines
          const queryContainer = turn.querySelector('.query-content, .user-query-content, [class*="query-content"]');
          const queryText = turn.querySelector('.query-text');
          const userQueryEl = queryContainer || queryText;

          if (userQueryEl) {
            // Get the full text content, preserving the complete message
            const content = userQueryEl.innerText?.trim();
            if (content) {
              messages.push({
                role: 'user',
                content: content,
                index: index * 2
              });
            }
          }

          // Get AI response
          const responseContainer = turn.querySelector('.response-container');
          if (responseContainer) {
            // Look for the actual response text content - use innerHTML to preserve formatting
            const responseText = responseContainer.querySelector('.model-response-text, message-content, .markdown-main-panel, .markdown') || responseContainer;
            const htmlContent = responseText.innerHTML?.trim();
            if (htmlContent) {
              messages.push({
                role: 'assistant',
                content: htmlContent,
                contentType: 'html', // Preserve markdown formatting
                index: index * 2 + 1
              });
            }
          }
        });
      }

      // Fallback: Try to find user queries at the top level (avoiding duplicates)
      if (messages.length === 0) {
        // Get unique user query containers (not individual text lines)
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

        // Get AI responses
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
              contentType: 'html', // Preserve markdown formatting
              index: i * 2 + 1
            });
          }
        });
      }

      // Final fallback: Look for heading elements that contain user prompts
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
              contentType: 'html', // Preserve markdown formatting
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

      // Get user messages - use more specific selectors to avoid duplicates
      // .user-message contains .chat-user, so we should only select one
      const userMessageContainers = document.querySelectorAll('.user-message');

      userMessageContainers.forEach((el, i) => {
        // Get the actual text content from chat-user inside, or the element itself
        const textEl = el.querySelector('.chat-user') || el;
        const content = textEl.innerText?.trim();

        // Avoid duplicates by checking if we've seen this content
        if (content && !seenUserContent.has(content)) {
          seenUserContent.add(content);
          messages.push({
            role: 'user',
            content: content,
            index: i * 2
          });
        }
      });

      // Fallback: if no .user-message found, try .chat-user directly
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

      // Get assistant messages - select the container, not nested elements
      // Look for message containers with svelte class that contain .chat-assistant
      const assistantContainers = document.querySelectorAll('[class*="message-"][class*="svelte"]');

      assistantContainers.forEach((el, i) => {
        let content = '';
        let thinkingContent = '';
        let responseContent = '';

        // Find thinking section (in Z.ai it's inside .thinking-chain-container)
        const thinkingContainer = el.querySelector('.thinking-chain-container, [class*="thinking"], [class*="Thought"]');

        // Find the main response content area
        const responseArea = el.querySelector('.chat-assistant .markdown-prose') ||
          el.querySelector('.chat-assistant') ||
          el.querySelector('.markdown-prose');

        if (!responseArea) return;

        // Clone the response area to manipulate without affecting the original DOM
        const responseClone = responseArea.cloneNode(true);

        // Remove thinking section from clone if it exists inside (and we want to exclude it)
        const thinkingInClone = responseClone.querySelector('.thinking-chain-container, [class*="thinking-block"], [class*="thinking"]');
        if (thinkingInClone) {
          thinkingInClone.remove();
        }

        // Get the main response HTML content (preserves markdown formatting)
        responseContent = responseClone.innerHTML?.trim() || '';

        // If user wants thinking included and we found a thinking section
        if (options.includeThinking && thinkingContainer) {
          // Get thinking content from the blockquote inside the thinking container
          const thinkingBlockquote = thinkingContainer.querySelector('blockquote');
          if (thinkingBlockquote) {
            thinkingContent = thinkingBlockquote.innerText?.trim() || '';
          }

          if (thinkingContent) {
            content = `[Thinking Process]\n${thinkingContent}\n\n[Response]\n${responseContent}`;
          } else {
            content = responseContent;
          }
        } else {
          content = responseContent;
        }

        // Use text content for deduplication (more reliable)
        const textForDedup = responseClone.innerText?.trim() || '';

        // Avoid duplicates
        if (content && textForDedup && !seenAssistantContent.has(textForDedup)) {
          seenAssistantContent.add(textForDedup);
          messages.push({
            role: 'assistant',
            content: content,
            contentType: 'html', // Flag to indicate this is HTML content
            index: i * 2 + 1
          });
        }
      });

      // Fallback: if no svelte containers found, try .chat-assistant directly
      if (seenAssistantContent.size === 0) {
        const chatAssistantElements = document.querySelectorAll('.chat-assistant');
        chatAssistantElements.forEach((el, i) => {
          const htmlContent = el.innerHTML?.trim();
          const textContent = el.innerText?.trim();
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

      // DeepSeek uses markdown blocks for content
      // User messages are in specific containers, assistant messages use ds-markdown
      // We need to iterate through messages in DOM order to preserve conversation flow

      // Select both user and assistant message containers and iterate in DOM order
      const allMessageElements = document.querySelectorAll('.fbb737a4, .ds-markdown[style*="--ds-md-zoom"]');

      allMessageElements.forEach((el, i) => {
        // Determine if this is a user or assistant message based on element class
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

      // Sort by index to ensure DOM order is preserved
      return messages.sort((a, b) => a.index - b.index);
    },

    kimi: () => {
      const messages = [];
      const seenContent = new Set();

      // Kimi uses chat-content-item containers with user/assistant variants
      // Based on the DOM structure from kimi-dom-structure.md

      const chatItems = document.querySelectorAll('.chat-content-item');

      chatItems.forEach((item, i) => {
        const isUser = item.classList.contains('chat-content-item-user');
        const isAssistant = item.classList.contains('chat-content-item-assistant');

        if (isUser) {
          // User messages: .segment-user .user-content or .segment-content-box
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
          // Assistant messages: .markdown-container .markdown
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

      // Fallback: try segment-based extraction if no chat items found
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

      // Qwen chat structure based on actual DOM analysis:
      // User messages: .qwen-chat-message-user > .chat-user-message > .user-message-content
      // Assistant messages: .qwen-chat-message-assistant > .qwen-markdown

      // Find all chat messages using the message container class
      const allMessages = document.querySelectorAll('.qwen-chat-message');

      allMessages.forEach((msgEl, i) => {
        const isUser = msgEl.classList.contains('qwen-chat-message-user');
        const isAssistant = msgEl.classList.contains('qwen-chat-message-assistant');

        if (isUser) {
          // User message: extract text from user-message-content or chat-user-message
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
          // Assistant message: extract HTML from qwen-markdown
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

      // Fallback: try alternative selectors if no messages found
      if (messages.length === 0) {
        // Try finding user messages
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

        // Try finding assistant messages
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

  // Try to get conversation title - platform-specific extraction
  let title = 'Chat Export';

  if (platformKey === 'zai') {
    // For Z.ai: The selected chat in the sidebar has specific background classes
    // We need to find the button that has a non-hover bg class (indicating it's selected)
    const sidebarButtons = document.querySelectorAll('#sidebar button');
    let selectedChat = null;

    for (const btn of sidebarButtons) {
      // Check if the button has a selected background (not just hover state)
      // Selected items have bg-[#F2F4F6] (light) or bg-[#37383B] (dark) directly applied
      const classList = btn.className;
      if ((classList.includes('bg-[#F2F4F6]') || classList.includes('bg-[#37383B]')) &&
        !classList.includes('group-hover')) {
        selectedChat = btn;
        break;
      }
    }

    if (selectedChat) {
      // Find the title div inside - it has dir="auto" and contains the text
      const titleDiv = selectedChat.querySelector('div[dir="auto"]');
      if (titleDiv && titleDiv.innerText) {
        title = titleDiv.innerText.trim();
      }
    }

    // Fallback: try to get from the first user message if sidebar title not found
    if (title === 'Chat Export') {
      const firstUserMsg = document.querySelector('.user-message .chat-user, .user-message');
      if (firstUserMsg) {
        const msgText = firstUserMsg.innerText?.trim();
        if (msgText) {
          // Use first 50 chars of first message as title
          title = msgText.length > 50 ? msgText.substring(0, 50) + '...' : msgText;
        }
      }
    }
  } else if (platformKey === 'qwen') {
    // For Qwen: Try to find the active/selected chat title in the sidebar
    // The sidebar has chat-item elements, and the selected one typically has an active state
    const selectedChatItem = document.querySelector('.chat-item.active, .chat-item-active, .sidebar-item.active, [class*="chat-item"][class*="active"]');
    if (selectedChatItem) {
      const titleEl = selectedChatItem.querySelector('.chat-item-title, .item-title, [class*="title"]');
      if (titleEl && titleEl.innerText) {
        title = titleEl.innerText.trim();
      }
    }

    // Try looking for a header title element in the chat area
    if (title === 'Chat Export') {
      const headerTitle = document.querySelector('.chat-header-title, .conversation-title, .chat-title, [class*="header"] [class*="title"]');
      if (headerTitle && headerTitle.innerText) {
        title = headerTitle.innerText.trim();
      }
    }

    // Try the tooltip that shows the chat title (based on the DOM structure observed)
    if (title === 'Chat Export') {
      const tooltip = document.querySelector('.ant-tooltip-inner');
      if (tooltip && tooltip.innerText && tooltip.innerText.length > 3 && tooltip.innerText.length < 100) {
        title = tooltip.innerText.trim();
      }
    }

    // Fallback: use first user message as title
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
    // For other platforms: use document.title or h1/title elements
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

  // Platform-specific icon URLs from Lobehub icons CDN
  const platformIcons = {
    chatgpt: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg',
    claude: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg',
    gemini: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg',
    zai: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zai.svg',
    deepseek: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek.svg',
    kimi: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/moonshot.svg',
    qwen: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg'
  };

  // User icon SVG (inline for reliability)
  const userIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  // Function to convert markdown to HTML
  function markdownToHtml(text) {
    if (!text) return '';

    let html = text;

    // Escape HTML first (but preserve our markdown)
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks (```language\ncode\n```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      // Special handling for Mermaid diagrams
      if (lang.toLowerCase() === 'mermaid') {
        return `<div class="mermaid">${code.trim()}</div>`;
      }
      return `<pre class="code-block"><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
    });

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Headers (## Header)
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold (**text** or __text__)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Strikethrough (~~text~~)
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // Links ([text](url))
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Unordered lists (- item or * item)
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists (1. item)
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Blockquotes (> text)
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rules (---)
    html = html.replace(/^---$/gm, '<hr>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Clean up consecutive <br> tags inside lists
    html = html.replace(/<\/li><br><li>/g, '</li><li>');
    html = html.replace(/<ul><br>/g, '<ul>');
    html = html.replace(/<br><\/ul>/g, '</ul>');

    return html;
  }

  // Function to process message content (handle thinking traces and content types)
  function processMessageContent(content, isThinkingIncluded, contentType) {
    // Check for thinking trace markers (used when thinking was included during extraction)
    const thinkingMatch = content.match(/\[Thinking Process\]\n([\s\S]*?)\n\n\[Response\]\n([\s\S]*)/);

    if (thinkingMatch && isThinkingIncluded) {
      const thinking = thinkingMatch[1];
      const response = thinkingMatch[2];

      // Response might be HTML from Z.ai
      const processedResponse = contentType === 'html' ? sanitizeHtml(response) : markdownToHtml(response);

      return `
        <div class="thinking-trace">
          <div class="thinking-header">💭 Thinking Process</div>
          <div class="thinking-content">${markdownToHtml(thinking)}</div>
        </div>
        <div class="response-content">${processedResponse}</div>
      `;
    }

    // If content is already HTML (from platforms like Z.ai), sanitize and use it directly
    if (contentType === 'html') {
      return sanitizeHtml(content);
    }

    // Otherwise, convert markdown to HTML
    return markdownToHtml(content);
  }

  // Function to extract and convert mermaid code blocks in HTML content
  function processMermaidBlocks(html) {
    if (!html) return html;

    // First, preserve already-rendered Mermaid SVGs (from DeepSeek and other platforms)
    // These SVGs have class "mermaid-svg" or similar identifiers
    let processed = html;
    
    // Wrap standalone mermaid SVGs in a container div for styling
    // Match SVGs with mermaid-related classes or IDs
    processed = processed.replace(/<svg[^>]*(?:class="[^"]*mermaid[^"]*"|id="mermaid[^"]*")[^>]*>[\s\S]*?<\/svg>/gi, (match) => {
      return `<div class="mermaid-diagram">${match}</div>`;
    });

    // Match pre>code blocks with mermaid language class
    processed = processed.replace(/<pre[^>]*>\s*<code[^>]*class="[^"]*language-mermaid[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (match, code) => {
      // Decode HTML entities
      const decoded = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      return `<div class="mermaid">${decoded.trim()}</div>`;
    });

    // Also match code blocks without pre wrapper
    processed = processed.replace(/<code[^>]*class="[^"]*language-mermaid[^"]*"[^>]*>([\s\S]*?)<\/code>/gi, (match, code) => {
      const decoded = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      return `<div class="mermaid">${decoded.trim()}</div>`;
    });

    // Match existing mermaid divs/elements from platforms (e.g., class containing 'mermaid')
    // Keep them as-is but ensure they have the right class
    processed = processed.replace(/<div[^>]*class="[^"]*mermaid[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (match, content) => {
      return `<div class="mermaid">${content.trim()}</div>`;
    });

    return processed;
  }

  // Function to sanitize HTML content from chat platforms
  function sanitizeHtml(html) {
    if (!html) return '';

    // First process mermaid blocks before sanitization
    let cleaned = processMermaidBlocks(html);

    // Remove potentially harmful scripts and event handlers
    cleaned = cleaned
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\s*on\w+="[^"]*"/gi, '')
      .replace(/\s*on\w+='[^']*'/gi, '');

    // Remove platform-specific UI elements that shouldn't be in export
    // All platforms: Remove buttons (copy, action buttons, etc.)
    cleaned = cleaned.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '');

    // Z.ai specific
    cleaned = cleaned.replace(/<div[^>]*class="[^"]*chatItemMenu[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

    // ChatGPT specific: Remove action bars, copy buttons, and toolbar elements
    cleaned = cleaned.replace(/<div[^>]*class="[^"]*flex[^"]*items-center[^"]*gap[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

    // Claude specific: Remove action bars and feedback elements
    cleaned = cleaned.replace(/<div[^>]*class="[^"]*action-bar[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    cleaned = cleaned.replace(/<div[^>]*data-testid="action-bar[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

    // Gemini specific: Remove code block decorations and copy buttons
    cleaned = cleaned.replace(/<div[^>]*class="[^"]*code-block-decoration[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

    // Remove small SVG icons but PRESERVE Mermaid diagram SVGs
    // Mermaid SVGs typically have class="mermaid-svg" or "flowchart" or id starting with "mermaid"
    // Small icon SVGs usually have small width/height or are inside buttons
    cleaned = cleaned.replace(/<svg(?![^>]*(?:class="[^"]*(?:mermaid|flowchart|sequence|gantt|pie|graph)[^"]*"|id="mermaid[^"]*"))[^>]*>[\s\S]*?<\/svg>/gi, (match) => {
      // Check if this looks like a diagram (large/complex) vs an icon (small)
      // Mermaid diagrams usually have viewBox with large dimensions or contain <g class="root">
      if (match.includes('class="root"') || 
          match.includes('flowchart') || 
          match.includes('mermaid') ||
          match.includes('sequence') ||
          match.includes('gantt') ||
          match.length > 1000) { // Diagrams are typically large
        return match; // Preserve the SVG
      }
      return ''; // Remove small icon SVGs
    });
    
    cleaned = cleaned.replace(/<mat-icon[^>]*>[\s\S]*?<\/mat-icon>/gi, '');

    // Clean up empty spans and divs
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
        
        /* Header */
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
        
        /* Messages container */
        .messages {
          max-width: 820px;
          margin: 0 auto;
        }
        
        /* Individual message */
        .message {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(128, 128, 128, 0.2);
        }
        .message:last-child {
          border-bottom: none;
        }
        
        /* Message label with icon */
        .label {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        /* Message start section - ensures label doesn't orphan at page bottom */
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
        
        /* Message content */
        .content {
          font-size: 14px;
          line-height: 1.75;
        }
        
        /* Typography */
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
        
        /* Code blocks */
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
        
        /* Lists */
        ul, ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        li {
          margin: 4px 0;
        }
        
        /* Blockquotes */
        blockquote {
          border-left: 4px solid;
          padding: 12px 16px;
          margin: 12px 0;
          border-radius: 0 8px 8px 0;
        }
        
        /* Links */
        a {
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        
        /* Horizontal rule */
        hr {
          border: none;
          border-top: 1px solid;
          margin: 20px 0;
        }
        
        /* Thinking trace */
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
        
        /* Tables (from Z.ai HTML) */
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
        
        /* Code elements from Z.ai */
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
        
        /* Footer */
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 24px;
          border-top: 1px solid currentColor;
          opacity: 0.5;
          font-size: 12px;
        }
        
        /* Platform-specific HTML elements */
        /* ChatGPT markdown elements */
        .prose p { margin: 8px 0; }
        .prose ul, .prose ol { margin: 8px 0; padding-left: 24px; }
        .prose li { margin: 4px 0; }
        .prose strong { font-weight: 600; }
        .prose em { font-style: italic; }
        .prose h1, .prose h2, .prose h3 { margin: 16px 0 8px 0; font-weight: 600; }
        .prose pre { margin: 12px 0; }
        .prose code { font-family: 'SFMono-Regular', Consolas, monospace; }
        
        /* Claude markdown elements */
        .standard-markdown p { margin: 8px 0; }
        .standard-markdown ul, .standard-markdown ol { margin: 8px 0; padding-left: 24px; }
        .standard-markdown li { margin: 4px 0; }
        .standard-markdown strong { font-weight: 600; }
        .standard-markdown em { font-style: italic; }
        .font-claude-response-body { line-height: 1.7; }
        
        /* Gemini markdown elements */
        .markdown-main-panel p { margin: 8px 0; }
        .markdown-main-panel ul, .markdown-main-panel ol { margin: 8px 0; padding-left: 24px; }
        .markdown-main-panel li { margin: 4px 0; }
        .model-response-text p { margin: 8px 0; }
        
        /* Syntax highlighting (from various platforms) */
        .hljs-keyword { color: #c792ea; }
        .hljs-string { color: #c3e88d; }
        .hljs-number { color: #f78c6c; }
        .hljs-function { color: #82aaff; }
        .hljs-comment { color: #676e95; font-style: italic; }
        .hljs-built_in { color: #ffcb6b; }
        .hljs-tag { color: #f07178; }
        .hljs-attr { color: #ffcb6b; }
        .hljs-title { color: #82aaff; }
        
        /* Math elements (KaTeX from Gemini) */
        .katex { font-size: 1.1em; }
        .math-inline { display: inline; }
        .math-block { display: block; margin: 12px 0; text-align: center; }
        
        /* Mermaid diagrams */
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
        /* Ensure pre-rendered Mermaid SVGs display correctly */
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
        
        /* Code container elements */
        .code-container { display: block; white-space: pre; }
        
        /* Paragraphs in exported content */
        p { margin: 8px 0; }
        
        /* Print styles */
        @page {
          margin: 0.75in; /* Page margins */
          /* Remove browser headers/footers */
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
          
          /* Allow messages to break across pages for long content */
          .message { 
            break-inside: auto;
            page-break-inside: auto;
            border-bottom: none;
          }
          
          /* Keep labels (user/assistant headers) with following content */
          /* If break would happen here, push to next page */
          .label { 
            break-after: avoid;
            page-break-after: avoid;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          /* Wrapper for label + first bit of content to stay together */
          .message > .label + .content > *:first-child {
            break-before: avoid;
            page-break-before: avoid;
          }
          
          /* Avoid breaking inside code blocks, tables, and other structural elements */
          .code-block, pre, table, blockquote {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          /* Keep headings with following content */
          h1, h2, h3, h4, h5, h6 {
            break-after: avoid;
            page-break-after: avoid;
          }
          
          /* Avoid widows and orphans */
          p {
            widows: 3;
            orphans: 3;
          }
          
          /* Keep thinking trace together if small */
          .thinking-trace {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          /* Footer only at the end */
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
        /* Print instructions - only visible in print preview */
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
      
      <!-- Mermaid library for diagram rendering -->
      <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
      <script>
        // Initialize Mermaid with appropriate theme
        mermaid.initialize({
          startOnLoad: true,
          theme: '${options.darkMode ? 'dark' : 'default'}',
          securityLevel: 'loose',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
        });
        
        // Signal when mermaid is done rendering
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

  // Open print dialog
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();

  // Trigger print after content loads and Mermaid diagrams are rendered
  printWindow.onload = () => {
    // Wait for Mermaid to finish rendering diagrams
    const waitForMermaid = () => {
      if (printWindow.mermaidReady) {
        // Give a bit more time for SVGs to fully render
        setTimeout(() => {
          printWindow.print();
        }, 500);
      } else {
        // Check again in 100ms
        setTimeout(waitForMermaid, 100);
      }
    };
    
    // Start checking after initial load, with a timeout fallback
    setTimeout(() => {
      waitForMermaid();
    }, 250);
    
    // Fallback: if Mermaid takes too long (5 seconds), print anyway
    setTimeout(() => {
      if (!printWindow.mermaidReady) {
        printWindow.mermaidReady = true;
      }
    }, 5000);
  };

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
