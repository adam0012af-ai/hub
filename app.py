from flask import Flask, request, jsonify, render_template_string
import sqlite3, json, urllib.request
from urllib.parse import urlparse

app=Flask(__name__)
DB='catalog.db'

def db():
    c=sqlite3.connect(DB); c.row_factory=sqlite3.Row; return c

def init():
    c=db(); c.executescript('''
    CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,type TEXT DEFAULT 'movie',poster TEXT,description TEXT,year TEXT,category TEXT);
    CREATE TABLE IF NOT EXISTS sources(id INTEGER PRIMARY KEY AUTOINCREMENT,item_id INTEGER NOT NULL,url TEXT NOT NULL,priority INTEGER DEFAULT 1,active INTEGER DEFAULT 1,status TEXT DEFAULT 'unknown',FOREIGN KEY(item_id) REFERENCES items(id));
    '''); c.commit(); c.close()
init()

HTML='''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MovieHub Admin</title><style>
body{font-family:Arial;background:#0d0f14;color:#eee;margin:0}.top{padding:18px 24px;background:#151923;font-size:22px;font-weight:bold}.wrap{max-width:1100px;margin:auto;padding:20px}.card{background:#171b25;padding:18px;border-radius:14px;margin-bottom:18px}input,select,button{padding:11px;border-radius:8px;border:1px solid #343a48;background:#10131a;color:#fff;margin:4px}input{min-width:210px}button{cursor:pointer;background:#6d4aff;border:0}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}.item{background:#202532;padding:14px;border-radius:12px}.muted{color:#9ca3af;font-size:13px}.ok{color:#57d68d}.bad{color:#ff6b6b}</style></head><body><div class="top">🎬 MovieHub — لوحة الإدارة التجريبية</div><div class="wrap">
<div class="card"><h3>إضافة عنصر + مصدر تشغيل</h3><form method="post" action="/add"><input name="title" placeholder="اسم الفيلم/المسلسل" required><select name="type"><option value="movie">فيلم</option><option value="series">مسلسل</option></select><input name="url" placeholder="رابط المصدر المباشر" required><button>إضافة</button></form></div>
<div class="card"><h3>استيراد من JSON API / Feed</h3><form method="post" action="/import"><input name="url" style="min-width:60%" placeholder="https://example.com/catalog.json" required><button>استيراد</button></form><div class="muted">الصيغة التجريبية: مصفوفة JSON تحتوي title, type, poster, description, year, category, url. استخدم فقط مصادر مصرحًا لك بها.</div></div>
<div class="card"><h3>المكتبة ({{items|length}})</h3><div class="grid">{% for x in items %}<div class="item"><b>{{x['title']}}</b><div class="muted">#{{x['id']}} — {{'مسلسل' if x['type']=='series' else 'فيلم'}}</div><div class="muted">مصادر: {{x['cnt']}}</div><a style="color:#a997ff" href="/api/items/{{x['id']}}">API</a></div>{% endfor %}</div></div>
<div class="card"><b>API:</b> /api/items &nbsp; | &nbsp; /api/items/&lt;id&gt; &nbsp; | &nbsp; /api/play/&lt;id&gt;</div></div></body></html>'''

@app.get('/')
def home():
    c=db(); rows=c.execute('SELECT i.*,COUNT(s.id) cnt FROM items i LEFT JOIN sources s ON i.id=s.item_id GROUP BY i.id ORDER BY i.id DESC').fetchall(); c.close(); return render_template_string(HTML,items=rows)

@app.post('/add')
def add():
    c=db(); cur=c.execute('INSERT INTO items(title,type) VALUES(?,?)',(request.form['title'],request.form.get('type','movie'))); c.execute('INSERT INTO sources(item_id,url) VALUES(?,?)',(cur.lastrowid,request.form['url'])); c.commit(); c.close(); return ('<meta http-equiv="refresh" content="0;url=/">')

@app.post('/import')
def imp():
    u=request.form['url']; p=urlparse(u)
    if p.scheme not in ('http','https'): return 'URL غير صالح',400
    try:
        req=urllib.request.Request(u,headers={'User-Agent':'MovieHubCatalogImporter/1.0'})
        with urllib.request.urlopen(req,timeout=15) as r: data=json.load(r)
        if isinstance(data,dict): data=data.get('items',[])
        c=db(); n=0
        for z in data[:5000]:
            if not isinstance(z,dict) or not z.get('title') or not z.get('url'): continue
            cur=c.execute('INSERT INTO items(title,type,poster,description,year,category) VALUES(?,?,?,?,?,?)',(z['title'],z.get('type','movie'),z.get('poster'),z.get('description'),str(z.get('year','')),z.get('category')))
            c.execute('INSERT INTO sources(item_id,url) VALUES(?,?)',(cur.lastrowid,z['url'])); n+=1
        c.commit(); c.close(); return f'تم استيراد {n} عنصر. <a href="/">رجوع</a>'
    except Exception as e: return 'فشل الاستيراد: '+str(e),400

@app.get('/api/items')
def api_items():
    c=db(); r=[dict(x) for x in c.execute('SELECT * FROM items ORDER BY id DESC').fetchall()]; c.close(); return jsonify(r)

@app.get('/api/items/<int:i>')
def api_item(i):
    c=db(); x=c.execute('SELECT * FROM items WHERE id=?',(i,)).fetchone(); s=c.execute('SELECT id,url,priority,active,status FROM sources WHERE item_id=? ORDER BY priority,id',(i,)).fetchall(); c.close();
    if not x:return jsonify(error='not found'),404
    d=dict(x); d['sources']=[dict(a) for a in s]; return jsonify(d)

@app.get('/api/play/<int:i>')
def play(i):
    c=db(); s=c.execute('SELECT url FROM sources WHERE item_id=? AND active=1 ORDER BY priority,id LIMIT 1',(i,)).fetchone(); c.close(); return jsonify(item_id=i,play_url=s['url'] if s else None)

if __name__=='__main__': app.run(host='0.0.0.0',port=5000,debug=True)
