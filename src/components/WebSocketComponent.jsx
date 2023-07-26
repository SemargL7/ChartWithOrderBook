import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

const WebSocketComponent = () => {
    const [bidsData, setBidsData] = useState([]);
    const [asksData, setAsksData] = useState([]);
    const webSocketRef = useRef(null);

    const { symbol1, symbol2, filterValue, round } = useOutletContext();

    useEffect(() => {
        // Function to connect WebSocket
        const connectWebSocket = () => {
            const binanceWebSocketURL = `wss://stream.binance.com:9443/ws/${symbol1.toLowerCase()}${symbol2.toLowerCase()}@depth`;
            webSocketRef.current = new WebSocket(binanceWebSocketURL);

            webSocketRef.current.onopen = () => {
                console.log('WebSocket connection opened.', symbol1, symbol2);

                // Subscribe to the depth data for the selected trading pair with a depth level of 10 (adjust as needed).
                webSocketRef.current.send(
                    JSON.stringify({
                        method: 'SUBSCRIBE',
                        params: [`${symbol1.toLowerCase()}${symbol2.toLowerCase()}@depth`],
                        id: 1,
                    })
                );
            };

            webSocketRef.current.onmessage = (event) => {
                const message = JSON.parse(event.data);

                if (message.e === 'depthUpdate') {
                    // You will receive depth data updates here.
                    const { a, b } = message;
                    setBidsData(b);
                    setAsksData(a);
                    console.log(symbol1, symbol2)
                }

            };

            webSocketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            webSocketRef.current.onclose = (event) => {
                console.log('WebSocket connection closed:', event.code, event.reason,symbol1, symbol2) ;
            };
        };

        connectWebSocket();
        // Cleanup function to close the WebSocket on component unmount
        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
            }
        };
    }, [symbol1, symbol2]);

    return (
        <>
            <Outlet context={{ bidsData, asksData, symbol1, symbol2, filterValue, round}} />
        </>
    );
};

export default WebSocketComponent;
