# بناء ملف APK لتطبيق نظافة

> ⚠️ Replit لا يستطيع بناء APK مباشرة (لا يوجد Android SDK داخل البيئة).
> الطريقة الرسمية والمدعومة من Expo هي عبر **EAS Build** السحابي — يبني على
> خوادم Expo ويُعيد لك ملف `.apk` أو `.aab` جاهز للتنزيل.

---

## 1) متطلبات أولية (مرة واحدة)

1. حساب مجاني على [expo.dev](https://expo.dev/signup)
2. تثبيت EAS CLI على جهازك المحلي:
   ```bash
   npm i -g eas-cli
   ```
3. تسجيل الدخول:
   ```bash
   eas login
   ```

> 🔑 إن كان لديك أسرار في Replit Secrets (مثل `EXPO_PUBLIC_SUPABASE_URL` و
> `EXPO_PUBLIC_SUPABASE_ANON_KEY`) أضفها أيضاً على EAS:
> `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "..."`

---

## 2) إعدادات المشروع (موجودة بالفعل)

- `app.config.ts` يضبط `android.package = "com.nadhafa.app"` و `versionCode`
- `eas.json` (إن لم يكن موجوداً، أنشئه — انظر القسم التالي)

### eas.json (نسخة جاهزة)

أنشئ الملف داخل `artifacts/mobile/eas.json`:

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "preview-apk": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true,
      "android": { "buildType": "app-bundle" }
    }
  },
  "submit": { "production": {} }
}
```

---

## 3) بناء APK للاختبار

من داخل مجلد `artifacts/mobile`:

```bash
eas build --profile preview-apk --platform android
```

ستحصل على رابط تنزيل في الـ terminal خلال 10–20 دقيقة. شغّل الملف على هاتفك
أو أرسله لمختبرين.

## 4) بناء AAB لرفعه على Google Play

```bash
eas build --profile production --platform android
```

يُنتج ملف `.aab` للرفع على Google Play Console.

---

## 5) ملاحظات مهمة

- إن واجهت خطأ "Invalid keystore" في أول مرة، اختر **"Generate new keystore"**
  حين يسألك EAS — هذا يحدث مرة واحدة فقط ويُحفظ تلقائياً.
- Push notifications تتطلب رفع مفتاح Firebase Cloud Messaging على EAS:
  `eas credentials` → اختر Android → FCM Server Key.
- الخرائط تستخدم Apple Maps على iOS و Google Maps على Android — لا حاجة
  لمفاتيح إضافية للبناء الافتراضي.

---

## 6) لماذا لا أستطيع البناء من Replit؟

البناء يحتاج Java + Android SDK + NDK (~10GB) وموارد BUILD ضخمة لا تتوفر في
حاوية Replit الافتراضية. لذلك تستخدم خدمة EAS التي تتولى ذلك سحابياً
بالمجان حتى 30 بناء/شهر.
