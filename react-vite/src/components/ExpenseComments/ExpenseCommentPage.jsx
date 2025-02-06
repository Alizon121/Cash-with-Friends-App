import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentActions } from "../../redux";
import CommentItem from "./CommentItem"; // or whatever we decide to call our edit/delete comment modal unless it's two?

function ExpenseCommentPage({ expenseId }) {
    const dispatch = useDispatch();
    const comments = useSelector((state) => state.comments.comments);

    useEffect(() => {
        dispatch(commentActions.getComments(userId));
    }, [dispatch, expenseId]);

    return (
        <div>
            {Object.values(comments).map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
};

export default ExpenseCommentPage;