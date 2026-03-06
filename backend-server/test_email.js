const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log("🚀 Rozpoczynam test wysyłki maila na adres zewnętrzny...");
  console.log("📧 Odbiorca: hjuren01@gmail.com");

  const targetNick = "Tester DAOResorts";
  const photoId = "4"; // Przykład ze zdjęcia
  const remainingSeats = "142";
  const userEmail = "hjuren01@gmail.com";

  try {
    const { data, error } = await resend.emails.send({
      from: 'DAOResorts <witaj@daoresorts.club>',
      to: [userEmail],
      subject: `Witaj w rodzinie ${targetNick}! Twój Paszport jest gotowy 🦫`,
      html: `
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
</style>
</head>
<body style="margin: 0; padding: 0; background-color: #0c1208; font-family: 'DM Sans', Arial, sans-serif; color: #F5F0E8;">

<div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #0E1208;">

  <!-- HEADER -->
  <div style="background: linear-gradient(160deg, #0E1208 0%, #1C2614 50%, #0E1208 100%); padding: 40px 20px 0; text-align: center;">
    <div style="font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #F5F0E8; letter-spacing: 0.02em; margin-bottom: 30px;">DAOResorts<span style="color: #C9A84C;">.</span>club</div>

    <!-- NFT Image inserted here above the badge -->
    <div style="width: 160px; height: 160px; margin: 0 auto 24px; position: relative;">
        <img src="https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/${photoId}.webp" alt="Beaver #${photoId}" style="width: 100%; height: 100%; border-radius: 50%; border: 2px solid rgba(201,168,76,0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.3); object-fit: cover;" />
    </div>

    <div style="display: inline-block; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); color: #C9A84C; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 14px; border-radius: 4px; margin-bottom: 20px;">Paszport Członkowski</div>

    <h1 style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; line-height: 1.2; color: #F5F0E8; margin-bottom: 16px; margin-top: 0;">
      Witaj w klubie,<br><em style="font-style: italic; color: #C9A84C;">${targetNick}.</em>
    </h1>

    <p style="font-size: 15px; line-height: 1.6; color: #8A9E8A; max-width: 400px; margin: 0 auto 30px;">
      Twój darmowy Paszport DAOResorts jest gotowy. Jesteś o jeden krok od dożywotniego członkostwa.
    </p>

    <!-- NFT Passport Card -->
    <div style="background: linear-gradient(135deg, #1C2614 0%, #162010 50%, #1C2614 100%); border: 1px solid rgba(201,168,76,0.25); border-radius: 16px; padding: 20px; margin: 0 5px; position: relative; text-align: left;">
      <div style="font-size: 9px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #6B7A60; margin-bottom: 8px;">Paszport Członkowski</div>
      <div style="font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: #F5F0E8; margin-bottom: 4px;">${targetNick}</div>
      <div style="font-size: 12px; font-weight: 500; color: #C9A84C; letter-spacing: 0.08em;">PASZPORT #${photoId}</div>
      <div style="position: absolute; top: 20px; right: 20px; background: rgba(45, 90, 61, 0.4); border: 1px solid rgba(45, 90, 61, 0.8); color: #6DB88A; font-size: 9px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px;">✓ Aktywny</div>
    </div>
  </div>

  <!-- STATS BAR -->
  <div style="display: table; width: 100%; padding: 24px 20px; border-collapse: separate;">
    <div style="display: table-cell; text-align: center; border-right: 1px solid rgba(201,168,76,0.1);">
      <span style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; color: #C9A84C; display: block; margin-bottom: 4px;">${remainingSeats}</span>
      <span style="font-size: 10px; font-weight: 400; color: #6B7A60; letter-spacing: 0.05em;">miejsc pozostało</span>
    </div>
    <div style="display: table-cell; text-align: center; border-right: 1px solid rgba(201,168,76,0.1);">
      <span style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; color: #C9A84C; display: block; margin-bottom: 4px;">14</span>
      <span style="font-size: 10px; font-weight: 400; color: #6B7A60; letter-spacing: 0.05em;">nocy rocznie</span>
    </div>
    <div style="display: table-cell; text-align: center;">
      <span style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; color: #C9A84C; display: block; margin-bottom: 4px;">∞</span>
      <span style="font-size: 10px; font-weight: 400; color: #6B7A60; letter-spacing: 0.05em;">dożywotnio</span>
    </div>
  </div>

  <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent); margin: 8px 20px;"></div>

  <!-- BODY -->
  <div style="padding: 40px 20px 30px;">
    <div style="font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C; margin-bottom: 12px;">Co dalej</div>
    <h2 style="font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #F5F0E8; line-height: 1.3; margin-bottom: 16px; margin-top: 0;">Twój Paszport jest gotowy.<br>Token Członkowski czeka.</h2>
    <p style="font-size: 14px; line-height: 1.7; color: #A8B89A; margin-bottom: 24px;">
      Właśnie dołączyłeś do grupy osób które budują razem coś czego nie było dotąd w Polsce.
      Luksusowy resort wakacyjny <strong style="color: #F5F0E8; font-weight: 500;">posiadany i zarządzany przez społeczność</strong> —
      bez banków, bez marży hotelowej, bez ukrytych prowizji.
    </p>

    <!-- Steps -->
    <div style="margin: 24px 0;">
      <div style="display: table; width: 100%; margin-bottom: 16px; border-bottom: 1px solid rgba(201,168,76,0.08); padding-bottom: 16px;">
        <div style="display: table-cell; width: 32px; padding-right: 12px; vertical-align: top;">
          <div style="width: 28px; height: 28px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); border-radius: 50%; text-align: center; line-height: 28px; font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 600; color: #C9A84C;">1</div>
        </div>
        <div style="display: table-cell; vertical-align: top;">
          <div style="font-size: 14px; font-weight: 500; color: #F5F0E8; margin-bottom: 4px;">✓ Paszport odebrany</div>
          <div style="font-size: 13px; line-height: 1.5; color: #6B7A60;">Twój bober ${targetNick} #${photoId} jest już Twój. Darmowy, na zawsze.</div>
        </div>
      </div>
      <div style="display: table; width: 100%; margin-bottom: 16px; border-bottom: 1px solid rgba(201,168,76,0.08); padding-bottom: 16px;">
        <div style="display: table-cell; width: 32px; padding-right: 12px; vertical-align: top;">
          <div style="width: 28px; height: 28px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); border-radius: 50%; text-align: center; line-height: 28px; font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 600; color: #C9A84C;">2</div>
        </div>
        <div style="display: table-cell; vertical-align: top;">
          <div style="font-size: 14px; font-weight: 500; color: #F5F0E8; margin-bottom: 4px;">Zweryfikuj tożsamość (KYC)</div>
          <div style="font-size: 13px; line-height: 1.5; color: #6B7A60;">Szybka weryfikacja przez DidIt.me — zajmuje 2 minuty.</div>
        </div>
      </div>
      <div style="display: table; width: 100%;">
        <div style="display: table-cell; width: 32px; padding-right: 12px; vertical-align: top;">
          <div style="width: 28px; height: 28px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); border-radius: 50%; text-align: center; line-height: 28px; font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 600; color: #C9A84C;">3</div>
        </div>
        <div style="display: table-cell; vertical-align: top;">
          <div style="font-size: 14px; font-weight: 500; color: #F5F0E8; margin-bottom: 4px;">Kup Token Członkowski</div>
          <div style="font-size: 13px; line-height: 1.5; color: #6B7A60;">19 990 PLN jednorazowo. 14 nocy rocznie — dożywotnio. Zostało ${remainingSeats} miejsc.</div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align: center; padding: 24px 0;">
      <a href="https://daoresorts.club" style="display: inline-block; background: #C9A84C; color: #0E1208; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 14px 30px; border-radius: 6px; margin-bottom: 12px;">
        Sprawdź dostępność →
      </a>
      <div style="font-size: 11px; color: #6B7A60;">Zostało ${remainingSeats} z 150 miejsc założycielskich</div>
    </div>
  </div>

  <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent); margin: 8px 20px;"></div>

  <!-- PROJECT STATUS -->
  <div style="padding: 40px 20px; background: #0B1008;">
    <div style="font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C; margin-bottom: 12px;">Projekt w trakcie realizacji</div>
    <h3 style="font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #F5F0E8; margin-bottom: 8px; margin-top: 0;">Budujemy. Publicznie i transparentnie.</h3>
    <p style="font-size: 13px; color: #6B7A60; margin-bottom: 28px; line-height: 1.5;">Każdy etap budowy jest widoczny dla społeczności. Oto gdzie jesteśmy:</p>

    <!-- Roadmap / Milestones -->
    <div style="margin-bottom: 16px;">
      <!-- Item 1 -->
      <div style="display: table; width: 100%; border-left: 2px solid rgba(201,168,76,0.15); margin-left: 15px; padding-left: 20px; position: relative; padding-bottom: 20px;">
        <div style="position: absolute; left: -10px; top: 0; width: 18px; height: 18px; background: rgba(45,90,61,0.4); border: 1px solid #2D5A3D; border-radius: 50%; color: #6DB88A; font-size: 10px; line-height: 18px; text-align: center;">✓</div>
        <div style="font-size: 14px; font-weight: 600; color: #F5F0E8;">Działka zakupiona</div>
        <div style="font-size: 12px; color: #6B7A60;">2530m² w Pszczew, Wielkopolska. Las, cisza, jezioro w pobliżu.</div>
      </div>
      <!-- Item 2 -->
      <div style="display: table; width: 100%; border-left: 2px solid rgba(201,168,76,0.15); margin-left: 15px; padding-left: 20px; position: relative; padding-bottom: 20px;">
        <div style="position: absolute; left: -10px; top: 0; width: 18px; height: 18px; background: rgba(45,90,61,0.4); border: 1px solid #2D5A3D; border-radius: 50%; color: #6DB88A; font-size: 10px; line-height: 18px; text-align: center;">✓</div>
        <div style="font-size: 14px; font-weight: 600; color: #F5F0E8;">Umowa z architektem podpisana</div>
        <div style="font-size: 12px; color: #6B7A60;">Architekt wybrany, umowa podpisana. Projekt ruszył.</div>
      </div>
      <!-- Item 3 -->
      <div style="display: table; width: 100%; border-left: 2px solid rgba(201,168,76,0.15); margin-left: 15px; padding-left: 20px; position: relative; padding-bottom: 20px;">
        <div style="position: absolute; left: -10px; top: 0; width: 18px; height: 18px; background: rgba(45,90,61,0.4); border: 1px solid #2D5A3D; border-radius: 50%; color: #6DB88A; font-size: 10px; line-height: 18px; text-align: center;">✓</div>
        <div style="font-size: 14px; font-weight: 600; color: #F5F0E8;">Aplikacja uruchomiona</div>
        <div style="font-size: 12px; color: #6B7A60;">System paszportów, KYC, głosowania i rezerwacji działa i jest dostępny dla członków.</div>
      </div>
       <!-- Item 4 (ACTIVE) -->
      <div style="display: table; width: 100%; border-left: 2px solid rgba(201,168,76,0.15); margin-left: 15px; padding-left: 20px; position: relative; padding-bottom: 20px;">
        <div style="position: absolute; left: -10px; top: 0; width: 18px; height: 18px; background: rgba(201,168,76,0.2); border: 1px solid #C9A84C; border-radius: 50%; color: #C9A84C; font-size: 10px; line-height: 18px; text-align: center;">→</div>
        <div style="font-size: 14px; font-weight: 600; color: #C9A84C;">Praca z architektem nad projektem — trwa</div>
        <div style="font-size: 12px; color: #8A7A50;">Projekt 6 domków 70m² z jacuzzi, restauracja, sala kinowa. Prace projektowe w toku.</div>
      </div>
      <!-- Item 5 (PENDING) -->
      <div style="display: table; width: 100%; border-left: 2px solid rgba(201,168,76,0.15); margin-left: 15px; padding-left: 20px; position: relative; padding-bottom: 20px;">
        <div style="position: absolute; left: -10px; top: 0; width: 18px; height: 18px; background: rgba(255,255,255,0.05); border: 1px solid #3A4A35; border-radius: 50%; color: #3A4A35; font-size: 10px; line-height: 18px; text-align: center;">○</div>
        <div style="font-size: 14px; font-weight: 600; color: #4A5A42;">Oczekiwanie na pozwolenie na budowę</div>
        <div style="font-size: 12px; color: #3A4A35;">Złożenie dokumentacji i decyzja administracyjna.</div>
      </div>
      <!-- Item 6 (PENDING) -->
      <div style="display: table; width: 100%; border-left: 2px solid rgba(201,168,76,0.15); margin-left: 15px; padding-left: 20px; position: relative; padding-bottom: 20px;">
        <div style="position: absolute; left: -10px; top: 0; width: 18px; height: 18px; background: rgba(255,255,255,0.05); border: 1px solid #3A4A35; border-radius: 50%; color: #3A4A35; font-size: 10px; line-height: 18px; text-align: center;">○</div>
        <div style="font-size: 14px; font-weight: 600; color: #4A5A42;">Sprzedaż członkostwa</div>
        <div style="font-size: 12px; color: #3A4A35;">Zbieramy 150 członków założycielskich. Zostało ${remainingSeats} miejsc.</div>
      </div>
      <!-- Item 7 (PENDING) -->
      <div style="display: table; width: 100%; border-left: 2px solid rgba(201,168,76,0.15); margin-left: 15px; padding-left: 20px; position: relative; padding-bottom: 20px;">
        <div style="position: absolute; left: -10px; top: 0; width: 18px; height: 18px; background: rgba(255,255,255,0.05); border: 1px solid #3A4A35; border-radius: 50%; color: #3A4A35; font-size: 10px; line-height: 18px; text-align: center;">○</div>
        <div style="font-size: 14px; font-weight: 600; color: #4A5A42;">Start budowy</div>
        <div style="font-size: 12px; color: #3A4A35;">Po zebraniu społeczności. Fundamenty, stan surowy, wykończenie premium.</div>
      </div>
      <!-- Item 8 (PENDING) -->
      <div style="display: table; width: 100%; margin-left: 15px; padding-left: 20px; position: relative; padding-bottom: 20px;">
        <div style="position: absolute; left: -10px; top: 0; width: 18px; height: 18px; background: rgba(255,255,255,0.05); border: 1px solid #3A4A35; border-radius: 50%; color: #3A4A35; font-size: 10px; line-height: 18px; text-align: center;">○</div>
        <div style="font-size: 14px; font-weight: 600; color: #4A5A42;">Otwarcie resortu — 2026</div>
        <div style="font-size: 12px; color: #3A4A35;">Pierwsze rezerwacje dla członków założycielskich.</div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background: #080D05; padding: 24px 20px; border-top: 1px solid rgba(201,168,76,0.08); text-align: center;">
    <div style="font-family: 'Playfair Display', serif; font-size: 16px; color: #F5F0E8; margin-bottom: 10px;">DAOResorts<span style="color: #C9A84C;">.</span>club</div>
    <p style="font-size: 11px; line-height: 1.6; color: #4A5A42;">Pszczew, Wielkopolska. Pierwszy Web3 Vacation Club.</p>
    <div style="margin-top: 12px;">
      <a href="https://daoresorts.club" style="font-size: 11px; color: #6B7A60; text-decoration: none; margin-right: 12px;">WWW</a>
      <a href="#" style="font-size: 11px; color: #6B7A60; text-decoration: none;">FAQ</a>
    </div>
    <div style="font-size: 10px; line-height: 1.5; color: #3A4A35; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 12px; margin-top: 12px;">
      Ten mail został wysłany do ${userEmail}. Token NFT stanowi cyfrowy dokument członkostwa.
    </div>
  </div>

</div>
</body>
</html>
    `
    });

    if (error) {
      console.error('❌ Błąd Resend:', error);
    } else {
      console.log('✅ Test zakończony sukcesem! Mail wysłany (ID):', data.id);
    }
  } catch (err) {
    console.error('❌ Krytyczny błąd testu:', err);
  }
}

testEmail();
