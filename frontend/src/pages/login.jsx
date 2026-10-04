import Post from "../components/Post";

function LandingPage(){
    const posts = [
        {username:"Emily", content: "Scallion pancakes are really good"},
        {username: "Vanna", content: "Today i tried out a california roll for the first time, taste really good, also very cheap, highly recommend"},
        {username: "Simon", content: "testing"}
    ];
    return(
        <div>
            <h1>TasteBudd's</h1>

            {posts.map((post, index) => (
                <Post
                    key = {index}
                    username = {post.username}
                    content = {post.content}                
                />
            ))}
        </div>
    );
}

export default LandingPage;