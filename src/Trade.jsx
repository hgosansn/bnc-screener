
import React, { useEffect, useState } from 'react';
import { customDataModel } from './TradeData';


const dataModel = customDataModel;
const dataKeys = Object.keys(dataModel).filter((key) => dataModel[key].active);

const TradesHeader = () => (
	<thead>
		<tr>
			{dataKeys.map((key) => (
				<th key={key} align="right" className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
					{dataModel[key].description}
				</th>
			))}
		</tr>
	</thead>
);

const Trade = ({ trade }) => (
	<tr key={trade.s} className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
		{dataKeys.filter((key) => dataModel[key].active).map((key) => (
			<td key={key} className='px-6 py-3 text-right'>{trade[key]}</td>
		))}
	</tr>
);


const TradesTable = ({ trades }) => (
	<table aria-label="simple table" className="min-w-full divide-gray-200">
		<TradesHeader key="head" />
		<tbody>
			{trades.map((trade) => (<Trade key={trade.s} trade={trade} />))}
		</tbody>
	</table>
);

export { Trade, TradesHeader, TradesTable };
