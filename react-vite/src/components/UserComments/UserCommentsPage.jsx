import { useSelector, useDispatch } from "react-redux"
import { loadCurrentUserComments } from "../../redux/comment"
import { useEffect } from "react"

function UserCommentsPage(){
    const comments = useSelector(state => state.comments)
    const dispatch = useDispatch()
    useEffect(async () => {
        await dispatch(loadCurrentUserComments())
    })


    return (
    <>
        <h2>Comments</h2>

    </>
)}

export default UserCommentsPage