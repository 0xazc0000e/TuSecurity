const nodemailer = require('nodemailer');

// Create a test SMTP service (for development)
// In production, configure with real SMTP credentials
const createTransporter = () => {
    // For development, use a test account or console logging
    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
        // If ethereal credentials exist, use them; otherwise we'll just log to console
        if (process.env.ETHEREAL_USER && process.env.ETHEREAL_PASS) {
            return nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.ETHEREAL_USER,
                    pass: process.env.ETHEREAL_PASS
                }
            });
        }
        // Return null to indicate console-only mode
        return null;
    }

    // Production SMTP configuration
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (to, code, username) => {
    const transporter = createTransporter();
    
    // Console-only mode for development without SMTP
    if (!transporter) {
        console.log('\n========================================');
        console.log('📧 VERIFICATION CODE (Development Mode)');
        console.log('========================================');
        console.log(`To: ${to}`);
        console.log(`Username: ${username}`);
        console.log(`Code: ${code}`);
        console.log('========================================\n');
        return { success: true, messageId: 'console-mode', previewUrl: null };
    }
    
    const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a14; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: #141428; border-radius: 16px; overflow: hidden; border: 1px solid #7112AF; }
            .header { background: linear-gradient(135deg, #7112AF, #520EA4); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { padding: 30px; color: #e2e8f0; }
            .code-box { background: #0a0a14; border: 2px solid #7112AF; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #7112AF; letter-spacing: 4px; font-family: monospace; }
            .footer { background: #0a0a14; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
            .warning { color: #f59e0b; font-size: 12px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 رمز التحقق</h1>
            </div>
            <div class="content">
                <p>مرحباً <strong>${username}</strong>،</p>
                <p>شكراً للانضمام إلى نادي الأمن السيبراني بجامعة طيبة!</p>
                <p>رمز التحقق الخاص بك هو:</p>
                <div class="code-box">
                    <div class="code">${code}</div>
                </div>
                <p class="warning">⏰ ينتهي صلاحية الرمز خلال 30 دقيقة</p>
                <p>إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد بأمان.</p>
            </div>
            <div class="footer">
                <p>نادي الأمن السيبراني | جامعة طيبة</p>
                <p>© 2024 TU Cyber Security Club</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: '"TU Cyber Security Club" <no-reply@tu.edu.sa>',
        to,
        subject: '🔐 رمز التحقق - نادي الأمن السيبراني',
        html: htmlContent,
        text: `مرحباً ${username}،\n\nرمز التحقق الخاص بك هو: ${code}\n\nينتهي صلاحية الرمز خلال 30 دقيقة.\n\nنادي الأمن السيبراني - جامعة طيبة`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        
        // In development, log the URL to preview the email
        if (process.env.NODE_ENV === 'development') {
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        }
        
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    generateVerificationCode,
    sendVerificationEmail
};
