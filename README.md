# MovieHub Admin Demo

لوحة تجريبية لإدارة كتالوج أفلام/مسلسلات من مصادر URL أو JSON API مصرح باستخدامها.

## تشغيل
```bash
pip install -r requirements.txt
python app.py
```
ثم افتح http://127.0.0.1:5000

## صيغة الاستيراد
JSON array (أو object يحتوي items) وحقول: title, type, poster, description, year, category, url.

## API
- GET /api/items
- GET /api/items/<id>
- GET /api/play/<id>

هذه نسخة أولية للاختبار، وليست Production. قبل النشر نضيف تسجيل دخول، صلاحيات، فحص مصادر آمن، مواسم/حلقات، تعدد مصادر، مراقبة وتعطيل تلقائي، وقاعدة بيانات Production.
