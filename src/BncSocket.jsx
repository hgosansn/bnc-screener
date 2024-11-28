import { aggregate, cleanTradeData } from "./TradeData";



const TICKER_TRADE_WINDOWS = ["4h", "1d", "1h"];

const STREAMS = {
    Rolling_Window_Statistics: "!ticker_<window-size>@arr",
};

const BINANCE_SOCKET_URL = "wss://stream.binance.com:9443/ws/";

export const wsHandler = (callback) => {
	return (event) => {
		// Parse the event data
		console.log(event.data);
		const eventTrades = JSON.parse(event.data);
		try {
			callback(eventTrades);
		} catch (error) {
			console.error(error);
		}
	}
};

export const bncSocket = () => {
	const ws = new WebSocket(`${BINANCE_SOCKET_URL}${STREAMS.Rolling_Window_Statistics.replace(
		"<window-size>", 
		TICKER_TRADE_WINDOWS[2]
	)}`);

	ws.onmessage = () => { /* Default is do nothing */ };

	ws.onping = (payload) => {
		ws.pong(payload);
	};

	ws.onopen = () => {
		console.log("WebSocket Connected");
	};

	ws.onerror = (error) => {
		console.error("WebSocket Error:", error);
	};

	ws.onclose = () => {
		console.log("WebSocket Disconnected");
	};
	return ws;
}