import { useSelector, useDispatch } from "react-redux"
import { getComments } from "../../redux/comment"
import { useEffect } from "react"

function UserCommentsPage(){
    const comments = useSelector(state => state.comments)
    const dispatch = useDispatch()
    useEffect(async () => {
        await dispatch(getComments("user"))
    })


    return (
    <>
        <h2>Comments</h2>

    </>
)}

export default UserCommentsPage