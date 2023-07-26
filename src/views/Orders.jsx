import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderBookSection from '../components/OrderBookSection.jsx';

const Orders = () => {
    const [ordersBinance, setOrdersBinance] = useState([]);
    const [ordersByBit, setOrdersByBit] = useState([]);
    const [ordersCoinbase, setOrdersCoinbase] = useState([]);
    const [ordersKucoin, setOrdersKucoin] = useState([]);
    const [symbol1, setSymbol1] = useState('BTC');
    const [symbol2, setSymbol2] = useState('USDT');
    const [fix, setFix] = useState(0);
    const [fixQuantity, setFixQuantity] = useState(4);
    const [filterValue, setFilterValue] = useState(1000000);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    'https://api.binance.com/api/v3/depth',
                    {
                        params: {
                            symbol: symbol1 + symbol2,
                            limit: 1000,
                        },
                    }
                );

                const data = response.data;
                const filteredData = {
                    bids: {},
                    asks: {},
                };

                for (const item of data.bids) {
                    const itemPrice = parseFloat(item[0]).toFixed(fix);
                    if (filteredData.bids[itemPrice]) {
                        filteredData.bids[itemPrice] += parseFloat(item[1]);
                    } else {
                        filteredData.bids[itemPrice] = parseFloat(item[1]);
                    }
                }

                for (const item of data.asks) {
                    const itemPrice = parseFloat(item[0]).toFixed(fix);
                    if (filteredData.asks[itemPrice]) {
                        filteredData.asks[itemPrice] += parseFloat(item[1]);
                    } else {
                        filteredData.asks[itemPrice] = parseFloat(item[1]);
                    }
                }

                const bids = Object.entries(filteredData.bids).map(([price, quantity]) => [
                    price,
                    quantity.toFixed(fixQuantity),
                ]);
                const asks = Object.entries(filteredData.asks).map(([price, quantity]) => [
                    price,
                    quantity.toFixed(fixQuantity),
                ]);

                setOrdersBinance({ bids, asks });

            } catch (error) {
                console.error('Error fetching orders from Binance:', error);
            }

            try {
                const response = await axios.get(
                    `https://api.bybit.com/v2/public/orderBook/L2`,
                    {
                        params: {
                            symbol: symbol1 + symbol2,
                            depth: 1000,
                        },
                    }
                );

                const data = response.data;
                const filteredData = {
                    bids: {},
                    asks: {},
                };

                for (const item of data.result) {
                    const itemPrice = parseFloat(item.price).toFixed(fix);
                    const itemQuantity = parseFloat(item.size).toFixed(fixQuantity);

                    if (item.side === 'Buy') {
                        if (filteredData.bids[itemPrice]) {
                            filteredData.bids[itemPrice] += parseFloat(itemQuantity);
                        } else {
                            filteredData.bids[itemPrice] = parseFloat(itemQuantity);
                        }
                    } else if (item.side === 'Sell') {
                        if (filteredData.asks[itemPrice]) {
                            filteredData.asks[itemPrice] += parseFloat(itemQuantity);
                        } else {
                            filteredData.asks[itemPrice] = parseFloat(itemQuantity);
                        }
                    }
                }

                const bids = Object.entries(filteredData.bids).map(([price, quantity]) => [
                    price,
                    parseFloat(quantity).toFixed(fixQuantity),
                ]);

                const asks = Object.entries(filteredData.asks).map(([price, quantity]) => [
                    price,
                    parseFloat(quantity).toFixed(fixQuantity),
                ]);

                setOrdersByBit({ bids, asks });
            } catch (error) {
                setOrdersByBit([]);
                console.error('Error fetching orders from Bybit:', error);
            }

            try {
                const response = await axios.get(
                    'https://api.exchange.coinbase.com/products/'+symbol1+'-'+symbol2+'/book?level=2',
                );

                const data = response.data;
                const filteredData = {
                    bids: {},
                    asks: {},
                };

                for (const item of data.bids) {
                    const itemPrice = parseFloat(item[0]).toFixed(fix);
                    if (filteredData.bids[itemPrice]) {
                        filteredData.bids[itemPrice] += parseFloat(item[1]);
                    } else {
                        filteredData.bids[itemPrice] = parseFloat(item[1]);
                    }
                }

                for (const item of data.asks) {
                    const itemPrice = parseFloat(item[0]).toFixed(fix);
                    if (filteredData.asks[itemPrice]) {
                        filteredData.asks[itemPrice] += parseFloat(item[1]);
                    } else {
                        filteredData.asks[itemPrice] = parseFloat(item[1]);
                    }
                }

                const bids = Object.entries(filteredData.bids).map(([price, quantity]) => [
                    price,
                    quantity.toFixed(fixQuantity),
                ]);
                const asks = Object.entries(filteredData.asks).map(([price, quantity]) => [
                    price,
                    quantity.toFixed(fixQuantity),
                ]);

                setOrdersCoinbase({ bids, asks });

            } catch (error) {
                setOrdersCoinbase([]);
                console.error('Error fetching orders from CoinBase:', error);
            }

        };

        const interval = setInterval(() => {
            fetchOrders();
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, [symbol1,symbol2, fix, fixQuantity]);

    const toSymbol1 = ev => {
        ev.preventDefault();
        setSymbol1(ev.target.value);
    };
    const toSymbol2 = ev => {
        ev.preventDefault();
        setSymbol2(ev.target.value);
    };

    const getOpacityClass = (price, quantity, filter) => {
        let index = ((price * quantity) / filter);
        if (index > 1) index = 1;
        else if (index < 0.1) index = 0.1;
        return index;
    };

    const toFilter = ev => {
        ev.preventDefault();
        setFilterValue(ev.target.value);
    };

    const toFix = ev => {
        ev.preventDefault();
        setFix(ev.target.value);
    };

    return (
        <div>
            <h1>Orders</h1>
            <OrderBookHeader symbol1={symbol1} toSymbol1={toSymbol1} symbol2={symbol2} toSymbol2={toSymbol2} filterValue={filterValue} toFilter={toFilter} fix={fix} toFix={toFix} />

            <div className="row m-1">
                <div className="col row text-end flex-row-reverse">
                    <OrderBookSection title="Binance" orders={ordersBinance.bids && ordersBinance.bids.slice().reverse()} color={[0,128,0]} opacity={getOpacityClass} filterValue={filterValue} />
                    <OrderBookSection title="Bybit" orders={ordersByBit.bids && ordersByBit.bids.slice().reverse()} color={[0,128,0]} opacity={getOpacityClass} filterValue={filterValue} />
                    <OrderBookSection title="Coinbase" orders={ordersCoinbase.bids && ordersCoinbase.bids.slice().reverse()} color={[0,128,0]} opacity={getOpacityClass} filterValue={filterValue} />
                </div>
                <div className="col row">
                    <OrderBookSection title="Binance" orders={ordersBinance.asks} color={[128,0,0]} opacity={getOpacityClass} filterValue={filterValue} />
                    <OrderBookSection title="Bybit" orders={ordersByBit.asks} color={[128,0,0]} opacity={getOpacityClass} filterValue={filterValue} />
                    <OrderBookSection title="Coinbase" orders={ordersCoinbase.asks} color={[128,0,0]} opacity={getOpacityClass} filterValue={filterValue} />
                </div>
            </div>
        </div>
    );
};

export default Orders;
