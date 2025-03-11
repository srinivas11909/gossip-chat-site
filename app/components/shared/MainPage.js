import Login from "./Login"
export default function MainPage(){
    return <>
      <div className="flex flex-col flex-col-reverse sm:flex-row w-full">
        <div className="w-full text-grey-400 sm:w-[64%] sm:mt-0 mt-[50px]">
            <div>
               <h2 className="text-zince-800 font-bold text-xl mb-3">Free Chat without Registraiton</h2>
               <p className="text-zinc-800 text-sm">Goosip chat is provide free chatting service across the world. Here you can Meet new friends across the globe.No Download and no gmail or any personal data for now.Enjoy the anonymous state</p>
            </div>
            <div className="mt-[47px]">
              <h2 className="text-zinc-700 font-bold text-xl mb-3 uppercase">Why Gossip Chat</h2>
               <p className="text-sm text-zinc-700">Connect anonymously with people from around the world and engage in real-time, private conversations. This site ensures your privacy while allowing you to share thoughts, ask questions, or just chat casually. No need for sign-ups or personal information—just type and talk!".No Registration even for profile image and change enjoy completly anonymous from ur side.</p>
            </div>
            <div className="mt-[47px]">
              <h2 className="text-zinc-800 font-bold text-xl mb-3 uppercase">Things Not to Do on a Chatting Site</h2>
               <ul className="list-decimal list-ouside px-6">
                  <li className="mb-2 text-sm text-zinc-700">Avoid sharing personal information, like your full name, address, phone number, or any financial details (e.g., credit card numbers)...</li>
                  <li className="mb-2 text-sm text-zinc-700">Be cautious about clicking on suspicious links or attachments sent by strangers. These could be attempts to steal your information or install malware on your device.</li>
                  <li className="mb-2 text-sm text-zinc-700">Even if a person seems friendly, don’t trust strangers with sensitive personal information or financial requests. Be aware of online scams.</li>
                  <li className="mb-2 text-sm text-zinc-700">Refrain from using abusive, offensive, or inappropriate language, as it can lead to being banned or causing harm to others.</li>
               </ul>
            </div>
        </div>
        <div className="w-full sm:w-[30%] sm:ml-auto">
           <h2 className="text-zinc-800 text-lg font-bold mb-2">Join Here to explore world</h2>
           <Login />
        </div>
      </div>
    </>
}