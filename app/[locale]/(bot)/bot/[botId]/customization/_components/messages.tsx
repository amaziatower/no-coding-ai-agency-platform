import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ msg }) => {
  return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override the default heading rendering to apply custom styles
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-primary">
              {props.children}
            </h1>
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-primary">
              {props.children}
            </h2>
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-primary">
              {props.children}
            </h3>
          ),
          h4: ({ node, ...props }) => (
            <h4 {...props} className="text-primary">
              {props.children}
            </h4>
          ),
          h5: ({ node, ...props }) => (
            <h5 {...props} className="text-primary">
              {props.children}
            </h5>
          ),
          h6: ({ node, ...props }) => (
            <h6 {...props} className="text-primary">
              {props.children}
            </h6>
          ),
          // Override the default paragraph rendering to apply custom styles
          p: ({ node, ...props }) => (
            <p {...props} className="text-primary">
              {props.children}
            </p>
          ),
          // Override the default strong tag rendering to apply custom styles
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-bold text-primary">
              {props.children}
            </strong>
          ),
          // Override the default anchor tag rendering to apply custom styles
          a: ({ node, ...props }) => (
            <a {...props} className="text-primary hover:underline">
              {props.children}
            </a>
          ),
        }}
      >
        {msg.text}
      </ReactMarkdown>
  );
};

export default MessageBubble;
