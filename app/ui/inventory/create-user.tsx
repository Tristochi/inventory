import {createUser} from "@/app/actions/auth"

export default async function Page(){
    
    return(
        <form action = {createUser}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input id = "username" name = "username" placeholder = "username"/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input id = "password" name = "password" type = "password"/>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id = "email" name = "email" type = "email"/>
                    </div>
                    <button type = "submit">Create User</button>
                </form>
    )
}