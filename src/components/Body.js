import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Body = () => {
	const [emails, setEmails] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const userEmail = localStorage.getItem("userEmail"); // Assuming the user's email is stored in localStorage

	useEffect(() => {
		const fetchEmails = async () => {
			try {
				const response = await fetch(
					`https://your-firebase-api-url/emails/${userEmail}.json`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch emails.");
				}
				const data = await response.json();
				const fetchedEmails = [];
				for (const key in data) {
					fetchedEmails.push({
						id: key,
						...data[key],
					});
				}
				setEmails(fetchedEmails);
			} catch (error) {
				setError(error.message);
			}
		};

		if (userEmail) {
			fetchEmails();
		}
	}, [userEmail]);

	const handleCompose = () => {
		navigate("/compose");
	};

	return (
		<div className="container mx-auto p-4">
			<button
				onClick={handleCompose}
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
			>
				Compose Email
			</button>
			{error && <div className="text-red-500 mb-4">{error}</div>}
			<h2 className="text-2xl mb-4">Inbox</h2>
			{emails.length > 0 ? (
				<ul>
					{emails.map((email) => (
						<li key={email.id} className="border p-4 mb-2 rounded">
							<h3 className="text-xl font-bold">{email.subject}</h3>
							<p className="text-gray-700">To: {email.recipientEmail}</p>
							<div
								dangerouslySetInnerHTML={{ __html: email.content }}
								className="text-gray-800 mt-2"
							/>
							<p className="text-gray-600 text-sm mt-2">
								{new Date(email.timestamp).toLocaleString()}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p>No emails found.</p>
			)}
		</div>
	);
};

export default Body;
