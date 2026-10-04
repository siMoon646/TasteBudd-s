import Post from "../components/Post";

function LandingPage(){
    const posts = [
        {username:"Emily", content: "Scallion pancakes are really good"},
        {username: "Vanna", content: "i had food poisoning from scallion pancakes"},
        {username: "Simon", content: "me too"}
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