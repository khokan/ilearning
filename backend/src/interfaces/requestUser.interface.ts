import { UserRole } from "../middlewares/auth";


export interface IRequestUser{
    userId : string;
    role : UserRole;
    email : string;
}