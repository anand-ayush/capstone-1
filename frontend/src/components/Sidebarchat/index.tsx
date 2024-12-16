import { useState, useEffect } from "react";
import axios from "axios";

type Chat = {
  id: string;
  user2Id: string;
  user1Name: string;
  hasNewMessage:boolean;
};

interface SidebarProps {
  onSelectChat: (chatId: string,name:string) => void;
}

let user = {};

if (typeof window !== "undefined" && localStorage.getItem("user")) {
  user = JSON.parse(localStorage.getItem("user") || "{}");
}

const Sidebar = ({ onSelectChat }: SidebarProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="));
        
        if (!token) {
          console.error("Authentication token not found.");
          return;
        }

        const tokenValue = token.split("=")[1];
        
        const res = await axios.get(
          "http://localhost:3000/api/v1/chat/my-chats",
          {
            headers: { Authorization: `Bearer ${tokenValue}` },
          }
        );

        
        setChats(res.data.chats);
      } catch (error) {
        console.error("Error fetching chats", error);
      }
    };

    fetchChats();
  }, []);

  
  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    //@ts-ignore
    if (chat.user1Id === user.id) {
       //@ts-ignore
      return chat.user2Name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    else{
      return chat.user1Name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
   
  });

  console.log(filteredChats)


  

  return (
    <div className="h-3/4 bg-gray-700 dark:bg-gray-900 p-4 text-gray-100 dark:text-gray-100 w-1/4 shadow-lg">
      <h1 className="text-lg font-bold mb-4">Chats</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search chats..."
        className="border rounded-md p-2 mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* List of Chats */}
      <div className="space-y-2">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id} // Ensure `key` is unique
              className="cursor-pointer p-2 hover:bg-gray-600 dark:hover:bg-gray-500 rounded"
              onClick={() => {
                console.log("Chat clicked:", chat.id); // Debugging
                //@ts-ignore
                onSelectChat(chat.id,user.fullname === chat.user1Name ? chat.user2Name : chat.user1Name);
                
                
              }}
            >
              {/* @ts-ignore */}
              {user.fullname === chat.user1Name ? chat.user2Name : chat.user1Name}

              {chat.hasNewMessage && (
                <span className="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
              )}

            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400">No chats found</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
