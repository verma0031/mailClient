// Sent.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const Sent = () => {
	const [emails, setEmails] = useState([]);
	const [error, setError] = useState("");
	const userEmail = localStorage.getItem("email");

	useEffect(() => {
		const fetchSentEmails = async () => {
			if (!userEmail) {
				setError("User email not found.");
				return;
			}

			const sanitizeEmail = (email) => {
				return email.replace(/[.#$[\]]/g, "");
			};

			try {
				const response = await fetch(
					`https://mail-client-fcc2f-default-rtdb.firebaseio.com/sent-emails/${sanitizeEmail(
						userEmail
					)}.json`
				);
				if (!response.ok) {
					throw new Error(
						`Failed to fetch sent emails: ${response.status} ${response.statusText}`
					);
				}
				const data = await response.json();

				if (!data) {
					setEmails([]);
					return;
				}

				// Transform data into an array of emails
				const sentEmails = Object.keys(data).map((key) => ({
					id: key,
					...data[key],
					read: true, // Assume all sent emails are read
				}));
				setEmails(sentEmails);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchSentEmails();
	}, [userEmail]);

	// Function to delete email
	const deleteEmail = async (emailId) => {
		try {
			const sanitizeEmail = (email) => {
				return email.replace(/[.#$[\]]/g, "");
			};

			const response = await fetch(
				`https://mail-client-fcc2f-default-rtdb.firebaseio.com/sent-emails/${sanitizeEmail(
					senderEmail
				)}.json`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to delete email.");
			}
			// Update state to remove the deleted email
			setEmails((prevEmails) =>
				prevEmails.filter((email) => email.id !== emailId)
			);
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<Link to="/compose">
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">
					Compose Email
				</button>
			</Link>
			{error && <div className="text-red-500 mb-4">{error}</div>}
			<h2 className="text-2xl mb-4">Sent Emails</h2>
			{emails.length > 0 ? (
				<ul>
					{emails.map((email) => (
						<li
							key={email.id}
							className={`border p-4 mb-2 rounded`}
							style={{ cursor: "pointer" }}
						>
							<h3 className="text-xl font-bold">{email.subject}</h3>
							<p className="text-gray-600 text-sm">
								To: {email.recipientEmail}
							</p>
							{/* Displaying full content on click */}
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
							{/* Delete button */}
							<button
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
								onClick={() => deleteEmail(email.id)}
							>
								Delete
							</button>
						</li>
					))}
				</ul>
			) : (
				<p>{error ? "Error fetching sent emails." : "No sent emails found."}</p>
			)}
		</div>
	);
};

export default Sent;
