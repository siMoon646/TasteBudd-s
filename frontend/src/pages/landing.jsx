import Post from "../components/Post";
import { Link } from "react-router-dom";

function LandingPage() {
    const posts = [
        {
            username: "@Emily",
            title: "Scallion Pancakes",
            caption: "My favorite snack",
        },
        {
            username: "@Vanna",
            title: "California Roll",
            caption: "Today I tried a California roll for the first time! It tasted really good, was also very cheap. Highly recommend!",
        },
        {
            username: "@Simon",
            title: "Cheeseburgers",
            caption: "Sometimes, a good cheeseburger is all you need.",
        },
        {
            username: "@user",
            title: "Chocolate Chip Cookies",
            caption: "Made some cookies today!",
        },
        {
            username: "@user",
            title: "Chocolate Chip Cookies",
            caption: "Made some cookies today!",
        },
        {
            username: "@user",
            title: "Chocolate Chip Cookies",
            caption: "Made some cookies today!",
        },
        {
            username: "@user",
            title: "Chocolate Chip Cookies",
            caption: "Made some cookies today!",
        },
        {
            username: "@user",
            title: "Chocolate Chip Cookies",
            caption: "Made some cookies today!",
        },
        {
            username: "@user",
            title: "Chocolate Chip Cookies",
            caption: "Made some cookies today!",
            image: "src/assets/cookies.png"
        }
    ];
    return (
        <main className=" w-full bg-[#E65F5C] pb-6">
            <div>
                <div>
                    <header>
                        <h1 className="text-[#f5f7dc] pt-4 text-center text-4xl font-bold">TasteBudd's</h1>
                        <p className="text-center text-xs">Explore the community</p>
                        <p className="text-center text-xs pb-4">Discover dishes, share your cravings, find your food buddies!</p>
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <Link to="/login" class="rounded-lg px-4 py-2 text-[#000000] hover:bg-orange-100">
                                Login
                            </Link>
                            <Link to="/signup" class="rounded-lg bg-[#F5F7DC] px-4 py-2 text-[#000000] hover:bg-[#F5F7DC]">
                                Signup
                            </Link>
                        </div>
                    </header>
                    <div className="m-8 columns-2 md:columns-3 lg:columns-4 gap-1">
                        {posts.map((post) => (
                            <Post key={post.id} post={post}/>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
export default LandingPage;