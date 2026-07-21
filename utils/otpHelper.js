import nodemailer from "nodemailer";

// In-memory OTP storage: email -> { otp, expiresAt, signupData }
export const otpStore = new Map();

// Helper to generate a random 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to user's email
export const sendOTPMail = async (email, otp, purpose = "verification") => {
    const isProduction = process.env.NODE_ENV === "production";

    // Check if SMTP configuration exists in environment variables
    const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

    if (hasSmtpConfig) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === "true", // false for port 587 (STARTTLS)
                requireTLS: true, // Force TLS upgrade — never send credentials in plaintext
                family: 4, // Force IPv4 — prevents ENETUNREACH on hosts without IPv6 routing
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            const mailOptions = {
                from: `"BrandMart Security" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
                to: email,
                subject: `BrandMart - Keep Your Account Secure: ${otp}`,
                text: `Your BrandMart ${purpose} OTP is ${otp}. It will expire in 5 minutes.`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #0A192F; background-color: #F8FAFC; border-radius: 12px; max-width: 500px; margin: auto;">
                        <h2 style="color: #0A192F; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 0;">BrandMart</h2>
                        <p>Hi there,</p>
                        <p>You requested a <strong>${purpose}</strong> OTP to secure your account actions.</p>
                        <div style="background-color: #0A192F; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 6px;">
                            <span style="font-size: 28px; font-weight: 800; tracking-widest: 4px; color: #D4AF37; text-align: center; display: block; letter-spacing: 5px;">${otp}</span>
                        </div>
                        <p style="font-size: 12px; color: rgba(10, 25, 47, 0.6); margin-bottom: 0;">This OTP code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`[SMTP OTP] Sent OTP to ${email}`);
            return;
        } catch (error) {
            console.error("Transporter sendMail failed, falling back to console logger:", error);
        }
    }

    // Console Logging Fallback for local development
    console.log("\n==================================================");
    console.log(`🔑 [EMAIL OTP] Sent to: ${email}`);
    console.log(`   OTP CODE: ${otp}`);
    console.log(`   PURPOSE: ${purpose}`);
    console.log(`   EXPIRE TIME: 5 minutes`);
    console.log("==================================================\n");
};
