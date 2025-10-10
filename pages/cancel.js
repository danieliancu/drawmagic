import Link from "next/link";

export default function Cancel() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>❌ Payment Cancelled</h1>
      <p>No worries — you can try again anytime!</p>
      <Link href="/" style={{ color: "#635bff" }}>← Back to Home</Link>
    </div>
  );
}
