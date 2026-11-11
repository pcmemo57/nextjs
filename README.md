# Next.js Canlı Test Uygulaması

Bu proje, canlı bir sunucuda (VPS, Cloud, Vercel, Docker veya cPanel Node.js) kolayca test edilmek üzere hazırlanmış modern bir Next.js (App Router, Tailwind CSS, TypeScript) uygulamasıdır.

---

## 🚀 Hızlı Başlangıç

### 1. Yerel Ortamda Test Etme

Projeyi yerel makinenizde test etmek için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

---

## 🌐 Canlı Sunucuya Yükleme ve Dağıtım Rehberi

### Yöntem 1: VPS / Linux Sunucusu (Ubuntu/Debian) + PM2

Sunucunuza zip dosyasını yükleyin ve açın:

```bash
# 1. Zip dosyasını açın ve klasöre girin
unzip nextjs-app.zip -d my-app
cd my-app

# 2. Node.js bağımlılıklarını kurun
npm install

# 3. Production build alın
npm run build

# 4. PM2 ile arka planda 7/24 çalışacak şekilde başlatın
pm2 start npm --name "nextjs-test" -- start

# Veya PM2 yoksa doğrudan:
npm start
```

Uygulamanız varsayılan olarak `3000` portunda çalışacaktır. Önüne Nginx reverse proxy ekleyerek 80/443 portundan domaininize yönlendirebilirsiniz.

---

### Yöntem 2: cPanel "Setup Node.js App"

1. cPanel dosya yöneticisinden zip içeriğini projenin kök dizinine yükleyin.
2. cPanel'de **Setup Node.js App** bölümüne girin.
3. Node.js sürümünü (18, 20 veya üzeri) seçin.
4. Application root ve URL'yi belirleyin.
5. **Run NPM Install** butonuna tıklayın.
6. SSH terminali üzerinden veya cPanel terminali ile `npm run build` çalıştırın ve uygulamayı yeniden başlatın (Restart).

---

### Yöntem 3: Vercel / Netlify / Render

Projeyi GitHub / GitLab deponuza pushlayın veya Vercel CLI ile:
```bash
npx vercel
```
komutunu vererek tek adımda canlıya alabilirsiniz.

---

## 🛠 Proje Özellikleri

- **Next.js (App Router)**: En güncel Next.js sürümü.
- **React State & Hydration Testi**: Sayfa üzerinde çalışan etkileşimli sayaç.
- **Canlı API Endpoint Testi**: `/api/health` rotasını tetikleyen ve yanıt süresini (ms) ölçen test butonu.
- **Etkileşimli Not Listesi**: React form ve array manipülasyon testi.
- **Tailwind CSS**: Modern ve koyu temalı (dark mode) şık arayüz.
- **TypeScript**: Tam tip güvenliği.
