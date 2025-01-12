import React from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Chatbox from "./chatbox"; 
import Image from "next/image"; 
import "@/app/globals.css";

interface PopoverConfig {
  bgColor: string;
  avatarUrl: any;
  chatbotName: string;
  companyLogo: string;
  companyName: string;
  description: string;
  tone: string;
  temperature: number;
  isVisible: boolean;
  lang: string;
  botId: string;
  domain: string; 
  watermark: boolean;
  welcomeMessage: string,
  onClose: () => void;
}

const Popover = (config: PopoverConfig) => {
  return (
    <AnimatePresence>
      {config.isVisible && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-14 right-0 mb-5 rounded-lg border border-gray-300 bg-background text-chatbottext p-3 shadow-lg"
          exit={{ opacity: 0, y: 50 }}
          initial={{ opacity: 0, y: 50 }}
          style={{
            display: "flex",
            flexDirection: "column",
            inset: "auto auto 14px -24px !important",
            width: "min(400px, 80vw)",
            height: "60vh",
            transform: "translateX(calc(100% - 60px))",
            overflow: "hidden",
            borderColor: "black",
          }}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center p-1">
              {config.companyLogo && (
                <img
                  alt={`${config.companyName} Logo`}
                  className="mr-2 h-8 w-8 rounded-full"
                  height={32}
                  src={config.companyLogo}
                  width={32}
                />
              )}
              <h4 className="text-lg font-semibold">{config.companyName}</h4>
            </div>
            <Chatbox
              bgColor={config.bgColor}
              avatarUrl={config.avatarUrl}
              chatbotName={config.chatbotName}
              companyLogo={config.companyLogo}
              companyName={config.companyName}
              description={config.description}
              lang={config.lang}
              botId={config.botId}
              domain={config.domain}
              watermark={config.watermark}
              welcomeMessage={config.welcomeMessage}
            />
            <Button
              className="absolute right-3 top-3"
              onClick={config.onClose}
              size="iconsmall"
              variant="ghost"
            >
              x
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popover;
