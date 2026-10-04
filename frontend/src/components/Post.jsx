function Post({username, content}){
    return(
        <div>
            <h3>{username}</h3>
            <p>{content}</p>
        </div>
    );
}

export default Post;