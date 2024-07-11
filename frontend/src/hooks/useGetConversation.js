import { useEffect, useState } from "react";
import axios from "axios";

const useGetConversation = () => {
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  useEffect(() => {
    const getConversation = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/users/");
        if (res.status !== 200) return;
        setConversation(res.data);
      } catch (error) {
        return error;
      } finally {
        setLoading(false);
      }
    };
    getConversation();
  }, []);
  return { loading, conversation };
};
export default useGetConversation;
