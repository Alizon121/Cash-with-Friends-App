import { useSelector } from "react-redux"

function UserCommentsPage(){
    const comments = useSelector(state => state.comments)
    return <h2>Hello World</h2>
}

export default UserCommentsPage