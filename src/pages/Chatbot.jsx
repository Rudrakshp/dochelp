/* ------------------------------------------------------------------
   src/pages/Chatbot.jsx
   ------------------------------------------------------------------ */
   import { useState, useRef, useEffect } from "react";
   import { useNavigate } from "react-router-dom";
   import "./Chatbot.css"; // separate stylesheet for styling
   
   export default function Chatbot() {
     const [messages, setMessages] = useState([
       { role: "bot", text: "Hi! I'm here to listen. How are you feeling today?" },
     ]);
     const [input, setInput] = useState("");
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();
     const bottomRef = useRef(null);
   
     /* ⬇️ Scroll to latest message whenever messages change */
     useEffect(() => {
       bottomRef.current?.scrollIntoView({ behavior: "smooth" });
     }, [messages]);
   
     /* ⬇️ Gemini API call */
     const askGemini = async (prompt) => {
       const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
   
       if (!API_KEY) {
         console.error("Gemini API Key is not set! Check your .env file and ensure you restarted your dev server.");
         return "Oops! The chatbot service isn't configured correctly. Please contact support.";
       }
   
       // *** CHANGE THIS LINE: Use a currently supported model name ***
       const MODEL_NAME = "gemini-1.5-flash"; // Or "gemini-1.5-pro", "gemini-2.5-pro" if available
   
       const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
   
       try {
         const requestBody = {
           contents: [{ role: "user", parts: [{ text: prompt }] }],
         };
   
         console.log("Sending request to Gemini API:", API_URL);
         console.log("Request Body:", JSON.stringify(requestBody, null, 2));
   
         const res = await fetch(API_URL, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(requestBody),
         });
   
         console.log("Gemini API Response Status:", res.status);
         const rawResponseText = await res.text();
         console.log("Gemini API Raw Response:", rawResponseText);
   
         if (!res.ok) {
           let errorDetails = "Unknown error";
           try {
             const errorData = JSON.parse(rawResponseText);
             errorDetails = errorData.error?.message || JSON.stringify(errorData);
           } catch (parseError) {
             errorDetails = rawResponseText;
           }
           throw new Error(
             `Gemini API error: ${res.status} ${res.statusText} - ${errorDetails}`
           );
         }
   
         const data = JSON.parse(rawResponseText);
   
         const reply =
           data?.candidates?.[0]?.content?.parts?.[0]?.text ||
           "Sorry, I couldn't get a response from Gemini.";
         return reply;
       } catch (err) {
         console.error("Gemini API call failed:", err);
         return `Oops, something went wrong contacting the Gemini service: ${err.message || 'Check your internet connection or API key.'}`;
       }
     };
   
     /* ⬇️ Handle Send */
     const handleSend = async () => {
       if (!input.trim()) return;
   
       const userMsg = { role: "user", text: input.trim() };
       setMessages((prev) => [...prev, userMsg]);
       setInput("");
       setLoading(true);
   
       try {
         const botReply = await askGemini(userMsg.text);
         setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
       } catch (error) {
         console.error("Error sending message:", error);
         setMessages((prev) => [...prev, { role: "bot", text: `I apologize, there was an error processing your request: ${error.message || 'Please try again.'}` }]);
       } finally {
         setLoading(false);
       }
     };
   
     return (
       <div className="chat-wrapper">
         <h2 className="chat-title">🧠 Mental Health Chatbot</h2>
   
         <div className="chat-window">
           {messages.map((m, i) => (
             <div key={i} className={`chat-bubble ${m.role}`}>
               {m.text}
             </div>
           ))}
           {loading && (
             <div className="chat-bubble bot loading-bubble">
               <span></span><span></span><span></span>
             </div>
           )}
           <div ref={bottomRef} />
         </div>
   
         <div className="chat-input-row">
           <input
             type="text"
             placeholder={loading ? "Thinking..." : "Type something…"}
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
             disabled={loading}
           />
           <button onClick={handleSend} disabled={loading || !input.trim()}>
             {loading ? "…" : "Send"}
           </button>
           <button className="back-btn" onClick={() => navigate("/login")}>
             Back
           </button>
         </div>
       </div>
     );
   }