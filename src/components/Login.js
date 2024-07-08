import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAJ7ISU_YD1cQXngrae81nfZy683an8_ls",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						password,
						returnSecureToken: true,
					}),
				}
			);

			const data = await response.json();

			if (data.error) {
				setError(data.error.message);
			} else {
				localStorage.setItem("token", data.idToken);
				onLoginSuccess();
			}
		} catch (error) {
			setError("Failed to login. Please try again later.");
		}

		setLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="email">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							required
						/>
					</div>
					<div className="mb-6">
						<label className="block text-gray-700 mb-2" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							required
						/>
					</div>
					<p className="text-center mt-4">
						Don't have an account?{" "}
						<Link to="/signup" className="text-indigo-600">
							Sign Up
						</Link>
					</p>
					<button
						type="submit"
						className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						disabled={loading || !email || !password}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
