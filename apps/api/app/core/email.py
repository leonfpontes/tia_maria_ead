import os
import smtplib
from email.mime.text import MIMEText


def _default_frontend_base_url() -> str:
    return os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")


def send_password_reset_email(to_email: str, token: str) -> None:
    base_url = _default_frontend_base_url().rstrip("/")
    reset_url = f"{base_url}/reset-password?token={token}"
    subject = "Recuperação de senha – Terreiro Tia Maria EAD"
    html = f"""
    <html>
      <body style='font-family: Arial, sans-serif; background: #f7f7f7; padding: 32px;'>
        <div style='max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px;'>
          <h2 style='color: #2e7d32;'>Recuperação de senha</h2>
          <p>Olá, recebemos uma solicitação para redefinir sua senha.</p>
          <p>Clique no botão abaixo para criar uma nova senha. O link é válido por 2 horas.</p>
          <a href='{reset_url}' style='display: inline-block; background: #2e7d32; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;'>Redefinir senha</a>
          <p style='margin-top: 24px; font-size: 13px; color: #555;'>Se você não solicitou, ignore este e-mail.</p>
          <hr style='margin: 24px 0;'>
          <p style='font-size: 12px; color: #999;'>Terreiro Tia Maria & Cabocla Jupira – Plataforma EAD</p>
        </div>
      </body>
    </html>
    """

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")
    from_email = os.getenv("EMAIL_FROM", "no-reply@tiamariaead.com")

    # Ambientes sem SMTP configurado: loga no console para facilitar testes locais.
    if not smtp_host:
        print(
            f"[email-dev] Reset para {to_email}: acesse {reset_url} (configure SMTP_HOST para envio real)."
        )
        return

    msg = MIMEText(html, "html")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        if smtp_user:
            server.login(smtp_user, smtp_pass)
        server.sendmail(from_email, [to_email], msg.as_string())
