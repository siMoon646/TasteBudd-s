function Login() {
    return (
        <div>
            <h1 className="pt-4 text-center text-4xl font-bold text-[#f5f7dc]">TasteBudd's</h1>
            <div className="ml-15 mr-15 flex flex-col gap-1">
                
                    <label>Email</label>
                    <input className="rounded-lg border-1 mt-2" type="email" id="email" />
            
                    <label>Password</label>
                    <input className="rounded-lg border-1 mt-2" type="password" id="password" />
                
                
            </div>
            <button className="ml-15 rounded-lg m-1 p-1.5 bg-[#F5F7DC]">Login</button>
        </div>
    );
}

export default Login;