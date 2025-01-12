import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Popover from './_components/popover';
import { Button } from '@/components/ui/button';
import { iconMap } from './_components/options';  // Import the iconMap
// import '../copilot.css';  // Import the Tailwind CSS
import logo from '../../assets/ollabot-small.png';  // Import local image
import styled from 'styled-components';

const defaultConfig = {
  bgColor: "#007BFF", 
  botName: "Assistant",
  companyName: "Chatbot",
  logoUrl: "https://hpogngdwousevnyrnmew.supabase.co/storage/v1/object/public/users/314e0620-64e1-4232-a56b-bf53b7f87337/avatar.png?t=2024-05-30T03%3A47%3A24.977Z",
  avatarUrl: logo,
  description: "",
  tone: "Professional/Academic",
  temperature: 0.7,
  chatBubbleIcon: "Bot", // Default icon type
  botId: "123",
  lang: "en",
  watermark: true,
  welcomeMessage: "Hello! How can I help you today?",
};

const fetchConfig = async (domain: string, botId: string) => {
  try {
    const response = await fetch(`${domain}/api/chatbot/${botId}/settings`);
    if (response.ok) {
      const data = await response.json();
      return {
        ...defaultConfig, // Start with default config
        ...data, // Override with fetched data
      };
    }
  } catch (error) {
    console.error("Error fetching bot config:", error);
  }
  return defaultConfig; // Return default config if fetch fails
};

const App = () => {
  const [config, setConfig] = useState(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [botId, setBotId] = useState("");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    const globalConfig = (window as any).embeddedChatbotConfig || {};
    fetchConfig(globalConfig.domain, globalConfig.botId).then(
      (fetchedConfig) => {
        const mergedConfig = { ...defaultConfig, ...globalConfig, ...fetchedConfig };
        setConfig(mergedConfig);
        setIsLoading(false);
        setPopoverOpen(mergedConfig.isVisible || false);
        setBotId(globalConfig.botId);
        setDomain(globalConfig.domain);
      }
    );
  }, []);

    const StyledButton = styled(Button)`
    width: 60px;
    height: 60px;
    background-color: ${config.bgColor};
    &:hover {
      background-color: ${config.bgColor};
      opacity: 0.9;
    }
  `;

  const togglePopover = () => {
    setPopoverOpen(!isPopoverOpen);
  };

  const chatIcon =
    iconMap[config.chatBubbleIcon as keyof typeof iconMap] || iconMap["Bot"];

  if (isLoading) {
    return <div></div>; // Render loading message while fetching config
  }
  console.log("Bot ID loaded in: ", botId);

  return (
    <div
      className="fixed bottom-4 right-4 flex flex-col items-end"
      style={{ zIndex: 2147483647 }}  // Set z-index to maximum value
    >      
    <Popover
        bgColor={config.bgColor}
        avatarUrl={config.avatarUrl}
        chatbotName={config.botName}
        companyLogo={config.logoUrl}
        companyName={config.companyName}
        isVisible={isPopoverOpen}
        description={config.description}
        tone={config.tone}
        temperature={config.temperature}
        lang={config.lang}
        botId={botId}
        domain={domain}
        watermark={config.watermark}
        welcomeMessage={config.welcomeMessage}
        onClose={() => setPopoverOpen(false)}
      />
      <Button
        className="rounded-full text-white shadow-lg transition-opacity hover:bg-opacity-90"
        onClick={togglePopover}
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: config.bgColor,
        }}
      >
        {isPopoverOpen ? "x" : chatIcon}{" "}
      </Button>
    </div>
  );
};

// document.addEventListener('readystatechange', () => {
//   if (document.readyState === 'complete') {
//     const styleElement = document.createElement('style');
//     styleElement.innerHTML = `
//       #ollabot-copilot .flex {
//         display: flex !important;
//       }
//       #ollabot-copilot .flex-row {
//         flex-direction: row !important;
//       }
//     `;
//     document.head.appendChild(styleElement);

//     const container = document.createElement('div');
//     container.id = 'ollabot-copilot';
//     document.body.appendChild(container);
//     const root = ReactDOM.createRoot(container);
//     root.render(<App />);
//   }
// });


document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    const container = document.createElement('div');
    container.id = 'ollabot-copilot';
    document.body.appendChild(container);

    const shadowRoot = container.attachShadow({ mode: 'open' });
    const shadowContainer = document.createElement('div');
    shadowRoot.appendChild(shadowContainer);

    fetch('https://app.ollabot.com/api/copilot-css')
      .then(response => response.text())
      .then(css => {
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        shadowRoot.appendChild(styleElement);

        const root = ReactDOM.createRoot(shadowContainer);
        root.render(<App />);
      })
      .catch(error => {
        console.error('Error fetching the CSS file:', error);
      });
  }
});
  