# MovieHub Final D1 Panel
لوحة Cloudflare Worker + D1 للأفلام والمسلسلات والقنوات.

## بعد الرفع
- أبقِ D1 binding باسم `DB` ومتصلاً بقاعدة `moviehub-db`.
- أضف Secret باسم `ADMIN_TOKEN` من Cloudflare Settings.
- شغّل migration `migrations/0001_init.sql` إذا لم تكن الجداول موجودة.
- الاستيراد من رابط يدعم JSON/API عام أو JSON-LD منظمًا، ولا يتجاوز تسجيل الدخول أو الحماية.
