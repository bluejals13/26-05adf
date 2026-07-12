import { Link } from "react-router-dom";

import "./Header.css";
import "../style/common/underline.css";

export default function AuthHeader(){

 return (
   <header className="header">
     <div className="headerInner">
       <div className="auth flex items-center gap-4">
        <Link className="underline" to="/login"> Login </Link>
        <Link className="underline" to="/signup"> Sign up </Link>

        <Link className="underline ml-auto" to="/"> Main </Link>
       </div>
     </div>
   </header>
 )
}
