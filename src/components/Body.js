import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Body = () => {
	const [emails, setEmails] = useState([]);
	const [error, setError] = useState("");
	const userEmail = localStorage.getItem("email");

	console.log("User email from body", userEmail);

	// Function to sanitize email for use in Firebase path
	const sanitizeEmail = (email) => {
		return email.replace(/[.#$[\]]/g, "");
	};

	useEffect(() => {
		const fetchReceivedEmails = async () => {
			if (!userEmail) {
				setError("User email not found.");
				return;
			}

			const sanitizeEmail = (email) => {
				return email.replace(/[.#$[\]]/g, "");
			};

			try {
				const response = await fetch(
					`https://mail-client-fcc2f-default-rtdb.firebaseio.com/received-emails/${sanitizeEmail(
						userEmail
					)}.json`
				);
				if (!response.ok) {
					throw new Error(
						`Failed to fetch emails: ${response.status} ${response.statusText}`
					);
				}
				const data = await response.json();

				if (!data) {
					setEmails([]);
					return;
				}

				// Transform data into an array of emails
				const receivedEmails = Object.keys(data).map((key) => ({
					id: key,
					subject: data[key].subject,
					content: data[key].content,
					senderEmail: data[key].senderEmail,
					timestamp: data[key].timestamp,
				}));

				setEmails(receivedEmails);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchReceivedEmails();
	}, [userEmail]);

	return (
		<div className="container mx-auto p-4">
			<Link to="/compose">
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">
					Compose Email
				</button>
			</Link>
			{error && <div className="text-red-500 mb-4">{error}</div>}
			<h2 className="text-2xl mb-4">Inbox</h2>
			{emails.length > 0 ? (
				<ul>
					{emails.map((email) => (
						<li key={email.id} className="border p-4 mb-2 rounded">
							<h3 className="text-xl font-bold">{email.subject}</h3>
							<p className="text-gray-600 text-sm">From: {email.senderEmail}</p>
							{email.content &&
								email.content.blocks &&
								email.content.blocks[0] && (
									<p className="text-gray-800 mt-2">
										{email.content.blocks[0].text}
									</p>
								)}
							<p className="text-gray-600 text-sm mt-2">
								{new Date(email.timestamp).toLocaleString()}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p>{error ? "Error fetching emails." : "No emails found."}</p>
			)}
		</div>
	);
};

export default Body;
