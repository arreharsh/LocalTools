import JwtDecoder from "./JwtDecoder";  

export const metadata = {
  title: "JWT Decoder - Decode JSON Web Tokens Online",
  description:
    "Decode and verify JSON Web Tokens (JWT) easily with our online JWT Decoder tool. Inspect token payloads and headers quickly.",
};  

export default function Page() {
  return <JwtDecoder />;
}   