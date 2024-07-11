import { useState } from "react";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/authContextProvider";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { authUser } = useAuthContext();
	const sendMessage = async (data) => {
		const message = {
			data,
			url:authUser?.profilePhoto?.url
		}
		setLoading(true);
		try {
			const res = await fetch(`/api/message/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(message),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
