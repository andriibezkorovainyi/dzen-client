import './styles/App.css'
import {Comment} from "./components/Comment";
import {AddComment} from "./components/AddComment";
import {AddUser} from "./components/AddUser";
import {useWebSocketContext} from "./hooks/useWebSocketContext";
import {Sorting} from "./components/Sorting";
import {Loader} from "./components/Loader";
import {Pagination} from "./components/Pagination";
import {User} from "./components/User";

function App() {
    const {user, comments, isLoading} = useWebSocketContext();

    return (
        <>
            <div className="app-container">
                <div className="app">
                    {user ? (
                        <>
                            <AddComment key={null}/>
                            <User avatarUrl={user?.avatarUrl} userName={user.userName}/>
                        </>
                    ) : (
                        <AddUser/>
                    )}

                    <Sorting/>
                    <Pagination/>

                    <div className="app-comments">
                        {comments.map(comment => {
                            return (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                />
                            )
                        })}
                    </div>

                    {isLoading && <Loader/>}
                </div>
            </div>
        </>
    )
}

export default App
