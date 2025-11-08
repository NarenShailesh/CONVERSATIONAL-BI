
import React, { useEffect, useRef } from 'react';

interface ChartDisplayProps {
  htmlContent: string;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ htmlContent }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = htmlContent;
      const scripts = Array.from(containerRef.current.getElementsByTagName('script'));
      // FIX: Add explicit type for `oldScript` to resolve TypeScript errors where
      // the compiler was incorrectly inferring its type as `unknown`. This ensures
      // properties like `attributes`, `innerHTML`, and `parentNode` are accessible.
      scripts.forEach((oldScript: HTMLScriptElement) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [htmlContent]);

  return <div ref={containerRef} className="w-full h-full"></div>;
};
