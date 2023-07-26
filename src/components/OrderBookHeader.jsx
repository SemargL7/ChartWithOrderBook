import React from "react";

const OrderBookHeader = ({ symbol1, toSymbol1, symbol2, toSymbol2, filterValue, toFilter, round, toRound }) => {
    return (
        <aside className="container row">
            <form className="col-md-2 row form-floating m-1">
                <input
                    onChange={toSymbol1}
                    type="text"
                    name="symbol1"
                    id="symbol1"
                    value={symbol1}
                    className="form-control col pb-2"

                />
                <label htmlFor="symbol1" className="form-label w-100">Symbol1</label>
            </form>
            <form className="col-md-2 row form-floating m-1">
                <input
                    onChange={toSymbol2}
                    type="text"
                    name="symbol2"
                    id="symbol2"
                    value={symbol2}
                    className="form-control col pb-2"
                />
                <label htmlFor="symbol2" className="form-label w-100">Symbol2</label>
            </form>
            <form className="col-md-2 row form-floating m-1">
                <input
                    onChange={toFilter}
                    type="number"
                    name="filterValue"
                    id="filterValue"
                    value={filterValue}
                    className="form-control col pb-2"
                />
                <label htmlFor="filterValue" className="form-label">Value</label>
            </form>
            <form className="col-md-2 row form-floating m-1">
                <input
                    onChange={toRound}
                    type="number"
                    name="round"
                    id="round"
                    value={round}
                    className="form-control col pb-2"
                    min={0}
                />
                <label htmlFor="fix" className="form-label w-100">Fix</label>
            </form>
        </aside>
    );
};
export default OrderBookHeader;
