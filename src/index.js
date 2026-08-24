const HTML = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MovieHub Admin</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#090b10;color:#f5f7fb;font-family:system-ui,Arial}
.top{position:sticky;top:0;z-index:3;background:#111521ee;padding:15px;border-bottom:1px solid #283044}
.wrap{max-width:1150px;margin:auto;padding:16px}
.brand{font-weight:900;font-size:21px}
.muted{color:#9da8bb}
.hero,.card{background:#121722;border:1px solid #293043;border-radius:18px;padding:17px;margin-bottom:13px}
.hero{background:linear-gradient(135deg,#181f30,#10131c)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.stat{background:#0d111a;border-radius:12px;padding:10px;text-align:center}
.stat b{display:block;font-size:22px}
.nav{display:flex;gap:7px;overflow:auto;margin:12px 0}
.nav button{width:auto;white-space:nowrap}
input,select,textarea,button{width:100%;padding:11px;margin:5px 0;border-radius:10px;border:1px solid #30384c;background:#0c1018;color:#fff}
textarea{min-height:90px}
button{background:#6d50ff;border:0;font-weight:800}
.secondary{background:#252c3c}
.danger{background:#7f2930}
.row{display:flex;gap:8px}
.row>*{flex:1}
.item{display:grid;grid-template-columns:55px 1fr auto;gap:11px;align-items:center;border-top:1px solid #273044;padding:12px 0}
.poster{width:55px;height:75px;object-fit:cover;border-radius:8px;background:#222}
.pill{display:inline-block;background:#252c3c;padding:4px 8px;border-radius:99px;font-size:12px;margin:2px}
.hide{display:none}
.preview{max-height:430px;overflow:auto;border:1px solid #293043;border-radius:12px;padding:8px}
.check{display:flex;gap:8px;align-items:center;border-bottom:1px solid #242b3b;padding:8px}
.check input{width:auto}
code{direction:ltr;display:inline-block}
@media(max-width:650px){
.stats{grid-template-columns:1fr 1fr}
.item{grid-template-columns:45px 1fr}
.item .actions{grid-column:1/-1}
.row{display:block}
}
</style>
</head>

<body>
<div class="top">
  <div class="wrap" style="padding:0">
    <span class="brand">🎬 MovieHub Admin</span>
    <span class="muted">D1</span>
  </div>
</div>

<div class="wrap">

<div class="hero">
<h1>لوحة إدارة المحتوى</h1>
<p class="muted">إدارة الأفلام والمسلسلات والقنوات والمصادر.</p>

<div class="stats">
<div class="stat"><b id="movies">0</b>أفلام</div>
<div class="stat"><b id="series">0</b>مسلسلات</div>
<div class="stat"><b id="channels">0</b>قنوات</div>
<div class="stat"><b id="sources">0</b>مصادر</div>
</div>
</div>

<div class="nav">
<button onclick="tab('library')">المكتبة</button>
<button onclick="tab('add')">إضافة</button>
<button onclick="tab('remote')">استيراد من رابط</button>
<button onclick="tab('json')">JSON</button>
<button onclick="tab('api')">API</button>
</div>

<section id="library" class="card">
<div class="row">
<input id="q" placeholder="بحث..." oninput="load()">
<select id="filter" onchange="load()">
<option value="">الكل</option>
<option value="movie">أفلام</option>
<option value="series">مسلسلات</option>
<option value="channel">قنوات</option>
</select>
</div>
<div id="list"></div>
</section>

<section id="add" class="card hide">
<h3>إضافة عنصر</h3>

<div class="row">
<input id="title" placeholder="الاسم">
<select id="type">
<option value="movie">فيلم</option>
<option value="series">مسلسل</option>
<option value="channel">قناة</option>
</select>
</div>

<div class="row">
<input id="poster" placeholder="رابط الصورة/الشعار">
<input id="year" type="number" placeholder="السنة">
</div>

<div class="row">
<input id="category" placeholder="التصنيف">
<input id="country" placeholder="الدولة">
</div>

<textarea id="description" placeholder="الوصف"></textarea>
<input id="url" placeholder="رابط التشغيل">
<button onclick="addItem()">حفظ في D1</button>
<div id="msg" class="muted"></div>
</section>

<section id="remote" class="card hide">
<h3>استيراد من رابط</h3>
<p class="muted">
أدخل رابط JSON/API عام أو صفحة تحتوي على JSON-LD.
</p>

<input id="remoteUrl" dir="ltr" placeholder="https://example.com/catalog.json">

<div class="row">
<select id="remoteType">
<option value="">اكتشاف النوع</option>
<option value="movie">أفلام</option>
<option value="series">مسلسلات</option>
<option value="channel">قنوات</option>
</select>

<button onclick="previewRemote()">جلب ومعاينة</button>
</div>

<div id="remoteMsg" class="muted"></div>
<div id="preview" class="preview hide"></div>

<div id="importButtons" class="row hide">
<button onclick="selectAll(true)">تحديد الكل</button>
<button class="secondary" onclick="selectAll(false)">إلغاء التحديد</button>
<button onclick="commitRemote()">استيراد المحدد إلى D1</button>
</div>
</section>

<section id="json" class="card hide">
<h3>استيراد JSON يدوي</h3>
<textarea id="jsonbox" style="min-height:190px"
placeholder='[{"title":"Movie","type":"movie","url":"https://example.com/video"}]'></textarea>
<button onclick="importJson()">استيراد إلى D1</button>
<div id="importmsg" class="muted"></div>
</section>

<section id="api" class="card hide">
<h3>API</h3>
<p><code>GET /api/items</code></p>
<p><code>GET /api/items/:id</code></p>
<p><code>GET /api/play/:id</code></p>
<p><code>POST /api/items</code></p>
<p><code>POST /api/items/:id/sources</code></p>
<p><code>POST /api/import</code></p>
<p><code>POST /api/import/preview</code></p>
<p class="muted">عمليات الإدارة تتطلب ADMIN_TOKEN.</p>
</section>

</div>

<script>
let remoteItems = [];

const $ = id => document.getElementById(id);

function tab(id) {
  document.querySelectorAll('section').forEach(x => x.classList.add('hide'));
  $(id).classList.remove('hide');
}

function esc(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    m => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    }[m])
  );
}

function typ(t) {
  return t === 'movie'
    ? 'فيلم'
    : t === 'series'
    ? 'مسلسل'
    : 'قناة';
}

async function load() {
  const q = encodeURIComponent($('q').value);
  const type = encodeURIComponent($('filter').value);

  const r = await fetch('/api/items?q=' + q + '&type=' + type);
  const a = await r.json();

  $('list').innerHTML = a.map(x => {
    const poster = esc(x.poster || '');
    const title = esc(x.title);
    const category = x.category
      ? '<span class="pill">' + esc(x.category) + '</span>'
      : '';

    return '<div class="item">' +
      '<img class="poster" src="' + poster + '" onerror="this.style.visibility=\\'hidden\\'">' +
      '<div><b>' + title + '</b><br>' +
      '<span class="pill">' + typ(x.type) + '</span>' +
      category +
      '<span class="muted"> ID ' + x.id + '</span></div>' +
      '<div class="actions">' +
      '<button class="secondary" onclick="source(' + x.id + ')">مصدر إضافي</button>' +
      '<button class="secondary" onclick="play(' + x.id + ')">اختبار</button>' +
      '<button class="danger" onclick="del(' + x.id + ')">حذف</button>' +
      '</div></div>';
  }).join('') || '<p class="muted">لا توجد عناصر.</p>';

  stats();
}

async function stats() {
  const r = await fetch('/api/stats');
  const s = await r.json();

  ['movies','series','channels','sources'].forEach(k => {
    $(k).textContent = s[k] || 0;
  });
}

async function adminFetch(url,opt = {}) {
  let t = localStorage.adminToken || prompt('أدخل ADMIN_TOKEN');

  if (!t) return null;

  localStorage.adminToken = t;

  opt.headers = {
    ...(opt.headers || {}),
    authorization: 'Bearer ' + t
  };

  const r = await fetch(url,opt);

  if (r.status === 401) {
    localStorage.removeItem('adminToken');
    alert('ADMIN_TOKEN غير صحيح');
  }

  return r;
}

async function addItem() {
  const b = {
    title: $('title').value,
    type: $('type').value,
    poster: $('poster').value,
    year: +$('year').value || null,
    category: $('category').value,
    country: $('country').value,
    description: $('description').value,
    url: $('url').value
  };

  const r = await adminFetch('/api/items',{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify(b)
  });

  $('msg').textContent = r && r.ok
    ? 'تم الحفظ في D1'
    : 'تعذر الحفظ';

  if (r && r.ok) {
    tab('library');
    load();
  }
}

async function source(id) {
  const url = prompt('رابط المصدر الإضافي');

  if (!url) return;

  const r = await adminFetch('/api/items/' + id + '/sources',{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({
      url:url,
      label:'Backup'
    })
  });

  if (r && r.ok) alert('تمت الإضافة');
}

async function play(id) {
  const r = await fetch('/api/play/' + id);
  const j = await r.json();

  alert(
    j.url
      ? 'المصدر النشط:\\n' + j.url
      : (j.error || 'لا يوجد مصدر')
  );
}

async function del(id) {
  if (!confirm('حذف العنصر؟')) return;

  const r = await adminFetch('/api/items/' + id,{
    method:'DELETE'
  });

  if (r && r.ok) load();
}
async function importJson() {
  try {
    const items = JSON.parse($('jsonbox').value);

    const r = await adminFetch('/api/import',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({items:items})
    });

    const j = r ? await r.json() : {};

    $('importmsg').textContent =
      r && r.ok
        ? 'تم استيراد ' + j.imported + ' عنصر'
        : 'تعذر الاستيراد';

    if (r && r.ok) load();

  } catch(e) {
    $('importmsg').textContent = 'JSON غير صالح';
  }
}

async function previewRemote() {
  $('remoteMsg').textContent = 'جاري الجلب...';
  $('preview').classList.add('hide');
  $('importButtons').classList.add('hide');

  const r = await adminFetch('/api/import/preview',{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({
      url:$('remoteUrl').value,
      type:$('remoteType').value
    })
  });

  const j = r ? await r.json() : {};

  if (!r || !r.ok) {
    $('remoteMsg').textContent =
      j.error || 'تعذر قراءة المصدر';
    return;
  }

  remoteItems = j.items || [];

  $('remoteMsg').textContent =
    'تم العثور على ' +
    remoteItems.length +
    ' عنصر. راجع وحدد المطلوب.';

  $('preview').innerHTML = remoteItems.map((x,i) => {
    return '<label class="check">' +
      '<input class="pick" type="checkbox" data-i="' + i + '" checked>' +
      '<span><b>' + esc(x.title) + '</b> — ' +
      typ(x.type) +
      (x.url ? ' ✓ رابط' : '') +
      '</span></label>';
  }).join('');

  $('preview').classList.remove('hide');
  $('importButtons').classList.remove('hide');
}

function selectAll(v) {
  document.querySelectorAll('.pick').forEach(x => {
    x.checked = v;
  });
}

async function commitRemote() {
  const items = [
    ...document.querySelectorAll('.pick:checked')
  ].map(x => remoteItems[Number(x.dataset.i)]);

  const r = await adminFetch('/api/import',{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({
      items:items,
      skipDuplicates:true
    })
  });

  const j = r ? await r.json() : {};

  $('remoteMsg').textContent =
    r && r.ok
      ? 'تم استيراد ' +
        j.imported +
        ' وتخطي ' +
        (j.skipped || 0)
      : (j.error || 'تعذر الاستيراد');

  if (r && r.ok) load();
}

load();
</script>
</body>
</html>`;

const J = (x,status = 200) => {
  return new Response(
    JSON.stringify(x),
    {
      status:status,
      headers:{
        'content-type':'application/json; charset=utf-8',
        'access-control-allow-origin':'*'
      }
    }
  );
};

const clean = x => String(x ?? '').trim();

const admin = (req,env) => {
  if (!env.ADMIN_TOKEN) return false;

  const auth = req.headers.get('authorization') || '';

  return auth === 'Bearer ' + env.ADMIN_TOKEN;
};

async function getBody(req) {
  try {
    return await req.json();
  } catch(e) {
    return null;
  }
}

function normalize(raw,forced = '') {
  let arr;

  if (Array.isArray(raw)) {
    arr = raw;
  } else if (Array.isArray(raw?.items)) {
    arr = raw.items;
  } else if (Array.isArray(raw?.results)) {
    arr = raw.results;
  } else if (Array.isArray(raw?.data)) {
    arr = raw.data;
  } else {
    arr = [raw];
  }

  return arr.map(x => {

    if (!x || typeof x !== 'object') return null;

    const schema =
      clean(x['@type']).toLowerCase();

    let type =
      forced || clean(x.type).toLowerCase();

    if (!type) {
      if (schema.includes('movie')) {
        type = 'movie';
      } else if (
        schema.includes('tvseries') ||
        schema.includes('series')
      ) {
        type = 'series';
      } else if (
        schema.includes('broadcast') ||
        schema.includes('radio')
      ) {
        type = 'channel';
      }
    }

    if (!['movie','series','channel'].includes(type)) {
      type = forced || 'movie';
    }

    let image =
      x.poster ||
      x.image ||
      x.logo ||
      '';

    if (image && typeof image === 'object') {
      image = image.url || '';
    }

    let year = null;

    if (x.year) {
      year = Number(x.year) || null;
    } else if (x.datePublished) {
      year =
        Number(
          String(x.datePublished).slice(0,4)
        ) || null;
    }

    return {
      title:clean(x.title || x.name),
      type:type,
      poster:clean(image),
      description:clean(x.description),
      year:year,
      category:clean(x.category || x.genre),
      country:clean(x.country),
      url:clean(
        x.url ||
        x.stream_url ||
        x.streamUrl ||
        x.contentUrl ||
        x.embedUrl
      )
    };

  }).filter(x => x && x.title);
}

async function remotePreview(url,forced) {
  let u;

  try {
    u = new URL(url);
  } catch(e) {
    throw new Error('الرابط غير صالح');
  }

  if (
    u.protocol !== 'http:' &&
    u.protocol !== 'https:'
  ) {
    throw new Error(
      'يسمح فقط بروابط HTTP/HTTPS'
    );
  }

  const r = await fetch(
    u.toString(),
    {
      headers:{
        accept:
          'application/json,text/html;q=0.9',
        'user-agent':
          'MovieHub-Importer/1.0'
      },
      redirect:'follow'
    }
  );

  if (!r.ok) {
    throw new Error(
      'المصدر أعاد HTTP ' + r.status
    );
  }

  const ct =
    r.headers.get('content-type') || '';

  const text = await r.text();

  if (text.length > 3000000) {
    throw new Error(
      'الاستجابة كبيرة جدًا'
    );
  }

  let data;

  if (
    ct.includes('json') ||
    text.trim().startsWith('{') ||
    text.trim().startsWith('[')
  ) {

    try {
      data = JSON.parse(text);
    } catch(e) {
      throw new Error('JSON غير صالح');
    }

  } else {

    const regex =
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

    const scripts = [];

    let match;

    while ((match = regex.exec(text)) !== null) {
      scripts.push(match[1]);
    }

    if (!scripts.length) {
      throw new Error(
        'لم نجد JSON/API أو JSON-LD عامًا في الصفحة'
      );
    }

    const all = [];

    for (const script of scripts) {
      try {
        const z = JSON.parse(script);

        if (z && Array.isArray(z['@graph'])) {
          all.push(...z['@graph']);
        } else if (Array.isArray(z)) {
          all.push(...z);
        } else {
          all.push(z);
        }

      } catch(e) {}
    }

    data = all;
  }

  return normalize(data,forced).slice(0,500);
}

async function insert(env,x,skipDuplicates) {

  if (
    !x ||
    !x.title ||
    !['movie','series','channel'].includes(x.type)
  ) {
    return 'skip';
  }

  if (skipDuplicates) {
    const old = await env.DB
      .prepare(
        'SELECT id FROM items WHERE title=? AND type=? LIMIT 1'
      )
      .bind(clean(x.title),x.type)
      .first();

    if (old) return 'skip';
  }

  const result = await env.DB
    .prepare(
      'INSERT INTO items ' +
      '(title,type,poster,description,year,category,country) ' +
      'VALUES(?,?,?,?,?,?,?) RETURNING id'
    )
    .bind(
      clean(x.title),
      x.type,
      clean(x.poster),
      clean(x.description),
      x.year || null,
      clean(x.category),
      clean(x.country)
    )
    .first();

  if (x.url) {
    await env.DB
      .prepare(
        'INSERT INTO sources ' +
        '(item_id,label,url,priority) ' +
        'VALUES(?,?,?,1)'
      )
      .bind(
        result.id,
        'Primary',
        clean(x.url)
      )
      .run();
  }

  return 'ok';
}

export default {
  async fetch(req,env) {

    const u = new URL(req.url);
    const p = u.pathname;
    const method = req.method;

    if (p === '/' && method === 'GET') {
      return new Response(
        HTML,
        {
          headers:{
            'content-type':
              'text/html; charset=utf-8'
          }
        }
      );
    }

    if (!env.DB) {
      return J({
        error:'D1 binding DB غير متصل'
      },500);
    }

    if (
      p === '/api/stats' &&
      method === 'GET'
    ) {
      const r = await env.DB
        .prepare(
          "SELECT " +
          "SUM(type='movie') movies," +
          "SUM(type='series') series," +
          "SUM(type='channel') channels," +
          "(SELECT COUNT(*) FROM sources) sources " +
          "FROM items"
        )
        .first();

      return J({
        movies:r?.movies || 0,
        series:r?.series || 0,
        channels:r?.channels || 0,
        sources:r?.sources || 0
      });
    }

    if (
      p === '/api/items' &&
      method === 'GET'
    ) {

      const q =
        clean(u.searchParams.get('q'));

      const type =
        clean(u.searchParams.get('type'));

      let sql =
        'SELECT id,title,type,poster,' +
        'description,year,category,country,created_at ' +
        'FROM items WHERE 1=1';

      const args = [];

      if (q) {
        sql += ' AND title LIKE ?';
        args.push('%' + q + '%');
      }

      if (type) {
        sql += ' AND type=?';
        args.push(type);
      }

      sql += ' ORDER BY id DESC LIMIT 500';

      const result = await env.DB
        .prepare(sql)
        .bind(...args)
        .all();

      return J(result.results || []);
    }

    let mm =
      p.match(/^\/api\/items\/(\d+)$/);

    if (mm && method === 'GET') {

      const x = await env.DB
        .prepare(
          'SELECT * FROM items WHERE id=?'
        )
        .bind(Number(mm[1]))
        .first();

      if (!x) {
        return J({error:'not found'},404);
      }

      const sources = await env.DB
        .prepare(
          'SELECT id,label,priority,enabled,last_status,last_checked ' +
          'FROM sources WHERE item_id=? ORDER BY priority,id'
        )
        .bind(x.id)
        .all();

      const episodes = await env.DB
        .prepare(
          'SELECT * FROM episodes WHERE item_id=? ' +
          'ORDER BY season_no,episode_no'
        )
        .bind(x.id)
        .all();

      return J({
        ...x,
        sources:sources.results || [],
        episodes:episodes.results || []
      });
    }

    if (
      p === '/api/items' &&
      method === 'POST'
    ) {

      if (!admin(req,env)) {
        return J({error:'unauthorized'},401);
      }

      const b = await getBody(req);

      if (
        !b?.title ||
        !['movie','series','channel'].includes(b.type)
      ) {
        return J({error:'invalid item'},400);
      }

      await insert(env,b,false);

      return J({ok:true},201);
    }

    if (mm && method === 'DELETE') {

      if (!admin(req,env)) {
        return J({error:'unauthorized'},401);
      }

      await env.DB
        .prepare(
          'DELETE FROM items WHERE id=?'
        )
        .bind(Number(mm[1]))
        .run();

      return J({ok:true});
    }

    mm = p.match(
      /^\/api\/items\/(\d+)\/sources$/
    );

    if (mm && method === 'POST') {

      if (!admin(req,env)) {
        return J({error:'unauthorized'},401);
      }

      const b = await getBody(req);

      if (!b?.url) {
        return J({error:'url required'},400);
      }

      const n = await env.DB
        .prepare(
          'SELECT COALESCE(MAX(priority),0)+1 n ' +
          'FROM sources WHERE item_id=?'
        )
        .bind(Number(mm[1]))
        .first();

      await env.DB
        .prepare(
          'INSERT INTO sources ' +
          '(item_id,label,url,priority) VALUES(?,?,?,?)'
        )
        .bind(
          Number(mm[1]),
          clean(b.label || 'Backup'),
          clean(b.url),
          n?.n || 1
        )
        .run();

      return J({ok:true},201);
    }

    mm = p.match(
      /^\/api\/play\/(\d+)$/
    );

    if (mm && method === 'GET') {

      const s = await env.DB
        .prepare(
          'SELECT id,url,label FROM sources ' +
          'WHERE item_id=? AND enabled=1 ' +
          'ORDER BY priority,id LIMIT 1'
        )
        .bind(Number(mm[1]))
        .first();

      return s
        ? J(s)
        : J({error:'no active source'},404);
    }

    if (
      p === '/api/import/preview' &&
      method === 'POST'
    ) {

      if (!admin(req,env)) {
        return J({error:'unauthorized'},401);
      }

      const b = await getBody(req);

      if (!b?.url) {
        return J({error:'الرابط مطلوب'},400);
      }

      try {
        const items =
          await remotePreview(
            b.url,
            clean(b.type)
          );

        return J({items:items});

      } catch(e) {
        return J({
          error:e.message || 'تعذر الاستيراد'
        },400);
      }
    }

    if (
      p === '/api/import' &&
      method === 'POST'
    ) {

      if (!admin(req,env)) {
        return J({error:'unauthorized'},401);
      }

      const b = await getBody(req);

      const arr =
        Array.isArray(b?.items)
          ? b.items
          : [];

      let imported = 0;
      let skipped = 0;

      for (const x of arr.slice(0,500)) {

        const normalized =
          normalize([x])[0];

        if (!normalized) {
          skipped++;
          continue;
        }

        const result =
          await insert(
            env,
            normalized,
            Boolean(b.skipDuplicates)
          );

        if (result === 'ok') {
          imported++;
        } else {
          skipped++;
        }
      }

      return J({
        imported:imported,
        skipped:skipped
      });
    }

    return J({error:'not found'},404);
  }
};

// trigger cloudflare build
