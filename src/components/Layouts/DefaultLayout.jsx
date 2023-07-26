import { Link, Navigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import OrderBookHeader from '../OrderBookHeader.jsx';

export default function DefaultLayout() {
    const [symbol1, setSymbol1] = useState('BNB');
    const [symbol2, setSymbol2] = useState('USDT');
    const [round, setRound] = useState(0.1);
    const [filterValue, setFilterValue] = useState(1000000);
    useEffect(() =>{
        console.log(symbol1,symbol2,"f")
    },[symbol1, symbol2])
    const toSymbol1 = ev => {
        ev.preventDefault();
        setSymbol1(ev.target.value);
    };
    const toSymbol2 = ev => {
        ev.preventDefault();
        setSymbol2(ev.target.value);
    };

    const toFilter = ev => {
        ev.preventDefault();
        setFilterValue(ev.target.value);
    };

    const toRound = ev => {
        ev.preventDefault();
        setRound(ev.target.value);
    };

    return (
        <div className="bg-dark text-light">
            <div className="content">
                <header>
                    <h1>Orders</h1>
                    <OrderBookHeader symbol1={symbol1} toSymbol1={toSymbol1}
                                     symbol2={symbol2} toSymbol2={toSymbol2}
                                     ilterValue={filterValue} toFilter={toFilter}
                                     round={round} toRound={toRound} />
                </header>
                <main>
                    <Outlet context={{ symbol1, symbol2, filterValue, round }} />
                </main>
            </div>
        </div>
    )
}
