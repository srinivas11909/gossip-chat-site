"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Picker from "emoji-picker-react";
import axios from "axios";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie"; // ✅ Import js-cookie
//import Flag from "react-world-flags";
import WelcomeMsg from "@/app/components/shared/WelcomeMsg";
import styles from "./Chat.module.css"

import Image from 'next/image';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;


export default function Chat() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState({});
    const [gifResults, setGifResults] = useState([]); // ✅ Store GIF results
    const [gifSearch, setGifSearch] = useState(""); // ✅ Store GIF search query
    const [canPlaySound, setCanPlaySound] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false); 
    const chatEndRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const gifPickerRef = useRef(null);
    const [showGifPicker, setShowGifPicker] = useState(false);


       // Detect screen size for mobile view
       useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileView(window.innerWidth <= 768); // ✅ Mobile if ≤ 768px
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

   //Fetch and verify users
    useEffect(() => {
        const verifyUser = async () => {
            const encryptedUser = Cookies.get("chatUser");

            if (!encryptedUser) {
                console.warn("❌ No user found, redirecting...");
                router.replace("/"); // ✅ Redirect to login if not logged in
                return;
            }

            try {
                const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
                const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                if (!decryptedData?.username) throw new Error("Invalid user data");

                setCurrentUser(decryptedData);
                //await axios.post("/api/users", decryptedData);
                
                //fetchUsers(decryptedData); // ✅ Fetch users **after** setting currentUser
                //setTimeout(fetchUsers, 2000); 
                loadMessagesFromCookies();
                //startInactivityTimer();
            } catch (error) {
                console.error("Error decrypting user data:", error);
                Cookies.remove("chatUser");
                Cookies.set("checkedLogin", "false")
                router.replace("/");
            }
        };

        verifyUser();
    }, []);


    const fetchUsers = async (user) => {
        if (!user) return;
        let retries = 3;
        while (retries > 0) {
            try {
                const { data } = await axios.get(`/api/users?nocache=${Date.now()}`);
                let filteredUsers = data.filter(u => u.username !== user.username);  
                // ✅ Show recent users first by reversing the array
                filteredUsers = filteredUsers.reverse();
                if (filteredUsers.length > 0) {
                    setUsers(filteredUsers);
                    return;
                }
                //setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
            retries -= 1;
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    };
    
    //load messages from cookies
    const loadMessagesFromCookies = () => {
        const encryptedMessages = Cookies.get("chatMessages");
        if (encryptedMessages) {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedMessages, SECRET_KEY);
                const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

                if (!decryptedText) throw new Error("Decryption failed");
        
                setMessages(JSON.parse(decryptedText));
            } catch (error) {
                console.error("Error decrypting messages:", error);
            }
        }
    };


 

    useEffect(() => {
        if (!currentUser) return; 
       // const fetchUsersInterval = async () => { await
             fetchUsers(currentUser); 
        //};
        //fetchUsersInterval(); 
        const interval = setInterval(() => fetchUsers(currentUser), 5000); 
        return () => clearInterval(interval); 
    }, [currentUser]); 
    
    // Save messages in cookies after update
    useEffect(() => {
        if (messages.length > 0) {
            const encryptedMessages = CryptoJS.AES.encrypt(JSON.stringify(messages), SECRET_KEY).toString();
            Cookies.set("chatMessages", encryptedMessages, { expires: 1, secure: true, sameSite: "Strict" });
        }
    }, [messages]);

    // Listen for new messages 
    useEffect(() => {
        if (!currentUser) return; // Ensure user is set

        const eventSource = new EventSource("/api/messages");
    
        eventSource.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMessage];
                Cookies.set("chatMessages", JSON.stringify(updatedMessages), { expires: 1 });
                return updatedMessages;
            });
            if (newMessage.to === currentUser.username && selectedUser?.username !== newMessage.from) {
                if (canPlaySound) {
                    playNotificationSound();
                }
    
                setUnreadMessages((prev) => ({
                    ...prev,
                    [newMessage.from]: (prev[newMessage.from] || 0) + 1,
                }));
            }
            // setMessages((prev) => {
            //     const updatedMessages = [...prev, newMessage];
            //     Cookies.set("chatMessages", JSON.stringify(updatedMessages), { expires: 1 });
    
            //     if (newMessage.to === currentUser?.username && selectedUser?.username !== newMessage.from) {
            //         console.log("📢 Checking canPlaySound:", canPlaySound);
    
            //         if (canPlaySound) {
            //             console.log("🎵 Playing notification sound...");
            //             playNotificationSound();
            //         } else {
            //             console.warn("⚠️ Sound is disabled! Waiting for user interaction.");
            //         }
    
            //         setUnreadMessages((prev) => ({
            //             ...prev,
            //             [newMessage.from]: (prev[newMessage.from] || 0) + 1
            //         }));
            //     }
            //     return updatedMessages;
            // });
        };
    
        return () => {
            eventSource.close();
        };
    }, [currentUser, selectedUser,canPlaySound]);  // ✅ Added `canPlaySound` as a dependency
    
    // Send message

    // const sendMessage = async (gifUrl=null) => {
    //     alert("sds")
    //     alert(gifUrl)
    //     if (!selectedUser || message.trim() === "") return;
    
    //     const newMessage = {
    //         from: currentUser.username,
    //         to: selectedUser.username,
    //         text: gifUrl ? "" : message,
    //         gif: gifUrl || "",
    //     };
    
    //     try {
    //         await axios.post("/api/messages", newMessage);
    
    //         // ✅ Load existing messages from cookies
    //         const encryptedMessages = Cookies.get("chatMessages");
    //         let savedMessages = encryptedMessages 
    //             ? JSON.parse(CryptoJS.AES.decrypt(encryptedMessages, SECRET_KEY).toString(CryptoJS.enc.Utf8))
    //             : [];
    
    //         // ✅ Only save messages the user RECEIVED, not their own sent ones
    //         if (newMessage.to === currentUser.username) {
    //             savedMessages.push(newMessage);
    //             const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(savedMessages), SECRET_KEY).toString();
    //             Cookies.set("chatMessages", encryptedData, { expires: 1, secure: true, sameSite: "Strict" });
    //         }
    
    //         // ✅ Clear input fields
    //         setMessage("");
    //         setShowEmojiPicker(false)
    //     } catch (error) {
    //         console.error("Error sending message:", error);
    //     }
    // };

    const sendMessage = async (content = "") => {
        if (!selectedUser || (!message.trim() && !content.trim())) return;
        if (!currentUser) {
            console.error("⛔ Error: currentUser is undefined, message not sent!");
            return;
        }
    
        const newMessage = {
            from: currentUser.username,
            to: selectedUser.username,
            text: content || message,  // ✅ If sending a GIF, use content
            gif: content.includes("giphy.com") ? content : "",  // ✅ Detect if it's a GIF
        };
    
        try {
            await axios.post("/api/messages", newMessage);
    
            // ✅ Load existing messages safely
            let savedMessages = [];
    
            try {
                const encryptedMessages = Cookies.get("chatMessages");
    
                if (encryptedMessages) {
                    const bytes = CryptoJS.AES.decrypt(encryptedMessages, SECRET_KEY);
                    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
                    if (!decryptedText) throw new Error("Decryption failed");
    
                    savedMessages = JSON.parse(decryptedText);
                }
            } catch (error) {
                console.error("Error decrypting chat messages:", error);
                Cookies.remove("chatMessages"); // Remove corrupted messages
            }
    
            // ✅ Save new messages back to cookies
            savedMessages.push(newMessage);
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(savedMessages), SECRET_KEY).toString();
            Cookies.set("chatMessages", encryptedData, { expires: 1, secure: true, sameSite: "Strict" });
    
            setMessage(""); // ✅ Clear input
            setShowEmojiPicker(false)
            setShowGifPicker(false)

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    
    

    // Auto logout if inactive for 5 mins
    const startInactivityTimer = () => {
        let timeout;
    
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                alert("You have been logged out due to inactivity.");
                handleLogout();
            }, 5 * 60 * 1000); // ✅ 5-minute timeout
        };
    
        // ✅ Run only if `currentUser` is set
        if (!currentUser) return;
    
        // ✅ Remove previous event listeners to prevent duplicate calls
        document.removeEventListener("mousemove", resetTimer);
        document.removeEventListener("keydown", resetTimer);
        document.removeEventListener("click", resetTimer);
        document.removeEventListener("touchstart", resetTimer);
    
        // ✅ Add new listeners
        document.addEventListener("mousemove", resetTimer);
        document.addEventListener("keydown", resetTimer);
        document.addEventListener("click", resetTimer);
        document.addEventListener("touchstart", resetTimer);
    
        resetTimer();
    };
    
    // ✅ Call only AFTER setting `currentUser`
    useEffect(() => {
        if (currentUser) {

            startInactivityTimer();
        }
    }, [currentUser]); // ✅ Run only when `currentUser` changes
    

    // Logout user
    const handleLogout = async () => {
        await axios.delete("/api/users", { data: { username: currentUser.username } });
          // ✅ Remove cookies properly
        Cookies.remove("chatUser", { path: "/" });
        Cookies.remove("chatMessages", { path: "/" });

        setCurrentUser(null); // Clear user state
        router.push("/");
    };

    // Enable sound after user interaction
    useEffect(() => {
        console.log("🔊 Sound enabling useEffect ran!");

        const enableSound = () => {
            setCanPlaySound(true);
            console.log("✅ User interacted - Sound is now enabled!");
        };
        document.addEventListener("click", enableSound, { once: true });
        document.addEventListener("keypress", enableSound, { once: true });

        return () => {
            document.removeEventListener("click", enableSound);
            document.removeEventListener("keypress", enableSound);
        };
    }, []);

    // Play notification sound
    const playNotificationSound = () => {
        console.log("🔔 Trying to play sound. CanPlaySound state:", canPlaySound);

        if (canPlaySound) {
            const audio = new Audio("/sounds/notifications.wav");
            console.log(audio)
            audio.play().then(() => {
                console.log("Notification sound played");
            }).catch(error => {
                console.error("Error playing sound:", error);
            });
            //audio.play().catch(error => console.error("Error playing sound:", error));
        }else{
            console.warn("sound is disabled")
        }
    };


      const fetchGif = async () => {
        if (!gifSearch) return;
        try {
            const { data } = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${gifSearch}&limit=6`);
            setGifResults(data.data);
        } catch (error) {
            console.error("Error fetching GIFs:", error);
        }
    };
    useEffect(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]); 

          // Close emoji picker when clicking outside
          useEffect(() => {
            const handleClickOutside = (event) => {
                if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                    setShowEmojiPicker(false);
                }
            };
    
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);


        useEffect(() => {
            const handleClickOutside = (event) => {
                if (gifPickerRef.current && !gifPickerRef.current.contains(event.target)) {
                    setShowGifPicker(false);
                }
            };
    
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

    return (
        <div className="mt-[50px]">
            <div className="w-full flex h-screen">
                {/*sidebar or userslist*/}

                <div className={`p-4 bg-white border-r md:w-1/4 w-full md:relative absolute ${selectedUser ? "hidden md:flex" : "flex"} flex-col h-screen`}>
                <h3 className="text-lg font-semibold text-zinc-800 p-4 border-b text-uppercase">Online Users {users.length}</h3>
                <div className="overflow-y-auto flex-1">
                    {users.map(user => (
                        <div 
                            key={user.username} 
                            onClick={() => {
                                setSelectedUser(user);
                                setUnreadMessages(prev => {
                                    const updatedUnread = { ...prev };
                                    updatedUnread[user.username] = 0;
                                    return updatedUnread;
                                });
                            }}
                            
                            className={`cursor-pointer p-3 relative flex items-center gap-3 border-b-[1px] border-white hover:opacity-80 transition ${
                                user.gender === "Male" ? "bg-blue-200" : "bg-pink-200"
                            }`}
                        >
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-lg ${
                                user.gender === "Male" ? "bg-white text-white" : "bg-white text-white"
                            }`}>
                                {/* {{user.username.charAt(0).toUpperCase()}} */}
                               
                            <Image className="rounded-full" src={user.gender === "Male" ? "/images/male.png": "/images/female.png"} alt="gender" height={24} width={24} priority />

                            </div>
                            <div className={`flex flex-col ${styles.userTextWrapper}`}>
                                <div className="">
                                   <p className="text-base text-zinc-800 font-semibold truncate w-full overflow-hidden text-ellipsis whitespace-nowrap">{user.username}</p>
                                   <p className="text-xs text-gray-700">{user.age} yrs, {user.stateName}, {user.countryName}</p>
                                     {/* 🔴 Show unread message count if > 0 */}
                                        {unreadMessages[user.username] > 0 && (
                                            <span className="absolute right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full" style={{marginTop: "-15px", top: "50%"}}>
                                                {unreadMessages[user.username]}
                                            </span>
                                        )}
                                         <img 
                                            // src={`https://flagcdn.com/w40/${user.country.toLowerCase()}.png`} 
                                            src={`https://cdn.ipwhois.io/flags/${user.country.toLowerCase()}.svg`}
                                            alt={`${user.country} Flag`} 
                                            className="w-6 absolute"
                                            style={{marginTop: "-8px",right: "20px", top:"50%"}}
                                        />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleLogout} className="p-3 bg-red-500 text-white rounded-md w-full mt-3">Logout</button>
            </div>

                {/* Chat Window */}
                <div className={`flex flex-col border-l bg-white md:w-[560px] w-full h-full absolute md:relative transition-all duration-300 
    ${selectedUser ? 'block' : 'hidden md:flex'}`}>                    {!selectedUser  && (
                        <WelcomeMsg currentUser={currentUser} />

                    )}
                    {selectedUser && (
                        <>
                        <div className="flex items-center border p-3 text-white bg-gradient-to-r from-pink-500 to-rose-400">
                            <button onClick={() => setSelectedUser(null)} className="mr-4 md:hidden">
                               Back
                            </button>
                            <div className="flex flex-row items-center">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-lg ${
                                    selectedUser.gender === "Male" ? "bg-white text-white" : "bg-white text-white"
                                }`}>
                                    {/* {{user.username.charAt(0).toUpperCase()}} */}
                                
                                <Image src={selectedUser.gender === "Male" ? "/images/male.png": "/images/female.png"} alt="gender" height={24} width={24} priority />

                                </div>
                                <div className="px-2">
                                  <h2 className="text-lg font-semibold">{selectedUser.username} </h2>
                                  <p className="text-xs text-white"> {selectedUser.gender}, {selectedUser.age  +' '+ 'yrs'}, {selectedUser.stateName} {selectedUser.countryName}</p>
                                </div>
                           </div>
                         </div>
                     {/* Chat Messages */}
                         <div className="flex-1 p-4 overflow-y-auto bg-gray-100 border-r" data-user-name={currentUser?.username}>
                                {messages
                                    .filter(
                                        (msg) =>
                                        
                                            //if (!currentUser || !selectedUser) return false; // ✅ Ensure `currentUser` and `selectedUser` exist
                                            (msg.from === currentUser?.username && msg.to === selectedUser?.username) ||
                                            (msg.from === selectedUser?.username && msg.to === currentUser?.username)
                                        
                                           
                                    )
                                    .map((msg, index) => (
                                        <div key={index} className={`flex items-center mb-1 ${msg.from === currentUser.username ? "justify-end" : "justify-start"}`}>
                                            {msg.from !== currentUser.username && (
                                                <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-black rounded-full text-lg font-bold mr-2">
                                                    {msg.from.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div
                                                className={`py-2 px-4 rounded-lg max-w-[60%] text-sm ${
                                                    msg.from === currentUser.username
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                    : "bg-gray-300 text-black"
                                                }`}
                                            >
                                                
                                                {msg.gif ? (
                                                                <img src={msg.gif} alt="GIF" className="w-32 h-32 rounded-lg" />
                                                            ) : (
                                                                msg.text
                                                            )}
                                            </div>   
                                            {msg.from === currentUser.username && (
                                                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-bold ml-2">
                                                    {msg.from.charAt(0).toUpperCase()}
                                                </div>
                                            )}          
                                        </div>
                                    ))}
                                      <div ref={chatEndRef}></div>  

                            </div>
                        {/* Message Input */}
                        <div className="chat-footer p-4 border-t border-b border-r flex relative">
                                <input 
                                    type="text" 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    onKeyDown={(e) => {
                                        if(e.key === "Enter"){
                                          e.preventDefault();
                                          sendMessage();
                                        }
                                    }}
                                    className="flex-1 p-2 text-sm text-zinc-800 border rounded-lg focus:outline-none focus:ring-0" 
                                    placeholder="Type your message..."
                                />
                                <div className="flex" >
                                    <button  onClick={() => {
                                      setShowEmojiPicker(!showEmojiPicker)
                                      setShowGifPicker(false)
                                     setGifSearch("")
                                    }} className="ml-2 px-2 md:px-4 py-2 md:bg-blue-500 text-white rounded-lg md:hover:bg-blue-600"
                                    >😀</button>
                                        {showEmojiPicker && <div ref={emojiPickerRef} className="absolute bottom-12 left-0" onClick={(e) => e.stopPropagation()}>
                                            <Picker emojiStyle={"facebook"} onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)} /></div>}

                                </div>
                                <div className="">
                                <button onClick={() => {
                                    setShowGifPicker(prev => !prev); // ✅ Proper toggle logic
                                    if (!showGifPicker) fetchGif();
                                }} className="ml-2 px-2 py-2 md:bg-blue-500 text-red md:text-white rounded-lg hover:bg-blue-600"
                                >GIF</button>
                                {showGifPicker && (
                                                <div  ref={gifPickerRef} className="absolute bottom-12 left-0 z-10 bg-white border p-2 w-72">
                                                    <input type="text" placeholder="Search GIFs..." value={gifSearch} onChange={(e) => setGifSearch(e.target.value)} className="w-full p-2 border mb-2" />
                                                    <button onClick={fetchGif} className="w-full bg-blue-500 text-white p-2 rounded">Search</button>
                                                    <div className="grid grid-cols-3 gap-2 mt-2">{gifResults.map(gif => <img key={gif.id} src={gif.images.fixed_height.url} alt="GIF" onClick={() => sendMessage(gif.images.fixed_height.url)} className="cursor-pointer w-24 h-24 rounded-lg" />)}</div>
                                                </div>
                                            )}
                                </div>
                                <button onClick={() => sendMessage()} className="ml-2 px-2 md:px-4 py-2 md:bg-blue-500 text-white rounded-lg md:hover:bg-blue-600">
                                    {isMobileView ?  <svg className="w-6 h-6 rotate-90" fill="red" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
 : "Send"}
                                </button>
                            </div>
                        </>
                    )} 
              
                            {/* Header with Back Button (Mobile Only) */}
                   

                            {/* <div className="chat-header p-4 bg-white text-white font-semibold text-lg flex justify-between border">
                                <h2 className="text-zinc-800 font-bold">{selectedUser.username} ({selectedUser.age}, {selectedUser.country})</h2>
                                <button 
                                    onClick={handleLogout} 
                                    className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </div> */}




                
                </div>
            </div>
        </div>
    );
}
