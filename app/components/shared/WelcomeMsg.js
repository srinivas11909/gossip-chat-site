export default function WelcomeMsg({currentUser}){
    return <>
       <div className="hidden md:flex items-center justify-center flex-1 text-gray-500">
                           {currentUser ? (
                                <>👋 Hello, <span className="font-bold">{currentUser.username}</span>! Select a chat to start messaging.</>
                            ) : (
                                <>Select a chat to start messaging</>
                            )}
        </div>
    </>
}