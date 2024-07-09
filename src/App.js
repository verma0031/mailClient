import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Header from "./components/Header";
import EmailEditor from "./components/EmailEditor";
import Sent from "./components/Sent";

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	const handleLoginSuccess = () => {
		setIsAuthenticated(true);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("email");
		setIsAuthenticated(false);
	};

	return (
		<Router>
			<Routes>
				<Route path="/signup" element={<Signup />} />
				<Route
					path="/login"
					element={
						isAuthenticated ? (
							<Navigate to="/" />
						) : (
							<Login onLoginSuccess={handleLoginSuccess} />
						)
					}
				/>
				<Route
					path="/"
					element={
						isAuthenticated ? (
							<Header onLogout={handleLogout} />
						) : (
							<Navigate to="/login" />
						)
					}
				/>
				<Route
					path="/compose"
					element={
						isAuthenticated ? (
							<EmailEditor onSendEmail={() => console.log("Email sent")} />
						) : (
							<Navigate to="/login" />
						)
					}
				/>
                <Route path="/sent" element={<Sent />} />
				<Route path="*" element={<Navigate to="/signup" />} />
			</Routes>
		</Router>
	);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
