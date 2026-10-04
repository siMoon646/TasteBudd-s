import Post from "../components/Post";

function LandingPage(){
    const posts = {
        username:"Emily", content: "testing"
    }
    return(
        <div>
            <h1>TasteBudd's</h1>

            <Post/>
        </div>
    );
}

export default LandingPage;