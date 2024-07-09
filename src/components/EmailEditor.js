import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EmailEditor = ({ onSendEmail }) => {
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const [recipientEmail, setRecipientEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [error, setError] = useState("");

	const handleSendEmail = async () => {
		if (
			!recipientEmail ||
			!subject ||
			editorState.getCurrentContent().getPlainText().trim() === ""
		) {
			setError("All fields are required.");
			return;
		}

		const content = JSON.stringify(
			convertToRaw(editorState.getCurrentContent())
		);

		const emailData = {
			recipientEmail,
			subject,
			content,
			senderEmail: localStorage.getItem("userEmail"), // Assuming the user's email is stored in localStorage
			timestamp: new Date().toISOString(),
		};

		try {
			const response = await fetch(
				"https://your-firebase-api-url/emails.json",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(emailData),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to send email.");
			}

			onSendEmail(); // Callback function to handle post-send actions
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl mb-4">Compose Email</h2>
			<div className="mb-4">
				<label
					className="block text-gray-700 text-sm font-bold mb-2"
					htmlFor="recipientEmail"
				>
					To:
				</label>
				<input
					type="email"
					id="recipientEmail"
					value={recipientEmail}
					onChange={(e) => setRecipientEmail(e.target.value)}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div className="mb-4">
				<label
					className="block text-gray-700 text-sm font-bold mb-2"
					htmlFor="subject"
				>
					Subject:
				</label>
				<input
					type="text"
					id="subject"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div className="mb-4">
				<label
					className="block text-gray-700 text-sm font-bold mb-2"
					htmlFor="editor"
				>
					Message:
				</label>
				<Editor
					editorState={editorState}
					wrapperClassName="demo-wrapper"
					editorClassName="demo-editor"
					onEditorStateChange={setEditorState}
				/>
			</div>
			{error && <div className="text-red-500 mb-4">{error}</div>}
			<button
				onClick={handleSendEmail}
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			>
				Send
			</button>
		</div>
	);
};

export default EmailEditor;
