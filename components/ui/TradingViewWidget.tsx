import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TradingView: any;
  }
}

let tvScriptLoadingPromise: Promise<void> | null = null;

export default function TradingViewWidget() {
  const onLoadScriptRef = useRef<(() => void) | undefined>(undefined);

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => {}; // Return an empty function instead of null

      function createWidget() {
        if (document.getElementById('tradingview_5f3cb') && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: "COINBASE:SOLUSD",
            interval: "H",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: "tradingview_5f3cb"
          });
        }
      }
    },
    []
  );

  return (
    <div className='tradingview-widget-container' style={{ height: "100%", width: "100%" }}>
      <div id='tradingview_5f3cb' style={{ height: "100%", width: "100%" }} />
    </div>
  );
}