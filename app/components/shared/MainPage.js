import Login from "./Login"
export default function MainPage(){
    return <>
      <div className="flex flex-col sm:flex-row w-full max-w-4xl">
        <div className="text-grey-400">
            <h2 className="text-gray-700 font-bold text-xl mb-3">Free Chat without Registraiton</h2>
            <p className="text-gray-600 text-sm">Goosip is provide free chatting service across the world. Here you can Meet new friends across the globe.No Download and no gmail or any personal data for now.Enjoy the anonymous state</p>
        </div>
        <div className="">
           <h2 className="text-zinc-800 text-lg font-bold mb-2">Join Here to explore world</h2>
           <Login />
        </div>
      </div>
    </>
}