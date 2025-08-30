import React from 'react';

interface LivePreviewProps {
  code: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ code }) => {
  return (
    <iframe
      srcDoc={code}
      title="Live Preview"
      style={{ width: '100%', height: '500px', border: 'none' }}
      sandbox="allow-scripts"
    />
  );
};

export default LivePreview;