import React from "react";
import ReactDOM from "react-dom/client";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Header from "./components/Header";
import EmailEditor from "./components/EmailEditor";
import { useState } from "react";

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const handleLoginSuccess = () => {
		setIsAuthenticated(true);
	};

	return (
		<Router>
			<div>
				{isAuthenticated ? (
					<Header />
				) : (
					<Routes>
						<Route path="/signup" element={<Signup />} />
						<Route
							path="/login"
							element={<Login onLoginSuccess={handleLoginSuccess} />}
						/>
						<Route path="*" element={<Navigate to="/signup" />} />

						<Route
							path="/compose"
							element={
								<EmailEditor
									onSendEmail={() => alert("Email sent successfully!")}
								/>
							}
						/>
					</Routes>
				)}
			</div>
		</Router>
	);
};


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);