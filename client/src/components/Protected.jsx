export default function Protected({childred}){
    if(!localStorage.getItem('login')){
        return <Navigate to="login" replace />
    }
    return childred
}