import { 
  AiOutlineCheck
} from "react-icons/ai";


export default function Success() {
  return (
    <div style={{ textAlign: "center", paddingTop:"100px", background:"grey", color:"white" }} >
      <h1><AiOutlineCheck style={{ background:"green", width:"50px", height:"50px", borderRadius:"100%", verticalAlign:"bottom" }} /> Payment Successful!</h1>
      <p>Thank you for your purchase. Your order will be processed shortly.</p>
      <a href="/" style={{ color: "white" }}>← Back to Home</a>
    </div>
  );
}
