const STREAMS = {
    Rolling_Window_Statistics: '!ticker_<window-size>@arr',
};

const BINANCE_SOCKET_URL = 'wss://stream.binance.com:9443/ws/';

export const wsHandler = (callback) => {
    return (event) => {
        const eventTrades = JSON.parse(event.data);
        try {
            callback(eventTrades);
        } catch (error) {
            console.error(error);
        }
    };
};

export const bncSocket = (ticker) => {
    const ws = new WebSocket(
        `${BINANCE_SOCKET_URL}${STREAMS.Rolling_Window_Statistics.replace(
            '<window-size>',
            ticker,
        )}`,
    );

    ws.onmessage = () => {
        /* Default is do nothing */
    };

    ws.onping = (payload) => {
        ws.pong(payload);
    };

    // Default logs overriden by the caller
    ws.onopen = () => {
        console.debug('WebSocket Connected');
    };

    ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
        console.debug('WebSocket Disconnected');
    };
    return ws;
};
