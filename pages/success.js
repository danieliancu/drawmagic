import { 
  AiOutlineCheck
} from "react-icons/ai";
import Link from "next/link";

export default function Success() {
  return (
    <div style={{ textAlign: "center", paddingTop:"100px", background:"grey", color:"white" }} >
      <h1><AiOutlineCheck style={{ background:"green", width:"50px", height:"50px", borderRadius:"100%", verticalAlign:"bottom" }} /> Payment Successful!</h1>
      <p>Thank you for your purchase. Your order will be processed shortly.</p>
      <Link href="/" style={{ color: "white" }}>← Back to Home</Link>
    </div>
  );
}
