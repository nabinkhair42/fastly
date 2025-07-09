import React from 'react';
import { Loader2 } from 'lucide-react';

const ScreenLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default ScreenLoader;
