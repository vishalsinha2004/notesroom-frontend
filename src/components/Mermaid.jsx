// src/components/Mermaid.jsx
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize globally
mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
});

export default function Mermaid({ chart }) {
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Listen for dark mode toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!containerRef.current || !chart) return;

      try {
        // Clean up any stray HTML entities or invisible characters
        const cleanChart = chart
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .trim();

        // Re-initialize with current theme
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
        });

        containerRef.current.innerHTML = '';
        
        // Ensure a strictly unique ID for React strict mode
        const id = `mermaid-svg-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        // Render the diagram (Handles both Mermaid v9 string returns and v10+ Promise objects)
        const result = await mermaid.render(id, cleanChart);
        
        if (!isMounted) return; // Prevent memory leaks if unmounted

        // Extract SVG safely
        const svg = typeof result === 'string' ? result : result.svg;
        containerRef.current.innerHTML = svg;

      } catch (error) {
        if (!isMounted) return;
        console.error('Mermaid render error:', error);
        
        // Show a clean fallback with the error message
        containerRef.current.innerHTML = `
          <div class="text-amber-600 dark:text-amber-400 text-sm p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
            <strong>Diagram failed to draw.</strong> (Special character parsing error).
          </div>
          <pre class="text-xs mt-3 text-gray-700 dark:text-gray-300 overflow-x-auto p-3 bg-gray-100 dark:bg-[#1e1f20] rounded-xl border border-gray-200 dark:border-gray-800">${chart}</pre>
        `;
      }
    };

    renderChart();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [chart, isDark]);

  return (
    <div 
      className="flex flex-col justify-center my-5 p-4 bg-white dark:bg-[#1a1b1e] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto custom-scrollbar w-full transition-colors" 
      ref={containerRef} 
    />
  );
}