export default function WelcomeMsg({currentUser}){
    return <>
       <div className="hidden md:flex items-center justify-center flex-1 text-gray-500">
                           {currentUser ? (
                                <><div className="text-zinc-800 text-lg p-3">
                                    👋 Hello, <span className="font-bold">{currentUser.username}</span>! Select a chat to start messaging. 
                                       <p>Hopefully here you can find a good friend here <br/> <strong>Don't share any personal infomration here</strong></p>
                                    </div>
                                    </>
                            ) : (
                                <>Select a chat to start messaging</>
                            )}
        </div>
    </>
}