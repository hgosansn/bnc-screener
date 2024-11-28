import React, { useState, useEffect, useRef } from "react";
import { TradesTable } from "./Trade";
import logoUrl from './assets/bnc_screener_logo.png';
import dreamerUrl from './assets/bnc_dreamer.png';
import { bncSocket, wsHandler } from "./BncSocket";
import { cleanedTradeData } from "./TestData";

import { newTradesCallback } from "./TradeData";

import { WelcomeBanner } from "./welcome";




const App = () => {
    const [isWebSocketActive, setIsWebSocketActive] = useState(false);
    const [trades, setTrades] = useState(cleanedTradeData);
    const wsRef = useRef(null);
	const [filter, setFilter] = useState("");

	const [welcomed, setWelcomed] = useState(false);

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
			wsRef.current.onmessage = wsHandler(onMessageCallback(filter));
		}
	}, [filter]);

	const onMessageCallback = (cfilter) => {
		return (newTrades) => {
			setTrades((prevTrades) => newTradesCallback(prevTrades, newTrades, cfilter));
		}
	}

	const setupWebSocket = () => {
		const ws = bncSocket();

		ws.onmessage = wsHandler(onMessageCallback(filter));

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

	const welcome = () => {
		setWelcomed(true);
		setIsWebSocketActive(true);
	}

    return (
        <div className="App flex flex-row">
			{!welcomed ? (<WelcomeBanner welcome={() => setWelcomed(true)}/>) : ''}
			<div className="App-content flex  flex-grow min-w-full max-h-full overflow-hidden">
				<div className="App-nav border-gray-200 border-r min-w-[300px] flex-grow-0 flex flex-col relative">
					<div className="">
						<img src={logoUrl} alt="Binance Logo" width="300" height="300" className="logo"/>
					</div>
					<nav className="nav-links flex flex-grow">
					</nav>
					<div className="absolute -bottom-48">
						<img src={dreamerUrl} alt="Illustration" width="300" height="300" className="-bottom-6"/>
					</div>
				</div>
				<div className="trades-container flex-grow flex-col flex overflow-hidden max-w-full ">
					<header className="App-header flex flex-row flex-grow-0 min-w-full border-gray-200 border-b min-h-16 justify-between items-center p-4">
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
								<div className="px-4 py-2 rounded-lg flex flex-row items-center justify-center bg-gray-200 gap-3" >
									Active <div id="status-dot" className="w-2 h-2 rounded-full bg-green-500 pulse-dot overflow-hidden"></div>
								</div>
								:
								<div className="px-4 py-2 rounded-lg flex flex-row items-center justify-center bg-gray-200 gap-3" >
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
