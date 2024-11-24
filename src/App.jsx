import React, { useState, useEffect, useRef } from "react";
import { TradesTable } from "./Trade";
import logoUrl from './assets/bnc_screener_logo.png';
import { bncSocket, wsHandler } from "./BncSocket";


const App = () => {
    const [isWebSocketActive, setIsWebSocketActive] = useState(false);
    const [trades, setTrades] = useState([]);
    const wsRef = useRef(null);
	const [filter, setFilter] = useState("");

    useEffect(() => {
		
        if (isWebSocketActive) {
			setupWebSocket();
        }

		return () => {
			wsRef?.current?.close();
			wsRef.current = null;
		};
    }, [isWebSocketActive]);

	useEffect(() => {
		if (wsRef.current) {
			wsRef.current.onmessage = wsHandler(filter, setTrades);
		}
	}, [filter]);

	const setupWebSocket = () => {
		const ws = bncSocket();

		ws.onmessage = wsHandler(filter, setTrades);

		ws.onopen = () => {
			console.log("WebSocket Connected");
			setIsWebSocketActive(true);
		};
	
		ws.onerror = (error) => {
			console.error("WebSocket Error:", error);
			setIsWebSocketActive(false);
		};
	
		ws.onclose = () => {
			console.log("WebSocket Disconnected");
			setIsWebSocketActive(false);
		};

		wsRef.current = ws;
	}

    const handleToggle = () => {
        setIsWebSocketActive(!isWebSocketActive);
    };

    return (
        <div className="App flex flex-col">
  			<img src={logoUrl} alt="Binance Logo" width="300" height="300" className="logo"/>

			<div className="App-content flex  flex-grow min-w-full">
				<div className="App-nav border-gray-800 border-r min-w-[300px] flex-grow-0 py-10">
				</div>
				<div className="trades-container flex-grow flex-col ">
					<header className="App-header flex flex-row flex-grow-0 min-w-full border-gray-800 border-b">
						<input
							className="px-4 py-2 ml-8 bg-gray-700 rounded-lg overflow-hidden focus-visible:border-none focus-visible:outline-none"
							placeholder="Filter by symbol"
							value={filter}
							onChange={(event) => {
								setFilter(event.target.value);
							}}
						/>
						<div onClick={handleToggle} className="connection-toggle cursor-pointer">
							{isWebSocketActive ?
								<div className="px-4 py-2 rounded-lg flex flex-row items-center justify-center bg-gray-800 gap-3" >
									Active <div id="status-dot" className="w-2 h-2 rounded-full bg-green-500 pulse-dot overflow-hidden"></div>
								</div>
								:
								<div className="px-4 py-2 rounded-lg flex flex-row items-center justify-center bg-gray-800 gap-3" >
									Inactive <div id="status-dot" className="w-2 h-2 rounded-full bg-red-500 overflow-hidden"></div>
								</div>
							}
						</div>
					</header>
					<TradesTable trades={trades} />
				</div>
			</div>
        </div>
    );
}

export default App;
