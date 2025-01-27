import React, { useEffect, useRef, useState } from 'react';
import dreamerUrl from './assets/bnc_dreamer.png';
import logoUrl from './assets/bnc_screener_logo.png';
import { bncSocket, wsHandler } from './BncSocket';
import { cleanedTradeData } from './TestData';
import { TradesTable } from './Trade';

import { newTradesCallback } from './TradeData';

import { WelcomeBanner } from './welcome';

const DEFAULT_FILTER = 'USDC';

const TICKER_TRADE_WINDOWS = ['1d', '4h', '1h'];

const RESPONSIVE_BREAKPOINT = 1024;

const App = () => {
    const [isWebSocketActive, setIsWebSocketActive] = useState(false);
    const [trades, setTrades] = useState(cleanedTradeData);
    const wsRef = useRef(null);
    const [filter, setFilter] = useState(DEFAULT_FILTER);
    const [sort, setSort] = useState({});
    const [ticker, setTicker] = useState(TICKER_TRADE_WINDOWS[2]);
    const [navMinified, setNavMinified] = useState(false);

    const [welcomed, setWelcomed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setNavMinified(window.innerWidth < RESPONSIVE_BREAKPOINT);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isWebSocketActive) {
            setupWebSocket();
        }
        return () => {
            closeWebSocket();
        };
    }, [isWebSocketActive]);

    useEffect(() => {
        return () => {
            if (isWebSocketActive) {
                wsRef.current.close();
            }
            setTrades([]);
            setupWebSocket();
        };
    }, [ticker]);

    useEffect(() => {
        setTrades((prevTrades) =>
            newTradesCallback(prevTrades, trades, getFilters(), getSorts()),
        );
        if (wsRef.current) {
            wsRef.current.onmessage = wsHandler(onMessageCallback());
        }
    }, [sort, filter]);

    const getFilters = () => {
        return filter;
    };

    const getSorts = () => {
        return sort;
    };

    const onMessageCallback = () => {
        return (newTrades) => {
            setTrades((prevTrades) =>
                newTradesCallback(
                    prevTrades,
                    newTrades,
                    getFilters(),
                    getSorts(),
                ),
            );
        };
    };

    const setupWebSocket = () => {
        const ws = bncSocket(ticker);

        ws.onmessage = wsHandler(onMessageCallback());

        ws.onopen = () => {
            console.debug('WebSocket Connected');
            setIsWebSocketActive(true);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setIsWebSocketActive(false);
        };

        ws.onclose = () => {
            console.debug('WebSocket Disconnected');
            setIsWebSocketActive(false);
        };

        wsRef.current = ws;
    };

    const closeWebSocket = () => {
        wsRef?.current?.close();
        wsRef.current = null;
    };

    const handleToggle = () => {
        setIsWebSocketActive(!isWebSocketActive);
    };

    const welcomeUser = () => {
        setWelcomed(true);
        setIsWebSocketActive(true);
    };

    return (
        <div className="App flex flex-row">
            {!welcomed ? <WelcomeBanner welcome={() => welcomeUser()} /> : ''}
            <div className="App-content flex  flex-grow min-w-full max-h-full overflow-hidden">
                <div
                    className={`App-nav theme-border border-r flex-grow-0 flex flex-col relative ${navMinified ? 'max-w-16' : 'min-w-[300px]'}`}
                >
                    <button
                        className="minify-nav absolute top-0 right-0 p-4 min-w-14"
                        onClick={() => {
                            setNavMinified(!navMinified);
                        }}
                    >
                        {navMinified ? '▶' : '◀'}
                    </button>
                    <div
                        className={`logo-container flex flex-col items-center justify-center ${navMinified ? 'max-h-14 max-w-14 mt-14' : ''}`}
                    >
                        <img
                            src={logoUrl}
                            alt="Binance Logo"
                            width="300"
                            height="300"
                            className="logo"
                        />
                    </div>
                    <nav className="nav-links flex flex-grow"></nav>
                    {!navMinified ? (
                        <div className="absolute -bottom-48">
                            <img
                                src={dreamerUrl}
                                alt="Illustration"
                                width="300"
                                height="300"
                                className="-bottom-6"
                            />
                        </div>
                    ) : (
                        ''
                    )}
                </div>
                <div className="trades-container flex-grow flex-col flex overflow-hidden max-w-full ">
                    <header className="App-header flex flex-row flex-grow-0 min-w-full theme-border border-b min-h-16 justify-between items-center p-4">
                        <input
                            className="px-4 py-2 ml-8 theme-secondary-b rounded-lg overflow-hidden theme-focus"
                            placeholder="Filter by symbol"
                            value={filter}
                            onChange={(event) => {
                                setFilter(event.target.value);
                            }}
                        />
                        <div className="flex flex-row gap-4">
                            {TICKER_TRADE_WINDOWS.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        setTicker(t);
                                    }}
                                    className={`px-4 py-2 rounded-lg overflow-hidden theme-secondary-b ${
                                        ticker === t
                                            ? 'theme-border'
                                            : 'opacity-40'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div
                            onClick={handleToggle}
                            onKeyUp={handleToggle}
                            className="connection-toggle cursor-pointer theme-active"
                        >
                            <div className="px-4 py-2 rounded-lg flex flex-row items-center justify-center theme-secondary-b gap-3">
                                {isWebSocketActive ? 'Active' : 'Inactive'}
                                <div
                                    id="status-dot"
                                    className={`w-2 h-2 rounded-full  overflow-hidden ${
                                        isWebSocketActive
                                            ? 'bg-green-500 pulse-dot'
                                            : 'bg-red-500'
                                    }`}
                                ></div>
                            </div>
                        </div>
                    </header>
                    <TradesTable
                        trades={trades}
                        sort={sort}
                        onSortChange={(sort) => {
                            setSort(sort);
                        }}
                    />
                    <div className="flex flex-row justify-evenly items-center px-6 py-3 border-t-2 theme-border text-gray-500 text-xs">
                        <a
                            href="mailto:contact@hson.fr"
                            id="contact"
                            title="Contact email"
                            rel="author"
                            target="_top"
                        >
                            contact@hson.fr
                        </a>
                        <span> © 2024-2025. </span>
                        <a
                            href="https://creativecommons.org/licenses/by-nc/4.0/"
                            title="Creative Commons License"
                            target="_blank"
                            rel="noopener noreferrer external"
                            aria-label="Creative Commons License"
                        >
                            Some rights reserved.
                        </a>
                        <a
                            href="https://github.com/hgosansn/bnc-screener"
                            title="Github repository"
                            target="_blank"
                            rel="noopener noreferrer external"
                            aria-label="Github repository"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2em"
                                height="2em"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                                ></path>
                            </svg>
                        </a>
                        <a
                            href="https://www.buymeacoffee.com/hgosansn"
                            title="Buy me a coffee"
                            id="a_cup_of_coffee"
                            target="_blank"
                            rel="noopener noreferrer external"
                            aria-label="Buy me a coffee"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2em"
                                height="2em"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="m20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379c-.197-.069-.42-.098-.57-.241c-.152-.143-.196-.366-.231-.572c-.065-.378-.125-.756-.192-1.133c-.057-.325-.102-.69-.25-.987c-.195-.4-.597-.634-.996-.788a6 6 0 0 0-.626-.194c-1-.263-2.05-.36-3.077-.416a26 26 0 0 0-3.7.062c-.915.083-1.88.184-2.75.5c-.318.116-.646.256-.888.501c-.297.302-.393.77-.177 1.146c.154.267.415.456.692.58c.36.162.737.284 1.123.366c1.075.238 2.189.331 3.287.37q1.829.074 3.65-.118q.449-.05.896-.119c.352-.054.578-.513.474-.834c-.124-.383-.457-.531-.834-.473c-.466.074-.96.108-1.382.146q-1.767.12-3.536.006a22 22 0 0 1-1.157-.107c-.086-.01-.18-.025-.258-.036q-.364-.055-.724-.13c-.111-.027-.111-.185 0-.212h.005q.416-.09.838-.147h.002c.131-.009.263-.032.394-.048a25 25 0 0 1 3.426-.12q1.011.029 2.017.144l.228.031q.4.06.798.145c.392.085.895.113 1.07.542c.055.137.08.288.111.431l.319 1.484a.237.237 0 0 1-.199.284h-.003l-.112.015a37 37 0 0 1-4.743.295a37 37 0 0 1-4.699-.304c-.14-.017-.293-.042-.417-.06c-.326-.048-.649-.108-.973-.161c-.393-.065-.768-.032-1.123.161c-.29.16-.527.404-.675.701c-.154.316-.199.66-.267 1c-.069.34-.176.707-.135 1.056c.087.753.613 1.365 1.37 1.502a39.7 39.7 0 0 0 11.343.376a.483.483 0 0 1 .535.53l-.071.697l-1.018 9.907c-.041.41-.047.832-.125 1.237c-.122.637-.553 1.028-1.182 1.171q-.868.197-1.756.205c-.656.004-1.31-.025-1.966-.022c-.699.004-1.556-.06-2.095-.58c-.475-.458-.54-1.174-.605-1.793l-.731-7.013l-.322-3.094c-.037-.351-.286-.695-.678-.678c-.336.015-.718.3-.678.679l.228 2.185l.949 9.112c.147 1.344 1.174 2.068 2.446 2.272c.742.12 1.503.144 2.257.156c.966.016 1.942.053 2.892-.122c1.408-.258 2.465-1.198 2.616-2.657l1.024-9.995l.215-2.087a.48.48 0 0 1 .39-.426c.402-.078.787-.212 1.074-.518c.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233c-2.416.359-4.866.54-7.308.46c-1.748-.06-3.477-.254-5.207-.498c-.17-.024-.353-.055-.47-.18c-.22-.236-.111-.71-.054-.995c.052-.26.152-.609.463-.646c.484-.057 1.046.148 1.526.22q.865.132 1.737.212c2.48.226 5.002.19 7.472-.14q.675-.09 1.345-.21c.399-.072.84-.206 1.08.206c.166.281.188.657.162.974a.54.54 0 0 1-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a6 6 0 0 1-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38c0 0 1.243.065 1.658.065c.447 0 1.786-.065 1.786-.065c.783 0 1.434-.6 1.499-1.38l.94-9.95a4 4 0 0 0-1.322-.238c-.826 0-1.491.284-2.26.613"
                                ></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
