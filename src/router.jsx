import {createBrowserRouter, Navigate} from "react-router-dom";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/Layouts/DefaultLayout.jsx";
import Orders from "./views/Orders.jsx";
import BinanceOrderBook from "./views/BinanceOrderBook.jsx";
import WebSocketComponent from "./components/WebSocketComponent.jsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children:[
            // {
            //     path: '/',
            //     element: <Orders/>
            // },
            {
                path: '/',
                element : <WebSocketComponent />,
                children:[
                    {
                        path: '/',
                        element : <BinanceOrderBook/>
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router;
