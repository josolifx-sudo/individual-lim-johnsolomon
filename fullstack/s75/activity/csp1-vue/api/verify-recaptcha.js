export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const token = body?.token;

    if (!token) {
      return res.status(400).json({ success: false, message: "Missing token" });
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ success: false, message: "Missing RECAPTCHA_SECRET_KEY" });
    }

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);

    const googleRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const data = await googleRes.json();

    
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Verification error" });
  }
}