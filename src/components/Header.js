import React from "react";
import Body from "./Body";

const Header = ({ onLogout }) => {
	return (
		<div>
			<header className="bg-indigo-600 p-4 text-white text-center">
				<h1>Welcome to Mail Client</h1>
				<button
					onClick={onLogout}
					className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
				>
					Logout
				</button>
			</header>
			<Body />
		</div>
	);
};

export default Header;
