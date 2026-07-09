import { Link } from "react-router-dom";

import "./Header.css";
import "../style/common/underline.css";

export default function AuthHeader(){

 return (
   <header className="header">
     <div className="headerInner">
       <div className="auth">
        <Link className="underline" to="/"> Main </Link>
        <Link className="underline" to="/login"> Login </Link>
        <Link className="underline" to="/signup"> Sign up </Link>
       </div>
     </div>
   </header>
 )
}
