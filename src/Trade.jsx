import React from 'react';
import { customDataModel } from './TradeData';

const dataModel = customDataModel;
const dataKeys = Object.keys(dataModel).filter((key) => dataModel[key].active);

const TradesHeader = ({ sortState, onSortChange }) => (
    <thead className="">
        <tr className="sticky top-0 backdrop-blur-md z-10 table-head">
            {dataKeys.map((key) => {
                let sort = '';
                if (sortState[key] === 'asc') {
                    sort = '▲';
                } else if (sortState[key] === 'desc') {
                    sort = '▼';
                }
                return (
                    <th
                        key={key}
                        align="right"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hover:cursor-pointer"
                        onClick={() => {
                            onSortChange({
                                ...sortState,
                                [key]:
                                    sortState[key] === 'asc'
                                        ? 'desc'
                                        : sortState[key] === 'desc'
                                          ? ''
                                          : 'asc',
                            });
                        }}
                    >
                        {dataModel[key].description} {sort}
                    </th>
                );
            })}
        </tr>
    </thead>
);

const cellValue = (trade, key) => {
    switch (key) {
        case 'sp':
            return (
                <a
                    target="_blank"
                    href={trade.tradeUrl}
                    className="hover:underline"
                >
                    {trade[key]}
                </a>
            );
        case 'P':
        case 'diff':
            return !trade[key] ? (
                ''
            ) : (
                <span
                    className={
                        trade[key] > 0 ? 'text-green-300' : 'text-red-300'
                    }
                >
                    {trade[key]}%
                </span>
            );
        case 'vol':
            return (
                <span>
                    {trade[key] > 5 ? '💰' : ''} {trade[key]}%
                </span>
            );
        case 'q':
            return <span>{trade[key]} $</span>;
        default:
            return <span>{trade[key]}</span>;
    }
};

const Trade = ({ trade }) => (
    <tr
        key={trade.s}
        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
    >
        {dataKeys
            .filter((key) => dataModel[key].active)
            .map((key) => (
                <td key={key} className="px-6 py-3 text-right">
                    {cellValue(trade, key)}
                </td>
            ))}
    </tr>
);

const TradesTable = ({ trades, sort, onSortChange }) => (
    <div className="overflow-y-scroll flex flex-grow flex-col justify-stretch align-middle min-w-full">
        <table
            aria-label="simple table"
            className="min-w-full divide-gray-200 overflow-y-scroll overflow-x-hidden max-h-full"
        >
            <TradesHeader
                key="head"
                sortState={sort}
                onSortChange={(sort) => {
                    onSortChange(sort);
                }}
            />
            <tbody>
                {trades.map((trade) => (
                    <Trade key={trade.s} trade={trade} />
                ))}
            </tbody>
        </table>
    </div>
);

export { Trade, TradesHeader, TradesTable };
