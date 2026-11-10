function Post({post}){
    return(
        <article className="m-0.5 p-3 mb-2 break-inside-avoid rounded-xl border border-[#A69F9F] shadow-md bg-[#e7e4e4]">
            <h2 className="text-sm">{post.username}</h2>
            <h3 className="underline">{post.title}</h3>
            <p className="text-sm">{post.caption}</p>
            <img src={post.image} className="w-full h-auto object-cover"/>

            <div>
                <button className="rounded-lg px-2 py-2">❤️Like</button>
                <button>🗨️Comments</button>
            </div>
        </article>
    );
}

export default Post;