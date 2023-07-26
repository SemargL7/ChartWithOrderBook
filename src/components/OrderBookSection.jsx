import React from "react";

const OrderBookRow = ({ order, color }) => {
    return (
        <div style={{ backgroundColor: `${color}` }}>
            <span style={{ opacity: 1 }}>{order[0]}: {order[1]}</span>
        </div>
    );
};

const OrderBookSection = ({ title, orders, color, opacity, filterValue }) => {
    return (
        <div className="col border border-bottom-0 border-top-0 p-0">
            {title}
            {orders &&
                orders.map((order, index) => (
                    <OrderBookRow key={index} order={order} color={'rgba('+ color + ', '+ opacity(parseFloat(order[0]), parseFloat(order[1]), filterValue) + ')'} />
                ))}
        </div>
    );
};

export default OrderBookSection;
