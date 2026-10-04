import { Link } from "react-router-dom";

function Signup(){
    return(
        <div>
            <h1>TasteBudd's</h1>
            <h2>Signup</h2>
            <div>
                <input type = "text" placeholder = "create username"/>
                <input type = "text" placeholder = " create password"/>
            </div>
        </div>
    );
}

export default Signup;