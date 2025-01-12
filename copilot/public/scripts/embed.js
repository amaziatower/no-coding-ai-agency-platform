(function() {
  const chatbotConfig = window.chatbotConfig || {};
  const chatbotId = chatbotConfig.chatbotId;
  const domain = chatbotConfig.domain;

  if (!chatbotId || !domain) {
    console.error('Chatbot configuration is missing');
    return;
  }

  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function initDummy() {
    loadScript('https://unpkg.com/react/umd/react.production.min.js', () => {
      loadScript('https://unpkg.com/react-dom/umd/react-dom.production.min.js', () => {
        const container = document.createElement('div');
        container.id = 'dummy-container';
        document.body.appendChild(container);

        const Dummy = window.Dummy;
        if (Dummy) {
          ReactDOM.render(
            React.createElement(Dummy, {}),
            container
          );
        } else {
          console.error('Dummy component is not defined on the window object');
        }
      });
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initDummy();
  } else {
    document.addEventListener('DOMContentLoaded', initDummy);
  }
})();
