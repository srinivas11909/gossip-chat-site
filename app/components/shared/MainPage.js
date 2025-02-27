import Login from "./Login"
export default function MainPage(){
    return <>
      <div className="flex flex-col sm:flex-row w-full max-w-4xl">
        <div className="">
            <h2>Free Chat without Registraiton</h2>
            <p>Goosip is provide free chatting service across the world. Here you can Meet new friends across the globe.No Download and no gmail or any personal data for now.Enjoy the anonymous state</p>
        </div>
        <div className="">
           <Login />
        </div>
      </div>
    </>
}