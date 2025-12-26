# راهنمای رفع مشکل فونت

## بررسی مشکل:

### 1. بررسی Console مرورگر:
- F12 را بزنید
- به تب Console بروید
- خطاهای مربوط به فونت را بررسی کنید

### 2. بررسی Network:
- F12 > Network
- صفحه را Refresh کنید
- دنبال `game-font.ttf` بگردید
- ببینید آیا فایل لود می‌شود یا خطا می‌دهد

### 3. بررسی Elements:
- F12 > Elements
- یک عنصر را انتخاب کنید
- در پنل سمت راست، Computed را ببینید
- font-family را بررسی کنید

## راه حل‌های ممکن:

### اگر فونت لود نمی‌شود:
1. مطمئن شوید فایل `game-font.ttf` در `src/assets/fonts/` وجود دارد
2. نام فایل باید دقیقاً `game-font.ttf` باشد
3. سرور را restart کنید: `cmd /c npm run dev`

### اگر فونت لود می‌شود اما استفاده نمی‌شود:
1. در Console مرورگر این کد را اجرا کنید:
```javascript
document.fonts.check('16px GameFont')
```
اگر `false` برگرداند، فونت لود نشده است.

2. بررسی کنید که font-family درست تنظیم شده:
```javascript
getComputedStyle(document.body).fontFamily
```

## تست سریع:
در Console مرورگر این کد را اجرا کنید:
```javascript
const test = document.createElement('div');
test.style.fontFamily = 'GameFont';
test.textContent = 'تست فونت فارسی';
document.body.appendChild(test);
```
اگر فونت تغییر کرد، فونت کار می‌کند.

