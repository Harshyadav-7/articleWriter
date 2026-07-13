export const askGemini = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }

        // // Step 2: Products ko readable text mein convert karo
        // const productContext = products.map(p =>
        //     `${p.name} - ₹${p.price} - ${p.category} - Stock: ${p.stock}`
        // ).join("\n");

        // Step 3: Prompt banao
        const prompt = `
You are a Assistant writer at a article firm.


User ka sawaal: ${question}

if you can't write anything on the users question just say invalid question.
        `;

        // Step 4: Gemini API ko call karo
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        // Step 5: Gemini ka reply nikaalo
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, koi jawab nahi mila.";

        
        res.json({ reply });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};