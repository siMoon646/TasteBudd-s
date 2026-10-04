import Post from "../components/Post";
import { Link } from "react-router-dom";

function LandingPage(){
    const posts = [
        {username:"Emily", content: "Scallion pancakes are really good"},
        {username: "Vanna", content: "Today i tried out a california roll for the first time, taste really good, also very cheap, highly recommend"},
        {username: "Simon", content: "Cheeseburgers"}
    ];
    return(
        <div>
            <div>
                <header>
                    <h1>TasteBudd's</h1>
                    <Link to = "/login">
                        Login
                    </Link>
                    <Link to = "/signup">
                        Signup
                    </Link>
                </header>
            </div>
            <main>
                {posts.map((post, index) => (
                <Post
                    key = {index}
                    username = {post.username}
                    content = {post.content}                
                />
            ))}
            </main>
        </div>
    );
}

export default LandingPage;