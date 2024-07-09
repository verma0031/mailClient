import React from "react";
import Body from "./Body";

const Header = () => {
	return (
        <div>
		<header className="bg-indigo-600 p-4 text-white text-center">
			<h1>Welcome to Mail Client</h1>
		</header>

        <Body />

        </div>
	);
};

export default Header;
