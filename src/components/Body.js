import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Body = () => {
	const [emails, setEmails] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [error, setError] = useState("");
	const [selectedEmail, setSelectedEmail] = useState(null);
	const userEmail = localStorage.getItem("email");

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
					setUnreadCount(0);
					return;
				}

				// Transform data into an array of emails with read status
				const receivedEmails = Object.keys(data).map((key) => ({
					id: key,
					...data[key],
				}));
				setEmails(receivedEmails);

				// Calculate unread count
				const unread = receivedEmails.filter((email) => !email.read).length;
				setUnreadCount(unread);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchReceivedEmails();
	}, [userEmail]);

	// Function to mark email as read
	const markAsRead = async (emailId) => {
		try {
			const emailToUpdate = emails.find((email) => email.id === emailId);
			if (!emailToUpdate || emailToUpdate.read) {
				return; // If email is already read or not found, do nothing
			}

			const sanitizeEmail = (email) => {
				return email.replace(/[.#$[\]]/g, "");
			};

			const response = await fetch(
				`https://mail-client-fcc2f-default-rtdb.firebaseio.com/received-emails/${sanitizeEmail(
					userEmail
				)}/${emailId}/read.json`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(true), // Setting read status to true
				}
			);
			if (!response.ok) {
				throw new Error("Failed to mark email as read.");
			}
			// Update the local state to mark email as read
			setEmails((prevEmails) =>
				prevEmails.map((email) =>
					email.id === emailId ? { ...email, read: true } : email
				)
			);

			// Update unread count
			setUnreadCount((prevCount) => prevCount - 1);
		} catch (error) {
			setError(error.message);
		}
	};

	// Function to delete email
	const deleteEmail = async (emailId) => {
		try {
            
			const sanitizeEmail = (email) => {
				return email.replace(/[.#$[\]]/g, "");
			};

			const response = await fetch(
				`https://mail-client-fcc2f-default-rtdb.firebaseio.com/received-emails/${sanitizeEmail(
					userEmail
				)}/${emailId}.json`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to delete email.");
			}
			// Remove the email from local state
			setEmails((prevEmails) =>
				prevEmails.filter((email) => email.id !== emailId)
			);
		} catch (error) {
			setError(error.message);
		}
	};

	// Function to handle click on an email to view full content
	const handleEmailClick = (emailId) => {
		setSelectedEmail(emailId);
		// Optionally mark the email as read when clicked
		markAsRead(emailId);
	};

	return (
		<div className="container mx-auto p-4">
			<Link to="/compose">
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">
					Compose Email
				</button>
			</Link>
			{error && <div className="text-red-500 mb-4">{error}</div>}
			<h2 className="text-2xl mb-4">Inbox ({unreadCount} unread)</h2>
			{emails.length > 0 ? (
				<ul>
					{emails.map((email) => (
						<li
							key={email.id}
							className={`border p-4 mb-2 rounded ${
								email.read ? "" : "bg-blue-200"
							}`}
						>
							{/* Blue dot indicator for unread emails */}
							{!email.read && (
								<span
									className="bg-blue-500 rounded-full h-3 w-3 absolute top-1 right-1"
									style={{ zIndex: 10 }}
								/>
							)}
							<h3 className="text-xl font-bold">{email.subject}</h3>
							<p className="text-gray-600 text-sm">From: {email.senderEmail}</p>
							{/* Displaying full content on click */}
							{selectedEmail === email.id && (
								<p className="text-gray-800 mt-2">
									{email.content &&
										email.content.blocks &&
										email.content.blocks[0] &&
										email.content.blocks[0].text}
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
				<p>{error ? "Error fetching emails." : "No emails found."}</p>
			)}
		</div>
	);
};

export default Body;
