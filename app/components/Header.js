export default function Header(){
    return <>
      <div className="">
        <header className="bg-gradient-to-r from-blue-500 to-pink-500 fixed top-0 left-0 right-0 z-10 shadow-lg transition-all ease-in-out">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
            {/* <div className="text-white text-lg font-semibold hidden sm:block">
            Free Rooms
            </div> */}

            <div className="flex-1 text-center">
            <div className="logo-container flex items-center justify-center space-x-2">
            <svg width="113" height="25" viewBox="0 0 300 147.69222502070932" className="looka-1j8o68f">
                <defs id="SvgjsDefs1082"></defs>
                <g id="SvgjsG1083" featurekey="X3o6dM-0" transform="matrix(8.266946761515438,0,0,8.266946761515438,-0.6613541247064008,-59.02601454141336)" fill="#ffffff">
                <path d="M15.92 11.14 q0 1 -0.62 1.72 t-1.52 1.17 t-1.93 0.66 t-1.87 0.21 q-1.1 0 -2.12 -0.3 t-1.72 -1 q-0.12 -0.12 -0.28 -0.37 t-0.22 -0.47 t0.05 -0.31 t0.51 0.11 q0.72 0.4 1.53 0.55 t1.71 0.15 q0.26 0 0.71 -0.04 t0.98 -0.14 t1.07 -0.26 t0.98 -0.39 t0.72 -0.55 t0.28 -0.72 q0 -0.7 -0.6 -1.15 t-1.43 -0.72 t-1.7 -0.38 t-1.41 -0.11 q-1.34 0 -2.65 0.39 t-2.35 1.16 t-1.69 1.91 t-0.65 2.64 q0 1.14 0.45 2.07 t1.24 1.6 t1.87 1.04 t2.34 0.37 q1.56 0 2.85 -0.53 t2.25 -1.49 q0.02 -0.24 0.07 -0.68 t0.13 -0.89 t0.18 -0.84 t0.24 -0.55 l0 0.02 q0.12 -0.18 0.37 -0.13 t0.51 0.22 t0.43 0.39 t0.15 0.38 q-0.24 1.02 -0.38 2.14 t-0.27 2.06 t-0.32 1.55 t-0.53 0.61 q-0.2 0 -0.32 -0.3 t-0.19 -0.75 t-0.1 -0.96 t-0.03 -0.91 q-1.12 0.98 -2.56 1.48 t-2.84 0.5 q-1.3 0 -2.58 -0.44 t-2.3 -1.28 t-1.65 -2.04 t-0.63 -2.74 q0 -1.7 0.74 -3.11 t1.99 -2.42 t2.88 -1.57 t3.41 -0.56 q1.02 0 2.22 0.2 t2.22 0.67 t1.7 1.24 t0.68 1.89 z M17.66 19.48 q-0.74 0 -1.18 -0.38 t-0.61 -0.94 t-0.1 -1.22 t0.34 -1.21 t0.71 -0.91 t1.04 -0.32 q0.7 0.04 1.14 0.42 t0.64 0.94 t0.17 1.19 t-0.29 1.17 t-0.73 0.9 t-1.13 0.36 z M17.92 18.58 q0.22 0.02 0.36 -0.21 t0.2 -0.6 t0.05 -0.81 t-0.1 -0.82 t-0.25 -0.64 t-0.38 -0.26 q-0.2 0 -0.34 0.24 t-0.21 0.6 t-0.07 0.79 t0.08 0.8 t0.24 0.63 t0.42 0.28 z M23.36 14.76 q0.26 -0.14 0.52 0 t0.4 0.39 t0.09 0.52 t-0.41 0.37 q-0.32 0.08 -0.67 0.16 t-0.66 0.14 t-0.53 0.11 t-0.28 0.05 q0.04 0 0.43 0.11 t0.83 0.36 t0.8 0.67 t0.36 1.06 q0 0.7 -0.48 1.11 t-1.12 0.55 q-0.4 0.06 -0.77 0 t-0.66 -0.25 t-0.47 -0.52 t-0.18 -0.79 q0 -0.38 0.25 -0.6 t0.54 -0.28 t0.52 0.06 t0.19 0.42 q-0.1 0.62 0.06 0.9 t0.32 0.28 q0.2 0 0.33 -0.14 t0.15 -0.37 t-0.08 -0.52 t-0.32 -0.59 q-0.18 -0.26 -0.45 -0.47 t-0.54 -0.36 t-0.53 -0.24 t-0.42 -0.13 q-0.18 -0.04 -0.27 -0.25 t-0.08 -0.44 t0.16 -0.42 t0.45 -0.19 q0.6 0 1.29 -0.19 t1.23 -0.51 z M28 14.76 q0.26 -0.14 0.52 0 t0.4 0.39 t0.09 0.52 t-0.41 0.37 q-0.32 0.08 -0.67 0.16 t-0.66 0.14 t-0.53 0.11 t-0.28 0.05 q0.04 0 0.43 0.11 t0.83 0.36 t0.8 0.67 t0.36 1.06 q0 0.7 -0.48 1.11 t-1.12 0.55 q-0.4 0.06 -0.77 0 t-0.66 -0.25 t-0.47 -0.52 t-0.18 -0.79 q0 -0.38 0.25 -0.6 t0.54 -0.28 t0.52 0.06 t0.19 0.42 q-0.1 0.62 0.06 0.9 t0.32 0.28 q0.2 0 0.33 -0.14 t0.15 -0.37 t-0.08 -0.52 t-0.32 -0.59 q-0.18 -0.26 -0.45 -0.47 t-0.54 -0.36 t-0.53 -0.24 t-0.42 -0.13 q-0.18 -0.04 -0.27 -0.25 t-0.08 -0.44 t0.16 -0.42 t0.45 -0.19 q0.6 0 1.29 -0.19 t1.23 -0.51 z M29.6 15.84 q0 -0.48 0.25 -0.66 t0.55 -0.14 t0.52 0.26 t0.16 0.54 q-0.08 0.36 -0.15 0.9 t-0.09 1.04 t0.03 0.86 t0.23 0.36 q0.12 0 0.29 -0.31 t0.33 -0.73 t0.3 -0.84 t0.18 -0.64 q0.06 -0.2 0.2 -0.27 t0.27 -0.04 t0.22 0.15 t0.03 0.3 q-0.04 0.12 -0.13 0.45 t-0.23 0.73 t-0.33 0.83 t-0.44 0.76 t-0.55 0.51 t-0.66 0.08 q-0.54 -0.16 -0.77 -0.59 t-0.27 -1 t0.01 -1.24 t0.05 -1.31 z M31.880000000000003 13.1 q0.04 0.22 -0.05 0.41 t-0.27 0.34 t-0.42 0.25 t-0.5 0.14 q-0.5 0.06 -0.98 -0.1 t-0.54 -0.58 q-0.08 -0.44 0.27 -0.75 t0.93 -0.41 t1.04 0.09 t0.52 0.61 z M32.24 14.2 q0 -0.38 0.26 -0.62 t0.56 -0.33 t0.53 -0.02 t0.19 0.33 q-0.04 0.22 -0.07 0.58 t-0.07 0.82 q0.2 -0.2 0.51 -0.36 t0.67 -0.14 q0.62 0.04 0.97 0.46 t0.49 1 t0.06 1.24 t-0.34 1.22 t-0.67 0.91 t-0.95 0.31 q-0.36 0 -0.72 -0.24 l-0.12 -0.08 t-0.12 -0.1 q-0.04 0.78 -0.05 1.45 t-0.01 1.07 q0 0.22 -0.23 0.34 t-0.49 0.13 t-0.48 -0.1 t-0.18 -0.35 q0.04 -0.4 0.08 -1.06 t0.07 -1.44 t0.05 -1.6 t0.03 -1.52 t0.02 -1.21 t0.01 -0.69 z M33.84 15.879999999999999 q-0.18 0.42 -0.25 0.9 t-0.03 0.9 t0.2 0.72 t0.4 0.34 q0.2 0.04 0.37 -0.2 t0.28 -0.61 t0.17 -0.82 t0.03 -0.85 t-0.14 -0.67 t-0.33 -0.29 t-0.4 0.16 t-0.3 0.42 z"></path>
                </g>
                </svg>
                </div>
            </div>
    
            {/* <div className="flex items-center space-x-4 hidden sm:flex">
            <button 
                className="text-white px-6 rounded-full text-sm font-semibold  focus:outline-none hover:border-0">
                Login
            </button>
            <button 
                className="text-white px-6 rounded-full text-sm font-semibold focus:outline-none hover:border-0">
                Register
            </button>
            </div> */}
    
            <div className="sm:hidden flex items-center">
            <button  className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
            </div>
        </div>
    
        <div className="sm:hidden flex flex-col items-center space-y-4 py-4 bg-white w-full">
            <div className="w-full">
            <button className="w-full text-lg text-pink-600 py-2 px-6 hover:bg-pink-100 transition-all">Login</button>
            </div>
            <div className="w-full">
            <button className="w-full text-lg text-pink-600 py-2 px-6 hover:bg-pink-100 transition-all">Register</button>
            </div>
            <div className="w-full">
            <button className="w-full text-lg text-pink-600 py-2 px-6 hover:bg-pink-100 transition-all">Free Rooms</button>
            </div>
        </div>
        </header>
      </div>
    </>
}