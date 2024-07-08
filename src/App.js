import React from "react";
import ReactDOM from "react-dom/client";
import Signup from "./components/Signup";

const App = () => {
    return (
        <div>
            <Signup />
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);