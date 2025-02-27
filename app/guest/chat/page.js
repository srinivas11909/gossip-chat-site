"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Picker from "emoji-picker-react";
import axios from "axios";
import Cookies from "js-cookie"; // ✅ Import js-cookie

export default function Chat() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [gifUrl, setGifUrl] = useState("");
    const [canPlaySound, setCanPlaySound] = useState(false);


    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("chatUser"));
        if (!storedUser) {
            router.push("/");
            return;
        }
        setCurrentUser(storedUser);

        axios.post("/api/users", storedUser).then(() => {
            setTimeout(fetchUsers, 1000); // Delay fetch to ensure the user is stored
        });

        startInactivityTimer();
        loadMessagesFromCookies();
    }, []);

    // Fetch online users
    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("/api/users");
            const filteredUsers = data.filter(user => user.username !== currentUser?.username);
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, [currentUser]);


      // Load messages from cookies on page load
      const loadMessagesFromCookies = () => {
        const savedMessages = Cookies.get("chatMessages");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    };

    // Save messages in cookies after update
    useEffect(() => {
        if (messages.length > 0) {
            Cookies.set("chatMessages", JSON.stringify(messages), { expires: 1 }); // ✅ Messages persist for 1 day
        }
    }, [messages]);

    // Listen for new messages (Fix duplicate messages issue)
    useEffect(() => {
        const eventSource = new EventSource("/api/messages");
        eventSource.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prev) => {
                const updatedMessages = [...prev, newMessage];
                Cookies.set("chatMessages", JSON.stringify(updatedMessages), { expires: 1 }); // ✅ Store messages in cookies
                return updatedMessages;
            });

            // Play notification sound only for the receiver
            // if (newMessage.to === currentUser?.username && selectedUser?.username !== newMessage.from) {
            //     playNotificationSound();
            // }

           // setMessages((prev) => [...prev, newMessage]); 
        };
        return () => {
            eventSource.close();
        };
    }, [currentUser]);

    // Send message
    const sendMessage = async () => {
        if (!selectedUser || message.trim() === "") return;
        const newMessage = { from: currentUser.username, to: selectedUser.username, text: message, gif: gifUrl };

        await axios.post("/api/messages", newMessage);
        setMessages(prev => {
            const updatedMessages = [...prev, newMessage];
            Cookies.set("chatMessages", JSON.stringify(updatedMessages), { expires: 1 }); // ✅ Store messages in cookies
            return updatedMessages;
        });
        setMessage("");
        setMessage("");
        setGifUrl("");
    };

    // Auto logout if inactive for 5 mins
    const startInactivityTimer = () => {
        let timeout;
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                alert("You have been logged out due to inactivity.");
                handleLogout();
            }, 5 * 60 * 1000);
        };

        document.addEventListener("mousemove", resetTimer);
        document.addEventListener("keydown", resetTimer);
        document.addEventListener("click", resetTimer);
        document.addEventListener("touchstart", resetTimer);

        resetTimer();
    };

    // Logout user
    const handleLogout = async () => {
        await axios.delete("/api/users", { data: { username: currentUser.username } });
        sessionStorage.clear();
        router.push("/");
    };

    // Enable sound after user interaction
    useEffect(() => {
        const enableSound = () => setCanPlaySound(true);

        document.addEventListener("click", enableSound, { once: true });
        document.addEventListener("keypress", enableSound, { once: true });

        return () => {
            document.removeEventListener("click", enableSound);
            document.removeEventListener("keypress", enableSound);
        };
    }, []);

    // Play notification sound
    const playNotificationSound = () => {
        if (canPlaySound) {
            const audio = new Audio("/sounds/notifications.wav");
            console.log(audio)
            audio.play().catch(error => console.error("Error playing sound:", error));
        }
    };

    const fetchGif = async () => {
        const { data } = await axios.get("https://api.giphy.com/v1/gifs/random?api_key=YOUR_GIPHY_API_KEY");
        setGifUrl(data.data.images.fixed_height.url);
      };
    

    return (
        <div className="mt-[50px]">
            <div className="w-full flex h-screen">
                {/* Sidebar - Online Users */}
                <div className="w-1/4 bg-gray-100 p-4">
                    <h3 className="text-lg font-semibold">Online Users ({users.length})</h3>
                    {users.map(user => (
                        <div 
                            key={user.username} 
                            onClick={() => setSelectedUser(user)}
                            className={`cursor-pointer p-2 rounded ${selectedUser?.username === user.username ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                        >
                            {user.username} ({user.age}, {user.state}, {user.country})
                        </div>
                    ))}
                </div>

                {/* Chat Window */}
                <div className="w-3/4 flex flex-col border-l">
                    {!selectedUser ? (
                        <h2 className="p-4">Welcome to Gossip! Select a user to chat.</h2>
                    ) : (
                        <>
                            <div className="chat-header p-4 bg-blue-500 text-white font-semibold text-lg flex justify-between">
                                <h2>{selectedUser.username} ({selectedUser.age}, {selectedUser.country})</h2>
                                <button 
                                    onClick={handleLogout} 
                                    className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="chat-body flex-1 p-4 overflow-y-auto space-y-4">
                                {messages
                                    .filter(
                                        (msg) =>
                                            (msg.from === currentUser.username && msg.to === selectedUser.username) ||
                                            (msg.from === selectedUser.username && msg.to === currentUser.username)
                                    )
                                    .map((msg, index) => (
                                        <div key={index} className={`flex items-center ${msg.from === currentUser.username ? "justify-end" : "justify-start"}`}>
                                            {msg.from !== currentUser.username && (
                                                <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-black rounded-full text-lg font-bold mr-2">
                                                    {msg.from.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div
                                                className={`py-2 px-4 rounded-lg max-w-[60%] text-white text-sm ${
                                                    msg.from === currentUser.username
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                    : "bg-gray-300 text-black"
                                                }`}
                                            >
                                                {msg.text}
                                            </div>   
                                            {msg.from === currentUser.username && (
                                                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-bold ml-2">
                                                    {msg.from.charAt(0).toUpperCase()}
                                                </div>
                                            )}          
                                        </div>
                                    ))}
                            </div>

                            {/* Message Input */}
                            <div className="chat-footer p-4 border-t flex">
                                <input 
                                    type="text" 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    className="flex-1 p-2 border rounded-lg focus:outline-none" 
                                    placeholder="Type your message..."
                                />
                                <div className="relative">
                                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >😀</button>
                                        {showEmojiPicker && <div className="absolute bottom-12 left-0">
                                            <Picker onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)} /></div>}

                                </div>
                               
                    <button onClick={fetchGif} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >GIF</button>
                                <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                    Send
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
