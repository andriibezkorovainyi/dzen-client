import './styles/App.css'
import {Comment} from "./components/Comment";
import {AddComment} from "./components/AddComment";
import {AddUser} from "./components/AddUser";
import {useWebSocketContext} from "./hooks/useWebSocketContext";
import {Sorting} from "./components/Sorting";
import {Loader} from "./components/Loader";
import {Pagination} from "./components/Pagination";

function App() {
    const {user, comments, isLoading} = useWebSocketContext();

    return (
        <>
            <div className="app-container">
                <div className="app">
                    {user ? (
                        <AddComment key={null}/>
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
                                    addComment={<AddComment parentId={comment.id} key={comment.id}/>}
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
