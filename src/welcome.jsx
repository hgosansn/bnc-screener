import React from "react";

export const WelcomeBanner = ({ welcome }) => {
	return (<div className="modaleBackdrop fixed top-0 left-0 bottom-0 right-0 backdrop-blur-lg z-20 items-center justify-center flex">
		<div className="modal flex flex-col justify-center items-center bg-gray-800 rounded-lg p-8 w-1/2 z-30 max-w-[500px]">
			<div className="text-2xl font-bold text-white">Welcome to BNC Screener</div>
			<div className="text-white text-lg mt-4">This is a simple tool to monitor the latest trades on <a aria-label="Binance page" target="_blank" href="https://binance.com/">Binance</a></div>
			<div className="text-white text-lg mt-4">You can filter by symbol and toggle the connection to the public <a aria-label="Websocket docs" href="https://developers.binance.com/docs/binance-spot-api-docs/web-socket-api">WebSocket</a>.</div>
			<div className="text-white text-lg mt-4">Enjoy!</div>
			<button onClick={() => welcome()} className="mt-8 px-4 py-2 bg-gray-900 rounded-lg text-white">Got it!</button>
		</div>
	</div>)
}