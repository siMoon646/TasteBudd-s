import { Link } from "react-router-dom";

function Signup(){
    return(
        <div>
            <h1>TasteBudd's</h1>
            <h2>Signup</h2>
            <div>
                <input type = "email" placeholder = "Email"></input>
                <input type = "text" placeholder = "Create username"/>
                <input type = "password" placeholder = " Create password"/>
                <button>Create Account</button>
            </div>
        </div>
    );
}

export default Signup;