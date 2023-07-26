import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {Outlet, useOutletContext} from "react-router-dom";
import OrderBookSection from "../components/OrderBookSection.jsx";
import TradeViewChart from '@dreygur/react-crypto-chart';



const BinanceOrdersBook = () => {
    const [ordersBinance, setOrdersBinance] = useState([]);
    const prevSymbol1 = useRef(null);
    const prevSymbol2 = useRef(null);
    const { bidsData, asksData, symbol1, symbol2, filterValue, round } = useOutletContext();
    const [bids, setBids] = useState([]);
    const [asks, setAsks] = useState([]);

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
                setOrdersBinance({ bids: data.bids, asks: data.asks });
                setAsks(data.asks);
                setBids(data.asks);

            } catch (error) {
                console.error('Error fetching orders from Binance:', error);
            }
        };
        if (prevSymbol1.current !== symbol1 || prevSymbol2.current !== symbol2) {
            prevSymbol1.current = symbol1;
            prevSymbol2.current = symbol2;
            console.log('New symbols', symbol1, symbol2)
            fetchOrders();
        }

        fetchOrders();
        fetchOrders();
    }, [symbol1,symbol2]);

    useEffect(() => {
        const updateBook = (bidsData, asksData, ordersBinance) => {
            if(ordersBinance !== []){
                let updatedBids = bidsData;
                let updatedAsks = asksData;

                for (const bids of ordersBinance.bids) {
                    if (!asksData.find((item) => item[0] === bids[0]) && !bidsData.find((item) => item[0] === bids[0])) {
                        updatedBids.push(bids);
                    }
                }

                for (const asks of ordersBinance.asks) {
                    if (!bidsData.find((item) => item[0] === asks[0]) && !asksData.find((item) => item[0] === asks[0])) {
                        updatedAsks.push(asks);
                    }
                }


                setOrdersBinance({
                    bids: updatedBids,
                    asks: updatedAsks,
                });

                const roundPrice = (price, roundTo) => {
                    if (roundTo < 1) {
                        return ((Math.floor(price / roundTo) * roundTo)).toFixed(2);
                    } else if (roundTo >= 1) {
                        if (price % roundTo === 0) {
                            return parseFloat(price).toFixed(2); // If the price is already divisible by roundTo, no need to add decimal part
                        } else {
                            return (Math.floor(price / roundTo) * roundTo).toFixed(2);
                        }
                    }
                    return price; // Return the original price if roundTo value is not recognized
                };

                // Function to convert string quantity to a numeric value
                const parseQuantity = (quantity) => {
                    return parseFloat(quantity);
                };



                // Fix for handling bids data
                const bids = updatedBids
                    .map((bid) => [roundPrice(bid[0],round), parseQuantity(bid[1])])
                    .reduce((accumulator, bid) => {
                        const [price, quantity] = bid;
                        accumulator[price] = (accumulator[price] || 0) + quantity;
                        return accumulator;
                    }, {});

                // Fix for handling asks data
                const asks = updatedAsks
                    .map((ask) => [roundPrice(ask[0],round), parseQuantity(ask[1])])
                    .reduce((accumulator, ask) => {
                        const [price, quantity] = ask;
                        accumulator[price] = (accumulator[price] || 0) + quantity;
                        return accumulator;
                    }, {});

                // Assuming you have some functions like setBids and setAsks to update the bids and asks data in your application
                setBids(Object.entries(bids)
                    .map(([price, quantity]) => [parseFloat(price), quantity])
                    .sort((a, b) => b[0] - a[0]));
                setAsks(Object.entries(asks)
                    .map(([price, quantity]) => [parseFloat(price), quantity])
                    .sort((a, b) => a[0] - b[0]));
            }
        };
        // Timer to update the ordersBinance state every 1 second
        const timer = setInterval(() => {
            updateBook(bidsData, asksData,ordersBinance);
        }, 500);

        // Cleanup function to clear the timer when the component unmounts
        return () => {
            clearInterval(timer);
        };
    }, [bidsData, asksData,ordersBinance]);

    const getOpacityClass = (price, quantity, filter) => {
        let index = ((price * quantity) / filter);
        if (index > 1) index = 1;
        else if (index < 0.1) index = 0.1;
        return index;
    };


    return (
        <div className="row ">
            <div className="row col-md-3 parent">
                <div className="col row text-end flex-row-reverse">
                    <OrderBookSection title="Binance" orders={bids} color={[0,128,0]} opacity={getOpacityClass} filterValue={filterValue} />
                </div>
                <div className="col row">
                    <OrderBookSection title="Binance" orders={asks} color={[128,0,0]} opacity={getOpacityClass} filterValue={filterValue} />
                </div>
            </div>
            <div className="row col-md-9 chartContainer">
                <div className="parent">
                    <TradeViewChart
                        interval="1d"
                        containerStyle={{
                            minHeight: "100%",
                            minWidth: "100%",
                            marginBottom: "30px"
                        }}
                        chartLayout={{
                            layout: {
                                backgroundColor: "black",
                                textColor: "white"
                            },
                            grid: {
                                vertLines: {
                                    color: "black"
                                    // style: LineStyle.SparseDotted,
                                },
                                horzLines: {
                                    color: "black"
                                    // style: LineStyle.SparseDotted,
                                }
                            },
                            priceScale: {
                                borderColor: "#485c7b"
                            },
                            timeScale: {
                                borderColor: "#485c7b",
                                timeVisible: true,
                                secondsVisible: false
                            }
                        }}
                        candleStickConfig={{
                            upColor: "green",
                            downColor: "red",
                            borderDownColor: "transparent",
                            borderUpColor: "transparent",
                            wickDownColor: "gray",
                            wickUpColor: "gray"
                        }}
                        pair={symbol1 + symbol2}
                    />
                </div>
            </div>
        </div>
    );
};

export default BinanceOrdersBook;
