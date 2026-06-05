// ============================================================
//  TRIXY.LOOKS — Cloudflare Worker v4
//  ⚠️  GANTI PIN di baris bawah ini
// ============================================================

const CORRECT_PIN = "2226";

const HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TRIXY.LOOKS — Pembukuan</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
:root{--pink:#FF6B9D;--purple:#A855F7;--blue:#3B82F6;--teal:#14B8A6;--yellow:#FCD34D;--green:#22C55E;--red:#F43F5E;--orange:#FB923C;--bg:#FFF5FB;--surface:#FFFFFF;--surface2:#FDF0F8;--border:#F0D6EB;--text:#2D1B47;--muted:#9B7BB8;--radius:18px;--radius-sm:10px;--grad:linear-gradient(135deg,#FF6B9D 0%,#A855F7 50%,#3B82F6 100%)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Nunito',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;font-size:14px}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(circle at 10% 20%,rgba(255,107,157,.08) 0%,transparent 40%),radial-gradient(circle at 90% 10%,rgba(168,85,247,.07) 0%,transparent 40%),radial-gradient(circle at 80% 80%,rgba(59,130,246,.06) 0%,transparent 40%),radial-gradient(circle at 20% 90%,rgba(20,184,166,.06) 0%,transparent 40%)}
#pin-screen{position:fixed;inset:0;z-index:999;background:var(--grad);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px;padding:24px}
.pin-card{background:#fff;border-radius:24px;padding:32px 28px;width:100%;max-width:340px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2)}
.pin-logo{font-family:'Baloo 2',cursive;font-size:28px;font-weight:800;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
.pin-sub{font-size:12px;color:var(--muted);font-weight:700;margin-bottom:24px}
.pin-dots{display:flex;gap:12px;justify-content:center;margin-bottom:20px}
.pin-dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--border);transition:all .2s}
.pin-dot.filled{background:var(--purple);border-color:var(--purple)}
.pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.pin-btn{padding:16px;border:2px solid var(--border);border-radius:var(--radius-sm);background:#fff;font-family:'Baloo 2',cursive;font-size:20px;font-weight:800;cursor:pointer;transition:all .15s;color:var(--text)}
.pin-btn:active{background:var(--surface2);border-color:var(--purple);color:var(--purple);transform:scale(.96)}
.pin-del{background:var(--surface2);color:var(--red);font-size:16px}
.pin-enter{background:var(--grad);color:#fff;border:none;font-size:14px}
.pin-error{color:var(--red);font-size:12px;font-weight:800;min-height:18px;margin-top:-8px}
.pin-shake{animation:shake .3s}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
#loading-overlay{position:fixed;inset:0;z-index:500;background:rgba(255,245,251,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
.spinner{width:36px;height:36px;border:4px solid var(--border);border-top-color:var(--purple);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-txt{font-size:13px;font-weight:800;color:var(--muted)}
#sync-bar{position:fixed;top:0;left:0;right:0;height:3px;background:var(--grad);transform:scaleX(0);transform-origin:left;transition:transform .3s;z-index:200}
#sync-status{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--surface);border:2px solid var(--border);border-radius:30px;padding:8px 16px;font-size:12px;font-weight:800;color:var(--muted);box-shadow:0 4px 16px rgba(0,0,0,.1);opacity:0;transition:opacity .3s;z-index:300;pointer-events:none}
#sync-status.show{opacity:1}
.header{background:var(--grad);padding:0 16px;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:100;box-shadow:0 4px 20px rgba(168,85,247,.25);height:56px}
.logo-wrap{display:flex;flex-direction:column}
.logo{font-family:'Baloo 2',cursive;font-size:20px;font-weight:800;color:#fff;line-height:1}
.logo-sub{font-size:9px;color:rgba(255,255,255,.8);font-weight:700;letter-spacing:2px;text-transform:uppercase}
.header-stats{display:flex;gap:8px;margin-left:auto;align-items:center}
.hstat{text-align:center;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:4px 10px}
.hstat-label{font-size:9px;color:rgba(255,255,255,.75);font-weight:800;text-transform:uppercase;letter-spacing:.5px}
.hstat-val{font-size:13px;font-weight:900;color:#fff;font-family:'JetBrains Mono',monospace;line-height:1.2}
.header-sync{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;transition:all .2s;flex-shrink:0}
.header-sync:hover{background:rgba(255,255,255,.35)}
.header-sync.spinning{animation:spin .8s linear infinite}
.stok-alert{background:linear-gradient(135deg,#FFF0E0,#FFF9C4);border:2px solid var(--orange);border-radius:var(--radius);padding:12px 16px;margin-bottom:14px;display:flex;align-items:center;gap:10px;cursor:pointer}
.tabs{display:flex;gap:4px;padding:10px 16px;background:var(--surface);border-bottom:2px solid var(--border);overflow-x:auto;position:sticky;top:56px;z-index:99;box-shadow:0 2px 12px rgba(168,85,247,.08)}
.tab{padding:8px 16px;cursor:pointer;font-weight:800;font-size:12px;border-radius:30px;white-space:nowrap;transition:all .2s;color:var(--muted);border:2px solid transparent;display:flex;align-items:center;gap:5px}
.tab:hover{background:var(--surface2);color:var(--purple)}
.tab.active{background:var(--grad);color:#fff;box-shadow:0 4px 12px rgba(168,85,247,.3)}
.page{display:none;padding:16px;max-width:920px;margin:0 auto;position:relative;z-index:1}
.page.active{display:block}
.card{background:var(--surface);border:2px solid var(--border);border-radius:var(--radius);padding:18px;margin-bottom:14px;box-shadow:0 2px 16px rgba(168,85,247,.06)}
.card-title{font-family:'Baloo 2',cursive;font-size:15px;font-weight:800;color:var(--purple);margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.pill{background:var(--grad);color:#fff;font-size:10px;font-weight:800;padding:2px 10px;border-radius:20px;margin-left:auto}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.form-grid.three{grid-template-columns:1fr 1fr 1fr}
.form-grid.four{grid-template-columns:1fr 1fr 1fr 1fr}
.form-group{display:flex;flex-direction:column;gap:5px}
.form-group.full{grid-column:1/-1}
label{font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.6px}
input,select{background:#FBF5FF;border:2px solid var(--border);border-radius:var(--radius-sm);color:var(--text);padding:9px 12px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:600;outline:none;transition:all .2s;width:100%}
input:focus,select:focus{border-color:var(--purple);background:#fff;box-shadow:0 0 0 3px rgba(168,85,247,.12)}
input.highlight{border-color:var(--purple);background:#F3E8FF}
select option{background:#fff}
.btn{padding:9px 18px;border:none;border-radius:30px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:var(--grad);color:#fff;box-shadow:0 4px 14px rgba(168,85,247,.35)}
.btn-primary:hover{transform:translateY(-2px)}
.btn-success{background:linear-gradient(135deg,var(--teal),var(--green));color:#fff}
.btn-success:hover{transform:translateY(-2px)}
.btn-ghost{background:var(--surface2);color:var(--purple);border:2px solid var(--border);font-weight:800}
.btn-ghost:hover{border-color:var(--purple);background:#fff}
.btn-danger{background:transparent;color:var(--red);border:2px solid #FFE4E9;padding:6px 10px;font-size:12px;border-radius:8px}
.btn-danger:hover{background:var(--red);color:#fff}
.btn-warn{background:linear-gradient(135deg,var(--orange),var(--yellow));color:#fff}
.btn-teal{background:linear-gradient(135deg,var(--teal),var(--blue));color:#fff}
.btn-sm{padding:6px 12px;font-size:12px}
.table-wrap{overflow-x:auto;border-radius:var(--radius-sm)}
table{width:100%;border-collapse:collapse}
th{text-align:left;padding:10px 12px;font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;background:var(--surface2);border-bottom:2px solid var(--border)}
td{padding:10px 12px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#FFF5FB}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800}
.badge-pink{background:#FFE4F0;color:var(--pink)}.badge-purple{background:#F3E8FF;color:var(--purple)}
.badge-blue{background:#DBEAFE;color:var(--blue)}.badge-green{background:#DCFCE7;color:var(--green)}
.badge-red{background:#FFE4E9;color:var(--red)}.badge-orange{background:#FFF0E0;color:var(--orange)}
.badge-teal{background:#CCFBF1;color:var(--teal)}.badge-yellow{background:#FEF9C3;color:#92400E}
.stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin-bottom:14px}
.stat-card{background:var(--surface);border:2px solid var(--border);border-radius:var(--radius);padding:14px 16px;position:relative;overflow:hidden}
.stat-card::before{content:'';position:absolute;top:-20px;right:-20px;width:70px;height:70px;border-radius:50%;opacity:.12}
.stat-card.pink::before{background:var(--pink)}.stat-card.purple::before{background:var(--purple)}
.stat-card.green::before{background:var(--green)}.stat-card.blue::before{background:var(--blue)}
.stat-card.teal::before{background:var(--teal)}.stat-card.orange::before{background:var(--orange)}
.stat-label{font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px}
.stat-value{font-size:17px;font-weight:900;font-family:'JetBrains Mono',monospace}
.stat-value.pink{color:var(--pink)}.stat-value.purple{color:var(--purple)}.stat-value.green{color:var(--green)}
.stat-value.blue{color:var(--blue)}.stat-value.teal{color:var(--teal)}.stat-value.red{color:var(--red)}.stat-value.orange{color:var(--orange)}
.stat-sub{font-size:11px;color:var(--muted);margin-top:4px;font-weight:600}
/* PRICE RESULT */
.price-result{background:linear-gradient(135deg,#FFF0FA,#F3E8FF);border:2px solid #E8CAFF;border-radius:var(--radius);padding:16px 18px;margin-top:12px}
.pr-label{font-size:11px;color:var(--muted);font-weight:800;margin-bottom:4px}
.pr-value{font-size:22px;font-weight:900;color:var(--purple);font-family:'JetBrains Mono',monospace}
.pr-row{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px}
.price-breakdown{display:flex;gap:14px;flex-wrap:wrap}
.piv{font-family:'JetBrains Mono';font-size:13px;font-weight:700}
/* HARGA JUAL MANUAL */
.hj-manual-box{background:#F0FDF4;border:2px solid var(--green);border-radius:var(--radius-sm);padding:12px 14px;margin-top:10px}
.hj-manual-box label{color:var(--green)}
.hj-manual-box input{border-color:var(--green);background:#fff;font-size:16px;font-weight:900;color:var(--purple);font-family:'JetBrains Mono',monospace}
/* SELL ROWS */
.sell-row{background:#FBF5FF;border:2px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px;padding:10px 12px}
.sell-row-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.sell-row-top select{flex:2;min-width:140px}
.sell-row-top .qty-input{width:72px}
.sell-row-bottom{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px;padding-top:8px;border-top:1px dashed var(--border)}
.sell-row-bottom .field-group{display:flex;flex-direction:column;gap:3px}
.sell-row-bottom label{font-size:10px}
.sell-row-bottom input{padding:6px 10px;font-size:13px}
.row-subtotal{font-family:'JetBrains Mono';font-size:12px;font-weight:700;color:var(--green);text-align:right}
.row-laba-preview{font-size:11px;color:var(--muted);font-weight:700;text-align:right;margin-top:2px}
/* PAYMENT */
.pay-btns{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.pay-btn{flex:1;min-width:100px;padding:10px 14px;border:2px solid var(--border);border-radius:var(--radius-sm);background:#fff;cursor:pointer;font-family:'Nunito';font-weight:800;font-size:13px;color:var(--muted);transition:all .2s;text-align:center}
.pay-btn.active-shopee{border-color:var(--orange);background:#FFF0E0;color:var(--orange)}
.pay-btn.active-split{border-color:var(--blue);background:#DBEAFE;color:var(--blue)}
.pay-btn.active-cash{border-color:var(--green);background:#DCFCE7;color:var(--green)}
.split-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.pay-box{background:#fff;border:2px solid var(--border);border-radius:var(--radius-sm);padding:12px}
.pay-box.shopee{border-color:var(--orange)}.pay-box.cash{border-color:var(--green)}
.pay-box-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px}
.pay-box.shopee .pay-box-label{color:var(--orange)}.pay-box.cash .pay-box-label{color:var(--green)}
.pay-box input{width:100%}
.total-bar{background:linear-gradient(135deg,#FFF0FA,#EFF6FF);border:2px solid var(--border);border-radius:var(--radius);padding:14px 18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:14px}
.t-items{color:var(--muted);font-size:12px;font-weight:700}
.t-laba{font-size:12px;color:var(--green);font-weight:800;margin-top:2px}
.t-admin{font-size:11px;color:var(--orange);font-weight:700;margin-top:2px}
.t-amount{font-size:24px;font-weight:900;color:var(--purple);font-family:'JetBrains Mono'}
/* CAT CHIPS */
.kel-cat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-top:8px}
.cat-chip{padding:8px 10px;border:2px solid var(--border);border-radius:var(--radius-sm);text-align:center;cursor:pointer;font-size:12px;font-weight:800;transition:all .2s;background:#fff;color:var(--muted)}
.cat-chip.active{transform:scale(1.04)}
.cat-chip.c1.active{border-color:var(--purple);background:#F3E8FF;color:var(--purple)}
.cat-chip.c2.active{border-color:var(--orange);background:#FFF0E0;color:var(--orange)}
.cat-chip.c3.active{border-color:var(--pink);background:#FFE4F0;color:var(--pink)}
.cat-chip.c4.active{border-color:var(--blue);background:#DBEAFE;color:var(--blue)}
.cat-chip.c5.active{border-color:var(--green);background:#DCFCE7;color:var(--green)}
/* FILTER */
.filter-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
.filter-bar input,.filter-bar select{padding:7px 12px;font-size:12px;width:auto}
.filter-chip{padding:6px 14px;border:2px solid var(--border);border-radius:20px;font-size:12px;font-weight:800;cursor:pointer;background:#fff;color:var(--muted);transition:all .2s}
.filter-chip.active{background:var(--grad);color:#fff;border-color:transparent;box-shadow:0 3px 10px rgba(168,85,247,.25)}
.range-filter{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.range-filter input{max-width:140px;width:140px}
.range-filter span{font-size:12px;font-weight:800;color:var(--muted)}
/* PAGINATION */
.pagination{display:flex;gap:6px;align-items:center;justify-content:center;margin-top:14px;flex-wrap:wrap}
.pg-btn{padding:6px 12px;border:2px solid var(--border);border-radius:8px;background:#fff;font-family:'Nunito';font-size:12px;font-weight:800;cursor:pointer;color:var(--muted);transition:all .2s}
.pg-btn:hover{border-color:var(--purple);color:var(--purple)}
.pg-btn.active{background:var(--grad);color:#fff;border-color:transparent}
.pg-btn:disabled{opacity:.4;cursor:default}
/* SEARCH */
.search-box{position:relative;margin-bottom:14px}
.search-box input{padding-left:36px;background:#fff;border:2px solid var(--border)}
.search-box input:focus{border-color:var(--purple)}
.search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;pointer-events:none}
/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(45,27,71,.5);z-index:800;display:flex;align-items:center;justify-content:center;padding:16px}
.modal{background:#fff;border-radius:var(--radius);padding:24px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.2)}
.modal-title{font-family:'Baloo 2',cursive;font-size:18px;font-weight:800;color:var(--purple);margin-bottom:16px}
/* ADMIN SHOPEE INFO in transaksi */
.admin-info{font-size:11px;color:var(--orange);font-weight:800;margin-top:3px}
/* MISC */
.divider{height:2px;background:linear-gradient(90deg,var(--pink),var(--purple),var(--blue));border-radius:2px;margin:14px 0;opacity:.2}
.toast{position:fixed;bottom:20px;right:20px;padding:12px 18px;border-radius:var(--radius-sm);font-weight:800;font-size:13px;font-family:'Nunito';transform:translateY(80px);opacity:0;transition:all .3s;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,.15);color:#fff}
.toast.show{transform:translateY(0);opacity:1}
.empty{text-align:center;padding:36px 20px;color:var(--muted)}.empty .icon{font-size:36px;margin-bottom:10px}.empty p{font-size:13px;font-weight:700}
.prog-bar{background:var(--border);border-radius:6px;height:8px;overflow:hidden;margin-top:5px}
.prog-fill{height:100%;border-radius:6px;transition:width .5s}
.mono{font-family:'JetBrains Mono',monospace;font-weight:700}
.mt8{margin-top:8px}.mt12{margin-top:12px}.mt16{margin-top:16px}
.flex-end{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}
.flex-between{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
.fw9{font-weight:900}
@media(max-width:640px){
  .form-grid,.form-grid.three,.form-grid.four{grid-template-columns:1fr 1fr}
  .sell-row-bottom{grid-template-columns:1fr 1fr}
  .split-grid{grid-template-columns:1fr}
  .stats-row{grid-template-columns:1fr 1fr}
  .hstat:nth-child(n+3){display:none}
  .range-filter input{max-width:120px;width:120px}
}
@media(max-width:400px){
  .form-grid,.form-grid.three,.form-grid.four{grid-template-columns:1fr}
  .sell-row-bottom{grid-template-columns:1fr}
}
</style>
</head>
<body>

<!-- PIN -->
<div id="pin-screen">
  <div class="pin-card">
    <div class="pin-logo">✨ TRIXY.LOOKS</div>
    <div class="pin-sub">Masukkan PIN untuk melanjutkan</div>
    <div class="pin-dots" id="pin-dots">
      <div class="pin-dot" id="dot-0"></div><div class="pin-dot" id="dot-1"></div>
      <div class="pin-dot" id="dot-2"></div><div class="pin-dot" id="dot-3"></div>
    </div>
    <div class="pin-error" id="pin-error"></div>
    <div class="pin-grid">
      <div class="pin-btn" onclick="pinInput('1')">1</div><div class="pin-btn" onclick="pinInput('2')">2</div><div class="pin-btn" onclick="pinInput('3')">3</div>
      <div class="pin-btn" onclick="pinInput('4')">4</div><div class="pin-btn" onclick="pinInput('5')">5</div><div class="pin-btn" onclick="pinInput('6')">6</div>
      <div class="pin-btn" onclick="pinInput('7')">7</div><div class="pin-btn" onclick="pinInput('8')">8</div><div class="pin-btn" onclick="pinInput('9')">9</div>
      <div class="pin-btn pin-del" onclick="pinDelete()">⌫</div><div class="pin-btn" onclick="pinInput('0')">0</div><div class="pin-btn pin-enter" onclick="pinSubmit()">✓</div>
    </div>
  </div>
</div>

<div id="loading-overlay" style="display:none"><div class="spinner"></div><div class="loading-txt" id="loading-txt">Memuat...</div></div>
<div id="sync-bar"></div>
<div id="sync-status"></div>

<!-- MODAL EDIT TRANSAKSI -->
<div class="modal-overlay" id="edit-modal" style="display:none">
  <div class="modal">
    <div class="modal-title">✏️ Edit Transaksi Penjualan</div>
    <div class="form-grid">
      <div class="form-group"><label>Tanggal</label><input type="date" id="em-tanggal"></div>
      <div class="form-group"><label>No. Order</label><input type="text" id="em-order" placeholder="SHP-..."></div>
    </div>
    <div style="margin:12px 0 8px;font-size:12px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Produk</div>
    <div id="em-items-container"></div>
    <button class="btn btn-ghost btn-sm mt8" onclick="addEditRow()">+ Tambah Produk</button>
    <div class="divider"></div>
    <div style="margin-bottom:8px;font-size:12px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Metode Bayar</div>
    <div class="pay-btns">
      <div class="pay-btn" id="em-pb-shopee" onclick="setEditPayMode('shopee')">🛍️ Full Shopee</div>
      <div class="pay-btn" id="em-pb-split" onclick="setEditPayMode('split')">⚡ Split</div>
      <div class="pay-btn" id="em-pb-cash" onclick="setEditPayMode('cash')">💵 Full Tunai</div>
    </div>
    <div id="em-pay-shopee-box" style="display:none;background:#FFF0E0;border:2px solid var(--orange);border-radius:var(--radius-sm);padding:10px"><span style="font-size:13px;font-weight:800;color:var(--orange)">🛍️ Full Shopee</span></div>
    <div id="em-pay-split-box" class="split-grid" style="display:none">
      <div class="pay-box shopee"><div class="pay-box-label">🛍️ Via Shopee (Rp)</div><input type="number" id="em-split-shopee" placeholder="0" oninput="syncEditSplitCash()"></div>
      <div class="pay-box cash"><div class="pay-box-label">💵 Tunai (Rp)</div><input type="number" id="em-split-cash" placeholder="0" readonly style="background:#f0fff4;font-weight:900;color:var(--green)"></div>
    </div>
    <div id="em-pay-cash-box" style="display:none;background:#DCFCE7;border:2px solid var(--green);border-radius:var(--radius-sm);padding:10px"><span style="font-size:13px;font-weight:800;color:var(--green)">💵 Full Tunai</span></div>
    <div class="total-bar" style="margin-top:12px">
      <div><div class="t-items" id="em-items-count">0 item</div><div class="t-admin" id="em-admin-preview"></div></div>
      <div style="text-align:right"><div style="font-size:11px;color:var(--muted);font-weight:700">Total</div><div class="t-amount" id="em-total">Rp 0</div></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="closeEditModal()">Batal</button>
      <button class="btn btn-primary" onclick="simpanEditTransaksi()">💾 Simpan</button>
    </div>
  </div>
</div>

<!-- APP -->
<div id="app" style="display:none">
  <div class="header">
    <div class="logo-wrap"><div class="logo">✨ TRIXY.LOOKS</div><div class="logo-sub">Shopee Store Manager</div></div>
    <div class="header-stats">
      <div class="hstat"><div class="hstat-label">Hari Ini</div><div class="hstat-val" id="hs-hari">Rp 0</div></div>
      <div class="hstat"><div class="hstat-label">Laba Bulan</div><div class="hstat-val" id="hs-laba">Rp 0</div></div>
    </div>
    <div class="header-sync" id="sync-btn" onclick="syncAll()">🔄</div>
  </div>
  <div class="tabs">
    <div class="tab active" onclick="switchTab('produk',this)">📦 Produk</div>
    <div class="tab" onclick="switchTab('jual',this)">🛒 Penjualan</div>
    <div class="tab" onclick="switchTab('pengeluaran',this)">💸 Pengeluaran</div>
    <div class="tab" onclick="switchTab('transaksi',this)">📋 Transaksi</div>
    <div class="tab" onclick="switchTab('analitik',this)">📊 Analitik</div>
  </div>

  <!-- TAB PRODUK -->
  <div class="page active" id="page-produk">
    <div id="stok-alert-box" style="display:none" class="stok-alert" onclick="switchTab('produk',document.querySelector('.tab'))">
      <span style="font-size:20px">⚠️</span>
      <div><div style="font-size:13px;font-weight:800;color:var(--orange)" id="stok-alert-txt"></div><div style="font-size:12px;color:var(--text);font-weight:600;margin-top:4px" id="stok-alert-list"></div></div>
    </div>
    <div class="card">
      <div class="card-title">📦 Tambah / Edit Produk</div>
      <div class="form-grid">
        <div class="form-group full"><label>Nama Produk</label><input type="text" id="p-nama" placeholder="Contoh: Dress Floral Pink S"></div>
        <div class="form-group"><label>Harga Modal (Rp)</label><input type="number" id="p-modal" placeholder="45000" oninput="hitungHarga()"></div>
        <div class="form-group"><label>Ongkir / Packing (Rp)</label><input type="number" id="p-ongkir" placeholder="3000" oninput="hitungHarga()"></div>
        <div class="form-group"><label>Biaya Lain (Rp)</label><input type="number" id="p-biaya" placeholder="0" oninput="hitungHarga()"></div>
        <div class="form-group"><label>Admin Shopee Default (%) — acuan saja</label><input type="number" id="p-admin" placeholder="2" step="0.1" value="2" oninput="hitungHarga()"></div>
        <div class="form-group"><label>Target Margin (Rp)</label><input type="number" id="p-margin" placeholder="20000" oninput="hitungHarga()"></div>
        <div class="form-group"><label>Stok Awal</label><input type="number" id="p-stok" placeholder="50"></div>
        <div class="form-group"><label>Batas Stok Minimum</label><input type="number" id="p-minstok" placeholder="5" value="5"></div>
      </div>

      <!-- HARGA JUAL DISARANKAN -->
      <div id="price-result-box" class="price-result" style="display:none">
        <div class="pr-row">
          <div>
            <div class="pr-label">💡 Harga Jual Disarankan (berdasarkan margin & admin default)</div>
            <div class="pr-value" id="r-harga-jual">Rp 0</div>
            <div style="font-size:11px;color:var(--muted);margin-top:3px" id="r-margin-pct"></div>
          </div>
          <div class="price-breakdown">
            <div style="text-align:center"><div class="pr-label">Modal Total</div><div class="piv" style="color:var(--purple)" id="r-modal-total">Rp 0</div></div>
            <div style="text-align:center"><div class="pr-label">Est. Admin</div><div class="piv" style="color:var(--red)" id="r-admin-rp">Rp 0</div></div>
            <div style="text-align:center"><div class="pr-label">Est. Untung</div><div class="piv" style="color:var(--green)" id="r-untung">Rp 0</div></div>
          </div>
        </div>
        <!-- INPUT HARGA JUAL MANUAL -->
        <div class="hj-manual-box" style="width:100%">
          <label>✏️ Harga Jual Final (yang disimpan — isi manual atau sesuai disarankan)</label>
          <input type="number" id="p-hargajual" placeholder="Isi harga jual final..." class="highlight" oninput="updateManualPreview()">
          <div style="font-size:11px;color:var(--muted);margin-top:4px" id="manual-preview"></div>
        </div>
      </div>

      <div class="mt16 flex-end">
        <button class="btn btn-ghost" onclick="resetFormProduk()">Reset</button>
        <button class="btn btn-ghost btn-sm" onclick="pakaiDisarankan()" id="btn-pakai-disarankan" style="display:none">Pakai Harga Disarankan</button>
        <button class="btn btn-primary" onclick="tambahProduk()">✨ Simpan Produk</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🗂️ Daftar Produk <span class="pill" id="jumlah-produk">0 produk</span></div>
      <div class="search-box"><span class="search-icon">🔍</span><input type="text" id="produk-search" placeholder="Cari nama produk..." oninput="produkPage=1;renderProduk()"></div>
      <div class="table-wrap">
        <table><thead><tr><th>Nama Produk</th><th>Modal</th><th>Target Margin</th><th>Harga Jual Final</th><th>Stok</th><th>Aksi</th></tr></thead>
          <tbody id="tbody-produk"></tbody>
        </table>
      </div>
      <div id="produk-pagination" class="pagination"></div>
    </div>
  </div>

  <!-- TAB PENJUALAN -->
  <div class="page" id="page-jual">
    <div class="card">
      <div class="card-title">🛒 Input Penjualan Baru</div>
      <div class="form-grid">
        <div class="form-group"><label>Tanggal</label><input type="date" id="j-tanggal"></div>
        <div class="form-group"><label>No. Order (opsional)</label><input type="text" id="j-order" placeholder="SHP-2026-XXXXX"></div>
      </div>
      <div class="divider"></div>
      <div class="card-title" style="margin-bottom:8px;font-size:13px">🛍️ Produk — isi Admin Shopee % per produk jika berbeda</div>
      <div id="sell-items-container"></div>
      <button class="btn btn-ghost btn-sm mt8" onclick="tambahBarisProduk()">+ Tambah Produk</button>
      <div class="divider"></div>
      <div class="card-title" style="margin-bottom:10px;font-size:13px">💳 Metode Pembayaran</div>
      <div class="pay-btns">
        <div class="pay-btn" id="pb-shopee" onclick="setPayMode('shopee')">🛍️ Full Shopee</div>
        <div class="pay-btn" id="pb-split" onclick="setPayMode('split')">⚡ Split</div>
        <div class="pay-btn" id="pb-cash" onclick="setPayMode('cash')">💵 Full Tunai</div>
      </div>
      <div id="pay-shopee-box" style="display:none;background:#FFF0E0;border:2px solid var(--orange);border-radius:var(--radius-sm);padding:12px">
        <span style="font-size:13px;font-weight:800;color:var(--orange)">🛍️ Seluruh pembayaran via Shopee — Admin dihitung dari total</span>
      </div>
      <div id="pay-split-box" class="split-grid" style="display:none">
        <div class="pay-box shopee"><div class="pay-box-label">🛍️ Via Shopee (Rp)</div><input type="number" id="split-shopee" placeholder="0" oninput="onSplitShopeeInput()"></div>
        <div class="pay-box cash"><div class="pay-box-label">💵 Tunai / Transfer (Rp)</div><input type="number" id="split-cash" placeholder="0" readonly style="background:#f0fff4;font-weight:900;color:var(--green)"></div>
      </div>
      <div id="split-warning" style="display:none;color:var(--red);font-size:12px;font-weight:800;margin-top:6px">⚠️ Nominal Shopee melebihi total!</div>
      <div id="pay-cash-box" style="display:none;background:#DCFCE7;border:2px solid var(--green);border-radius:var(--radius-sm);padding:12px">
        <span style="font-size:13px;font-weight:800;color:var(--green)">💵 Full Tunai / Transfer — Tidak ada biaya admin Shopee</span>
      </div>
      <div class="total-bar">
        <div>
          <div class="t-items" id="j-items-summary">0 item</div>
          <div class="t-admin" id="j-admin-preview"></div>
          <div class="t-laba" id="j-profit-preview">Estimasi laba: Rp 0</div>
        </div>
        <div style="text-align:right"><div style="font-size:11px;color:var(--muted);font-weight:700">Total Dibayar</div><div class="t-amount" id="j-total">Rp 0</div></div>
      </div>
      <button class="btn btn-success mt12" style="width:100%;justify-content:center;padding:14px;font-size:15px" onclick="simpanTransaksi()">✅ Simpan Transaksi</button>
    </div>
  </div>

  <!-- TAB PENGELUARAN -->
  <div class="page" id="page-pengeluaran">
    <div class="card">
      <div class="card-title">💸 Catat Pengeluaran</div>
      <div class="form-grid">
        <div class="form-group"><label>Tanggal</label><input type="date" id="k-tanggal"></div>
        <div class="form-group"><label>Jumlah (Rp)</label><input type="number" id="k-jumlah" placeholder="150000"></div>
        <div class="form-group full"><label>Keterangan</label><input type="text" id="k-ket" placeholder="Contoh: Beli stok dress 20 pcs"></div>
        <div class="form-group full">
          <label>Kategori</label>
          <div class="kel-cat-grid">
            <div class="cat-chip c1" onclick="pilihKat(this,'Modal Stok')">📦 Modal Stok</div>
            <div class="cat-chip c2" onclick="pilihKat(this,'Packing & Ongkir')">📮 Packing & Ongkir</div>
            <div class="cat-chip c3" onclick="pilihKat(this,'Iklan Shopee')">📣 Iklan Shopee</div>
            <div class="cat-chip c4" onclick="pilihKat(this,'Gaji / Upah')">👤 Gaji / Upah</div>
            <div class="cat-chip c5" onclick="pilihKat(this,'Operasional Lain')">🔧 Operasional Lain</div>
          </div>
          <input type="hidden" id="k-kategori" value="">
        </div>
        <div class="form-group full"><label>Catatan Tambahan</label><input type="text" id="k-catatan" placeholder="Opsional"></div>
      </div>
      <div class="mt16 flex-end">
        <button class="btn btn-ghost" onclick="resetFormKel()">Reset</button>
        <button class="btn btn-warn" onclick="simpanPengeluaran()">💸 Simpan Pengeluaran</button>
      </div>
    </div>
    <div class="card">
      <div class="card-title">📋 Riwayat Pengeluaran <span class="pill" id="kel-total-badge">Rp 0</span></div>
      <div class="filter-bar">
        <div class="range-filter"><input type="date" id="kel-dari" oninput="renderPengeluaran()"><span>—</span><input type="date" id="kel-sampai" oninput="renderPengeluaran()"></div>
        <button class="btn btn-ghost btn-sm" onclick="clearKelFilter()">Semua</button>
      </div>
      <div class="table-wrap">
        <table><thead><tr><th>Tanggal</th><th>Kategori</th><th>Keterangan</th><th>Jumlah</th><th>Aksi</th></tr></thead>
          <tbody id="tbody-pengeluaran"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- TAB TRANSAKSI -->
  <div class="page" id="page-transaksi">
    <div class="stats-row">
      <div class="stat-card pink"><div class="stat-label">Total Pemasukan</div><div class="stat-value pink mono" id="st-pemasukan">Rp 0</div></div>
      <div class="stat-card orange"><div class="stat-label">Total Admin Shopee</div><div class="stat-value orange mono" id="st-admin">Rp 0</div></div>
      <div class="stat-card purple"><div class="stat-label">Total Pengeluaran</div><div class="stat-value purple mono" id="st-pengeluaran">Rp 0</div></div>
      <div class="stat-card green"><div class="stat-label">Laba Bersih</div><div class="stat-value green mono" id="st-laba-bersih">Rp 0</div></div>
    </div>
    <div class="card">
      <div class="flex-between" style="margin-bottom:14px">
        <div class="card-title" style="margin-bottom:0">📋 Riwayat Transaksi</div>
        <button class="btn btn-teal btn-sm" onclick="exportCSV()">⬇️ Export CSV</button>
      </div>
      <div class="filter-bar">
        <div class="range-filter"><input type="date" id="trx-dari" oninput="renderTransaksi()"><span>—</span><input type="date" id="trx-sampai" oninput="renderTransaksi()"></div>
        <div class="filter-chip active" onclick="setTrxFilter('all',this)">Semua</div>
        <div class="filter-chip" onclick="setTrxFilter('pemasukan',this)">💰 Pemasukan</div>
        <div class="filter-chip" onclick="setTrxFilter('pengeluaran',this)">💸 Pengeluaran</div>
        <button class="btn btn-ghost btn-sm" onclick="clearTrxFilter()">Reset</button>
      </div>
      <div class="table-wrap">
        <table><thead><tr><th>Tanggal</th><th>Jenis</th><th>Detail</th><th>Total</th><th>Admin Shopee</th><th>Laba</th><th>Bayar</th><th>Aksi</th></tr></thead>
          <tbody id="tbody-transaksi"></tbody>
        </table>
      </div>
      <div id="trx-pagination" class="pagination"></div>
    </div>
  </div>

  <!-- TAB ANALITIK -->
  <div class="page" id="page-analitik">
    <div class="card" style="padding:14px 16px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:800;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.6px">🔎 Filter Periode</div>
      <div class="filter-bar" style="margin-bottom:0">
        <div class="range-filter"><input type="date" id="an-dari" oninput="renderAnalitik()"><span>—</span><input type="date" id="an-sampai" oninput="renderAnalitik()"></div>
        <div class="filter-chip active" onclick="setAnFilter('all',this)">Semua</div>
        <div class="filter-chip" onclick="setAnFilter('pemasukan',this)">💰 Pemasukan</div>
        <div class="filter-chip" onclick="setAnFilter('pengeluaran',this)">💸 Pengeluaran</div>
        <button class="btn btn-ghost btn-sm" onclick="clearAnFilter()">Reset</button>
      </div>
    </div>
    <div class="stats-row">
      <div class="stat-card pink"><div class="stat-label">Penjualan</div><div class="stat-value pink mono" id="an-jual">Rp 0</div><div class="stat-sub" id="an-trx">0 trx</div></div>
      <div class="stat-card orange"><div class="stat-label">Admin Shopee</div><div class="stat-value orange mono" id="an-admin">Rp 0</div></div>
      <div class="stat-card purple"><div class="stat-label">Pengeluaran</div><div class="stat-value purple mono" id="an-kel">Rp 0</div></div>
      <div class="stat-card green"><div class="stat-label">Laba Bersih</div><div class="stat-value green mono" id="an-laba">Rp 0</div></div>
    </div>
    <div class="card">
      <div class="card-title">📈 Grafik Penjualan & Pengeluaran</div>
      <div style="padding:8px 0"><canvas id="bar-chart" height="160"></canvas></div>
      <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap">
        <span style="font-size:12px;font-weight:800;color:var(--pink)">█ Penjualan</span>
        <span style="font-size:12px;font-weight:800;color:var(--orange)">█ Pengeluaran</span>
      </div>
    </div>
    <div class="card"><div class="card-title">🏆 Produk Terlaris</div><div id="top-produk-list"><div class="empty"><div class="icon">📊</div><p>Belum ada data</p></div></div></div>
    <div class="card">
      <div class="card-title">💳 Metode Bayar</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div style="text-align:center"><div class="stat-label">Full Shopee</div><div class="stat-value orange mono" id="pay-shopee-t">Rp 0</div></div>
        <div style="text-align:center"><div class="stat-label">Split</div><div class="stat-value blue mono" id="pay-split-t">Rp 0</div></div>
        <div style="text-align:center"><div class="stat-label">Full Tunai</div><div class="stat-value green mono" id="pay-cash-t">Rp 0</div></div>
      </div>
    </div>
    <div class="card"><div class="card-title">💸 Pengeluaran per Kategori</div><div id="kel-cat-breakdown"><div class="empty"><div class="icon">💸</div><p>Belum ada data</p></div></div></div>
  </div>
</div>
<div class="toast" id="toast"></div>

<script>
const BASE_URL = window.location.origin;
let produk=[],transaksiJual=[],transaksiKel=[];
let PIN='',payMode='shopee',editProdukId=null;
let selectedKatEl=null,selectedKat='';
let trxFilterMode='all',anFilterMode='all';
let editTrxId=null,editPayMode='shopee';
const PRODUK_PER_PAGE=10,TRX_PER_PAGE=20;
let produkPage=1,trxPage=1;

// ── PIN ──────────────────────────────────────────
let pinBuf='';
function pinInput(d){if(pinBuf.length>=4)return;pinBuf+=d;updDots();if(pinBuf.length===4)setTimeout(pinSubmit,150)}
function pinDelete(){pinBuf=pinBuf.slice(0,-1);updDots()}
function updDots(){for(let i=0;i<4;i++)document.getElementById('dot-'+i).classList.toggle('filled',i<pinBuf.length)}
async function pinSubmit(){
  if(pinBuf.length<4){showPinErr('Masukkan 4 digit PIN');return}
  PIN=pinBuf;showLoad('Memverifikasi...');
  try{
    const r=await fetch(BASE_URL+'/api/verify-pin',{headers:{'X-PIN':PIN}});
    if(r.ok){document.getElementById('pin-screen').style.display='none';await loadAll();document.getElementById('app').style.display='block'}
    else{hideLoad();PIN='';pinBuf='';updDots();showPinErr('PIN salah, coba lagi');document.getElementById('pin-dots').classList.add('pin-shake');setTimeout(()=>document.getElementById('pin-dots').classList.remove('pin-shake'),400)}
  }catch(e){hideLoad();showPinErr('Gagal terhubung');PIN='';pinBuf='';updDots()}
}
function showPinErr(m){const e=document.getElementById('pin-error');e.textContent=m;setTimeout(()=>e.textContent='',2500)}

// ── API ──────────────────────────────────────────
async function apiGet(k){const r=await fetch(BASE_URL+'/api/'+k,{headers:{'X-PIN':PIN}});if(!r.ok)throw new Error();return r.json()}
async function apiSet(k,d){const r=await fetch(BASE_URL+'/api/'+k,{method:'POST',headers:{'Content-Type':'application/json','X-PIN':PIN},body:JSON.stringify(d)});if(!r.ok)throw new Error()}
async function loadAll(){
  showLoad('Memuat data...');
  try{[produk,transaksiJual,transaksiKel]=await Promise.all([apiGet('produk'),apiGet('jual'),apiGet('pengeluaran')]);
  renderProduk();renderPengeluaran();renderTransaksi();updHeaderStats();checkStokAlert();setSyncSt('✅ Data dimuat')}
  catch(e){setSyncSt('⚠️ Gagal memuat')}
  hideLoad();
}
async function saveData(k){
  setSyncBar(true);
  try{const d=k==='produk'?produk:k==='jual'?transaksiJual:transaksiKel;await apiSet(k,d);setSyncSt('☁️ Tersimpan')}
  catch(e){setSyncSt('⚠️ Gagal simpan');toast('Gagal simpan! Cek koneksi','red')}
  setSyncBar(false);
}
async function syncAll(){const b=document.getElementById('sync-btn');b.classList.add('spinning');await loadAll();b.classList.remove('spinning');toast('Diperbarui! 🔄','purple')}

// ── UI HELPERS ───────────────────────────────────
function showLoad(t){document.getElementById('loading-txt').textContent=t;document.getElementById('loading-overlay').style.display='flex'}
function hideLoad(){document.getElementById('loading-overlay').style.display='none'}
function setSyncBar(on){document.getElementById('sync-bar').style.transform=on?'scaleX(0.7)':'scaleX(0)'}
let sst;function setSyncSt(m){const e=document.getElementById('sync-status');e.textContent=m;e.classList.add('show');clearTimeout(sst);sst=setTimeout(()=>e.classList.remove('show'),2500)}
function rp(n){return'Rp '+Math.round(n||0).toLocaleString('id-ID')}
function rpS(n){n=Math.round(n||0);return n>=1000000?'Rp '+(n/1000000).toFixed(1)+'jt':n>=1000?'Rp '+(n/1000).toFixed(0)+'rb':'Rp '+n}
function genId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function today(){return new Date().toISOString().split('T')[0]}
function inRange(d,dari,sampai){return(!dari||d>=dari)&&(!sampai||d<=sampai)}
function toast(msg,type='pink'){const t=document.getElementById('toast');t.textContent=msg;const c={pink:'var(--pink)',green:'var(--green)',red:'var(--red)',orange:'var(--orange)',purple:'var(--purple)',teal:'var(--teal)'};t.style.background=c[type]||c.pink;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}

// ── LABA CALCULATION ─────────────────────────────
// Hitung laba per item berdasarkan mode bayar
// mode: 'shopee' | 'split' | 'cash'
// shopeeRatio: berapa proporsi dibayar shopee (0-1)
function hitungLaba(hj, modal, qty, adminPct, mode, shopeeRatio=1){
  const gross = (hj - modal) * qty;
  if(mode === 'cash') return gross; // tidak ada admin
  const totalHJ = hj * qty;
  let adminRp = 0;
  if(mode === 'shopee') adminRp = totalHJ * (adminPct/100);
  else if(mode === 'split') adminRp = totalHJ * shopeeRatio * (adminPct/100);
  return gross - adminRp;
}

function hitungAdminRp(hj, qty, adminPct, mode, shopeeRatio=1){
  if(mode === 'cash') return 0;
  const totalHJ = hj * qty;
  if(mode === 'shopee') return totalHJ * (adminPct/100);
  return totalHJ * shopeeRatio * (adminPct/100);
}

// ── HEADER STATS ─────────────────────────────────
function updHeaderStats(){
  const td=today(),tm=today().slice(0,7);
  const hJ=transaksiJual.filter(t=>t.tanggal===td).reduce((s,t)=>s+t.total,0);
  const lB=transaksiJual.filter(t=>t.tanggal.startsWith(tm)).reduce((s,t)=>s+t.laba,0)
    -transaksiKel.filter(k=>k.tanggal.startsWith(tm)).reduce((s,k)=>s+k.jumlah,0);
  document.getElementById('hs-hari').textContent=rpS(hJ);
  document.getElementById('hs-laba').textContent=rpS(lB);
}

// ── STOK ALERT ───────────────────────────────────
function checkStokAlert(){
  const low=produk.filter(p=>p.stok<=(p.minStok||5));
  const box=document.getElementById('stok-alert-box');
  if(!low.length){box.style.display='none';return}
  box.style.display='flex';
  document.getElementById('stok-alert-txt').textContent=\`⚠️ \${low.length} produk stok hampir habis!\`;
  document.getElementById('stok-alert-list').textContent=low.map(p=>p.nama+' ('+p.stok+' sisa)').join(' · ');
}

// ── TABS ─────────────────────────────────────────
function switchTab(t,el){
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  el.classList.add('active');document.getElementById('page-'+t).classList.add('active');
  if(t==='jual')initJual();
  if(t==='pengeluaran'){renderPengeluaran();document.getElementById('k-tanggal').value=today()}
  if(t==='transaksi')renderTransaksi();
  if(t==='analitik')renderAnalitik();
}

// ── PRODUK ───────────────────────────────────────
let cachedHargaDisarankan=0;

function hitungHarga(){
  const modal=parseFloat(document.getElementById('p-modal').value||0);
  const ongkir=parseFloat(document.getElementById('p-ongkir').value||0);
  const biaya=parseFloat(document.getElementById('p-biaya').value||0);
  const admin=parseFloat(document.getElementById('p-admin').value||2);
  const marginRp=parseFloat(document.getElementById('p-margin').value||0);
  if(!modal){document.getElementById('price-result-box').style.display='none';document.getElementById('btn-pakai-disarankan').style.display='none';return}
  const mt=modal+ongkir+biaya,div=1-(admin/100);
  if(div<=0)return;
  const hj=Math.ceil((mt+marginRp)/div/100)*100;
  const ar=hj*(admin/100),u=hj-mt-ar;
  cachedHargaDisarankan=hj;
  document.getElementById('price-result-box').style.display='block';
  document.getElementById('btn-pakai-disarankan').style.display='inline-flex';
  document.getElementById('r-harga-jual').textContent=rp(hj);
  document.getElementById('r-modal-total').textContent=rp(mt);
  document.getElementById('r-admin-rp').textContent=rp(ar);
  document.getElementById('r-untung').textContent=rp(u);
  document.getElementById('r-margin-pct').textContent='Estimasi margin: '+(hj>0?(u/hj*100).toFixed(1):0)+'%';
  updateManualPreview();
}

function pakaiDisarankan(){
  document.getElementById('p-hargajual').value=cachedHargaDisarankan;
  updateManualPreview();
  toast('Harga disarankan dipakai ✅','green');
}

function updateManualPreview(){
  const hj=parseFloat(document.getElementById('p-hargajual').value||0);
  const modal=parseFloat(document.getElementById('p-modal').value||0);
  const ongkir=parseFloat(document.getElementById('p-ongkir').value||0);
  const biaya=parseFloat(document.getElementById('p-biaya').value||0);
  const mt=modal+ongkir+biaya;
  if(!hj||!mt){document.getElementById('manual-preview').textContent='';return}
  const profit=hj-mt;
  const marginPct=(profit/hj*100).toFixed(1);
  document.getElementById('manual-preview').textContent=\`Modal: \${rp(mt)} → Untung kasar: \${rp(profit)} (\${marginPct}%) — belum dipotong admin Shopee saat transaksi\`;
}

async function tambahProduk(){
  const nama=document.getElementById('p-nama').value.trim();
  const modal=parseFloat(document.getElementById('p-modal').value);
  const hargaJual=parseFloat(document.getElementById('p-hargajual').value);
  if(!nama||isNaN(modal)){toast('Isi nama & harga modal!','red');return}
  if(!hargaJual||hargaJual<=0){toast('Isi Harga Jual Final!','red');return}
  const ongkir=parseFloat(document.getElementById('p-ongkir').value||0);
  const biaya=parseFloat(document.getElementById('p-biaya').value||0);
  const admin=parseFloat(document.getElementById('p-admin').value||2);
  const marginRp=parseFloat(document.getElementById('p-margin').value||0);
  const stok=parseInt(document.getElementById('p-stok').value||0);
  const minStok=parseInt(document.getElementById('p-minstok').value||5);
  const modalTotal=modal+ongkir+biaya;
  if(editProdukId){
    const i=produk.findIndex(p=>p.id===editProdukId);
    if(i>-1)produk[i]={...produk[i],nama,modal,ongkir,biaya,admin,marginRp,hargaJual,modalTotal,stok,minStok};
    editProdukId=null;
  }else{produk.push({id:genId(),nama,modal,ongkir,biaya,admin,marginRp,hargaJual,modalTotal,stok,minStok})}
  renderProduk();resetFormProduk();checkStokAlert();
  await saveData('produk');toast('Produk disimpan! 📦','pink');
}

function resetFormProduk(){
  ['p-nama','p-modal','p-ongkir','p-biaya','p-stok','p-hargajual'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('p-admin').value='2';document.getElementById('p-margin').value='';document.getElementById('p-minstok').value='5';
  document.getElementById('price-result-box').style.display='none';
  document.getElementById('btn-pakai-disarankan').style.display='none';
  document.getElementById('manual-preview').textContent='';
  editProdukId=null;cachedHargaDisarankan=0;
}

function editProduk(id){
  const p=produk.find(x=>x.id===id);if(!p)return;
  editProdukId=id;
  document.getElementById('p-nama').value=p.nama;document.getElementById('p-modal').value=p.modal;
  document.getElementById('p-ongkir').value=p.ongkir;document.getElementById('p-biaya').value=p.biaya;
  document.getElementById('p-admin').value=p.admin;document.getElementById('p-margin').value=p.marginRp||0;
  document.getElementById('p-stok').value=p.stok;document.getElementById('p-minstok').value=p.minStok||5;
  document.getElementById('p-hargajual').value=p.hargaJual;
  hitungHarga();window.scrollTo({top:0,behavior:'smooth'});toast('Mode edit aktif ✏️','purple');
}

async function hapusProduk(id){
  if(!confirm('Hapus produk ini?'))return;
  produk=produk.filter(p=>p.id!==id);renderProduk();checkStokAlert();await saveData('produk');toast('Dihapus','red');
}

function renderProduk(){
  const q=(document.getElementById('produk-search')?.value||'').toLowerCase();
  let data=produk.filter(p=>p.nama.toLowerCase().includes(q));
  document.getElementById('jumlah-produk').textContent=data.length+' produk';
  const pages=Math.ceil(data.length/PRODUK_PER_PAGE)||1;
  if(produkPage>pages)produkPage=1;
  const slice=data.slice((produkPage-1)*PRODUK_PER_PAGE,produkPage*PRODUK_PER_PAGE);
  const tbody=document.getElementById('tbody-produk');
  if(!slice.length){tbody.innerHTML=\`<tr><td colspan="6"><div class="empty"><div class="icon">📦</div><p>\${q?'Tidak ditemukan':'Belum ada produk'}</p></div></td></tr>\`;document.getElementById('produk-pagination').innerHTML='';return}
  tbody.innerHTML=slice.map(p=>\`
    <tr>
      <td><b>\${p.nama}</b><br><span style="font-size:11px;color:var(--muted)">Admin default: \${p.admin}%</span></td>
      <td class="mono">\${rp(p.modalTotal||p.modal)}</td>
      <td class="mono" style="color:var(--green)">\${rp(p.marginRp||0)}</td>
      <td class="mono fw9" style="color:var(--purple)">\${rp(p.hargaJual)}</td>
      <td><span class="badge \${p.stok<=(p.minStok||5)?'badge-red':p.stok<=10?'badge-yellow':'badge-teal'}">\${p.stok}</span></td>
      <td style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="editProduk('\${p.id}')">✏️</button>
        <button class="btn btn-danger" onclick="hapusProduk('\${p.id}')">🗑</button>
      </td>
    </tr>\`).join('');
  renderPagination('produk-pagination',produkPage,pages,p=>{produkPage=p;renderProduk()});
}

// ── PAGINATION ───────────────────────────────────
function renderPagination(elId,cur,total,cb){
  const el=document.getElementById(elId);
  if(total<=1){el.innerHTML='';return}
  let h=\`<button class="pg-btn" \${cur===1?'disabled':''} onclick="(\${cb})(\${cur-1})">‹</button>\`;
  const r=[];for(let i=1;i<=total;i++){if(i===1||i===total||Math.abs(i-cur)<=1)r.push(i);else if(r[r.length-1]!=='…')r.push('…')}
  r.forEach(p=>{h+=p==='…'?\`<span style="padding:0 4px;color:var(--muted)">…</span>\`:\`<button class="pg-btn \${p===cur?'active':''}" onclick="(\${cb})(\${p})">\${p}</button>\`});
  h+=\`<button class="pg-btn" \${cur===total?'disabled':''} onclick="(\${cb})(\${cur+1})">›</button>\`;
  el.innerHTML=h;
}

// ── PENJUALAN ────────────────────────────────────
let sellRows=[];
function initJual(){document.getElementById('j-tanggal').value=today();if(!sellRows.length)tambahBarisProduk();else renderSellRows();setPayMode('shopee')}
function tambahBarisProduk(){sellRows.push({id:genId(),produkId:'',qty:1,adminPct:0});renderSellRows()}
function hapusSellRow(id){sellRows=sellRows.filter(r=>r.id!==id);renderSellRows()}

function renderSellRows(){
  const c=document.getElementById('sell-items-container');
  c.innerHTML=sellRows.map(row=>{
    const p=produk.find(x=>x.id===row.produkId);
    const opts=produk.map(pr=>\`<option value="\${pr.id}" \${pr.id===row.produkId?'selected':''}>\${pr.nama} — \${rp(pr.hargaJual)}</option>\`).join('');
    const sub=p?rp(p.hargaJual*row.qty):'—';
    const labaPreview=p?'Est. laba: '+rp(hitungLaba(p.hargaJual,p.modalTotal,row.qty,row.adminPct,payMode,getSplitRatio())):'';
    const adminAmt=p&&row.adminPct>0&&payMode!=='cash'?rp(hitungAdminRp(p.hargaJual,row.qty,row.adminPct,payMode,getSplitRatio())):'';
    return\`<div class="sell-row">
      <div class="sell-row-top">
        <select onchange="updateSellRow('\${row.id}','produkId',this.value)">
          <option value="">-- Pilih Produk --</option>\${opts}
        </select>
        <input type="number" class="qty-input" value="\${row.qty}" min="1" style="width:72px" onchange="updateSellRow('\${row.id}','qty',this.value)">
        <button class="btn btn-danger" onclick="hapusSellRow('\${row.id}')">✕</button>
      </div>
      <div class="sell-row-bottom">
        <div class="field-group">
          <label>Admin Shopee (%)</label>
          <input type="number" step="0.1" value="\${row.adminPct}" placeholder="\${p?p.admin:2}" onchange="updateSellRow('\${row.id}','adminPct',this.value)" style="border-color:var(--orange);background:#FFF0E0">
        </div>
        <div class="field-group">
          <label>Subtotal</label>
          <div style="padding:6px 10px;font-family:'JetBrains Mono';font-size:13px;font-weight:700;color:var(--green)">\${sub}</div>
        </div>
        <div class="field-group">
          <label>\${adminAmt?'Admin: '+adminAmt:payMode==='cash'?'Tanpa admin':''}&nbsp;</label>
          <div style="font-size:11px;color:var(--muted);font-weight:700;padding:6px 0">\${labaPreview}</div>
        </div>
      </div>
    </div>\`;
  }).join('');
  updateTotalJual();
}

function getSplitRatio(){
  if(payMode!=='split')return 1;
  const{total}=getRawTotal();if(!total)return 0;
  const s=parseFloat(document.getElementById('split-shopee')?.value||0);
  return Math.min(1,s/total);
}

function getRawTotal(){
  let total=0,items=0;
  sellRows.forEach(r=>{const p=produk.find(x=>x.id===r.produkId);if(p){total+=p.hargaJual*r.qty;items+=r.qty}});
  return{total,items};
}

function updateSellRow(id,f,v){
  const r=sellRows.find(x=>x.id===id);if(!r)return;
  if(f==='qty')r.qty=Math.max(1,parseInt(v)||1);
  else if(f==='adminPct')r.adminPct=parseFloat(v)||0;
  else r[f]=v;
  // pre-fill admin dari produk jika baru pilih produk
  if(f==='produkId'){const p=produk.find(x=>x.id===v);if(p)r.adminPct=p.admin||0}
  renderSellRows();
}

function updateTotalJual(){
  const ratio=getSplitRatio();
  let total=0,laba=0,adminTotal=0,items=0;
  sellRows.forEach(r=>{
    const p=produk.find(x=>x.id===r.produkId);if(!p)return;
    total+=p.hargaJual*r.qty;items+=r.qty;
    laba+=hitungLaba(p.hargaJual,p.modalTotal,r.qty,r.adminPct,payMode,ratio);
    adminTotal+=hitungAdminRp(p.hargaJual,r.qty,r.adminPct,payMode,ratio);
  });
  document.getElementById('j-total').textContent=rp(total);
  document.getElementById('j-items-summary').textContent=items+' item';
  document.getElementById('j-admin-preview').textContent=adminTotal>0?'Admin Shopee: '+rp(adminTotal):(payMode==='cash'?'Tidak ada admin Shopee':'');
  document.getElementById('j-profit-preview').textContent='Estimasi laba bersih: '+rp(laba);
  if(payMode==='split')syncSplitCash();
}

function setPayMode(mode){
  payMode=mode;
  ['shopee','split','cash'].forEach(m=>{document.getElementById('pay-'+m+'-box').style.display='none';document.getElementById('pb-'+m).className='pay-btn'});
  document.getElementById('pay-'+mode+'-box').style.display=mode==='split'?'grid':'block';
  document.getElementById('pb-'+mode).className='pay-btn active-'+mode;
  document.getElementById('split-warning').style.display='none';
  renderSellRows();
}

function onSplitShopeeInput(){syncSplitCash();renderSellRows()}
function syncSplitCash(){
  const{total}=getRawTotal();
  const s=parseFloat(document.getElementById('split-shopee').value||0);
  const w=document.getElementById('split-warning');
  if(s>total){w.style.display='block';document.getElementById('split-cash').value='';}
  else{w.style.display='none';document.getElementById('split-cash').value=Math.round(total-s)||''}
}

async function simpanTransaksi(){
  const tanggal=document.getElementById('j-tanggal').value;if(!tanggal){toast('Pilih tanggal!','red');return}
  const ratio=getSplitRatio();
  let total=0,laba=0,adminTotal=0;const items=[];
  sellRows.forEach(row=>{
    const p=produk.find(x=>x.id===row.produkId);if(!p||!row.qty)return;
    const sub=p.hargaJual*row.qty;
    const la=hitungLaba(p.hargaJual,p.modalTotal,row.qty,row.adminPct,payMode,ratio);
    const ar=hitungAdminRp(p.hargaJual,row.qty,row.adminPct,payMode,ratio);
    total+=sub;laba+=la;adminTotal+=ar;
    items.push({produkId:p.id,nama:p.nama,qty:row.qty,hargaJual:p.hargaJual,modalTotal:p.modalTotal,adminPct:row.adminPct,subtotal:sub,adminRp:ar,laba:la});
  });
  if(!items.length){toast('Pilih produk dulu!','red');return}
  let pay={};
  if(payMode==='shopee')pay={mode:'shopee',shopee:total,cash:0};
  else if(payMode==='cash')pay={mode:'cash',shopee:0,cash:total};
  else{const s=parseFloat(document.getElementById('split-shopee').value||0);const c=parseFloat(document.getElementById('split-cash').value||0);if(Math.abs((s+c)-total)>1){toast('Total split tidak sesuai!','red');return}pay={mode:'split',shopee:s,cash:c}}
  items.forEach(item=>{const p=produk.find(x=>x.id===item.produkId);if(p)p.stok=Math.max(0,p.stok-item.qty)});
  const order=document.getElementById('j-order').value.trim();
  transaksiJual.unshift({id:genId(),tanggal,order:order||'-',items,total,laba,adminTotal,pay});
  sellRows=[];initJual();await Promise.all([saveData('jual'),saveData('produk')]);
  renderProduk();checkStokAlert();updHeaderStats();toast('Transaksi tersimpan! 🎉','green');
}

// ── EDIT TRANSAKSI ───────────────────────────────
let editSellRows=[];
function openEditModal(id){
  const t=transaksiJual.find(x=>x.id===id);if(!t)return;
  editTrxId=id;
  editSellRows=t.items.map(i=>({id:genId(),produkId:i.produkId,qty:i.qty,adminPct:i.adminPct||0}));
  document.getElementById('em-tanggal').value=t.tanggal;
  document.getElementById('em-order').value=t.order==='-'?'':t.order;
  setEditPayMode(t.pay.mode);
  if(t.pay.mode==='split'){document.getElementById('em-split-shopee').value=t.pay.shopee;document.getElementById('em-split-cash').value=t.pay.cash}
  renderEditRows();document.getElementById('edit-modal').style.display='flex';
}
function closeEditModal(){document.getElementById('edit-modal').style.display='none';editTrxId=null;editSellRows=[]}
function setEditPayMode(mode){
  editPayMode=mode;
  ['shopee','split','cash'].forEach(m=>{document.getElementById('em-pay-'+m+'-box').style.display='none';document.getElementById('em-pb-'+m).className='pay-btn'});
  document.getElementById('em-pay-'+mode+'-box').style.display=mode==='split'?'grid':'block';
  document.getElementById('em-pb-'+mode).className='pay-btn active-'+mode;
  renderEditRows();
}
function getEditSplitRatio(){
  if(editPayMode!=='split')return 1;
  let t=0;editSellRows.forEach(r=>{const p=produk.find(x=>x.id===r.produkId);if(p)t+=p.hargaJual*r.qty});
  if(!t)return 0;
  return Math.min(1,parseFloat(document.getElementById('em-split-shopee').value||0)/t);
}
function renderEditRows(){
  const c=document.getElementById('em-items-container');
  const ratio=getEditSplitRatio();
  c.innerHTML=editSellRows.map(row=>{
    const p=produk.find(x=>x.id===row.produkId);
    const opts=produk.map(pr=>\`<option value="\${pr.id}" \${pr.id===row.produkId?'selected':''}>\${pr.nama}</option>\`).join('');
    return\`<div class="sell-row">
      <div class="sell-row-top">
        <select onchange="updateEditRow('\${row.id}','produkId',this.value)"><option value="">-- Pilih --</option>\${opts}</select>
        <input type="number" class="qty-input" value="\${row.qty}" min="1" style="width:72px" onchange="updateEditRow('\${row.id}','qty',this.value)">
        <button class="btn btn-danger" onclick="removeEditRow('\${row.id}')">✕</button>
      </div>
      <div class="sell-row-bottom">
        <div class="field-group"><label>Admin Shopee (%)</label>
          <input type="number" step="0.1" value="\${row.adminPct}" onchange="updateEditRow('\${row.id}','adminPct',this.value)" style="border-color:var(--orange);background:#FFF0E0">
        </div>
        <div class="field-group"><label>Subtotal</label><div style="padding:6px 10px;font-family:'JetBrains Mono';font-size:13px;font-weight:700;color:var(--green)">\${p?rp(p.hargaJual*row.qty):'—'}</div></div>
        <div class="field-group"><label>&nbsp;</label><div style="font-size:11px;color:var(--muted);font-weight:700;padding:6px 0">\${p?'Laba: '+rp(hitungLaba(p.hargaJual,p.modalTotal,row.qty,row.adminPct,editPayMode,ratio)):''}</div></div>
      </div>
    </div>\`;
  }).join('');
  updateEditTotal();
}
function addEditRow(){editSellRows.push({id:genId(),produkId:'',qty:1,adminPct:0});renderEditRows()}
function removeEditRow(id){editSellRows=editSellRows.filter(r=>r.id!==id);renderEditRows()}
function updateEditRow(id,f,v){
  const r=editSellRows.find(x=>x.id===id);if(!r)return;
  if(f==='qty')r.qty=Math.max(1,parseInt(v)||1);
  else if(f==='adminPct')r.adminPct=parseFloat(v)||0;
  else{r[f]=v;const p=produk.find(x=>x.id===v);if(p&&f==='produkId')r.adminPct=p.admin||0}
  renderEditRows();
}
function updateEditTotal(){
  const ratio=getEditSplitRatio();
  let t=0,l=0,ar=0,i=0;
  editSellRows.forEach(r=>{const p=produk.find(x=>x.id===r.produkId);if(p){t+=p.hargaJual*r.qty;l+=hitungLaba(p.hargaJual,p.modalTotal,r.qty,r.adminPct,editPayMode,ratio);ar+=hitungAdminRp(p.hargaJual,r.qty,r.adminPct,editPayMode,ratio);i+=r.qty}});
  document.getElementById('em-total').textContent=rp(t);
  document.getElementById('em-items-count').textContent=i+' item';
  document.getElementById('em-admin-preview').textContent=ar>0?'Admin Shopee: '+rp(ar):'';
}
function syncEditSplitCash(){
  let t=0;editSellRows.forEach(r=>{const p=produk.find(x=>x.id===r.produkId);if(p)t+=p.hargaJual*r.qty});
  const s=parseFloat(document.getElementById('em-split-shopee').value||0);
  document.getElementById('em-split-cash').value=Math.max(0,Math.round(t-s))||'';
  renderEditRows();
}
async function simpanEditTransaksi(){
  const tanggal=document.getElementById('em-tanggal').value;if(!tanggal){toast('Pilih tanggal!','red');return}
  const ratio=getEditSplitRatio();
  let total=0,laba=0,adminTotal=0;const items=[];
  editSellRows.forEach(row=>{
    const p=produk.find(x=>x.id===row.produkId);if(!p||!row.qty)return;
    const sub=p.hargaJual*row.qty;const la=hitungLaba(p.hargaJual,p.modalTotal,row.qty,row.adminPct,editPayMode,ratio);const ar=hitungAdminRp(p.hargaJual,row.qty,row.adminPct,editPayMode,ratio);
    total+=sub;laba+=la;adminTotal+=ar;
    items.push({produkId:p.id,nama:p.nama,qty:row.qty,hargaJual:p.hargaJual,modalTotal:p.modalTotal,adminPct:row.adminPct,subtotal:sub,adminRp:ar,laba:la});
  });
  if(!items.length){toast('Pilih produk!','red');return}
  let pay={};
  if(editPayMode==='shopee')pay={mode:'shopee',shopee:total,cash:0};
  else if(editPayMode==='cash')pay={mode:'cash',shopee:0,cash:total};
  else{const s=parseFloat(document.getElementById('em-split-shopee').value||0);const c=parseFloat(document.getElementById('em-split-cash').value||0);pay={mode:'split',shopee:s,cash:c}}
  const order=document.getElementById('em-order').value.trim();
  const idx=transaksiJual.findIndex(x=>x.id===editTrxId);
  if(idx>-1)transaksiJual[idx]={...transaksiJual[idx],tanggal,order:order||'-',items,total,laba,adminTotal,pay};
  closeEditModal();renderTransaksi();updHeaderStats();await saveData('jual');toast('Diupdate! ✅','purple');
}

// ── PENGELUARAN ──────────────────────────────────
function pilihKat(el,kat){if(selectedKatEl)selectedKatEl.classList.remove('active');el.classList.add('active');selectedKatEl=el;selectedKat=kat;document.getElementById('k-kategori').value=kat}
function resetFormKel(){['k-jumlah','k-ket','k-catatan'].forEach(id=>document.getElementById(id).value='');document.getElementById('k-tanggal').value=today();if(selectedKatEl){selectedKatEl.classList.remove('active');selectedKatEl=null}selectedKat='';document.getElementById('k-kategori').value=''}
async function simpanPengeluaran(){
  const tanggal=document.getElementById('k-tanggal').value;const jumlah=parseFloat(document.getElementById('k-jumlah').value);const ket=document.getElementById('k-ket').value.trim();const kat=document.getElementById('k-kategori').value;
  if(!tanggal||!jumlah||!ket||!kat){toast('Lengkapi semua field!','red');return}
  transaksiKel.unshift({id:genId(),tanggal,jumlah,ket,kat,catatan:document.getElementById('k-catatan').value.trim()});
  renderPengeluaran();resetFormKel();updHeaderStats();await saveData('pengeluaran');toast('Dicatat! 💸','orange');
}
async function hapusPengeluaran(id){if(!confirm('Hapus?'))return;transaksiKel=transaksiKel.filter(k=>k.id!==id);renderPengeluaran();updHeaderStats();await saveData('pengeluaran');toast('Dihapus','red')}
function clearKelFilter(){document.getElementById('kel-dari').value='';document.getElementById('kel-sampai').value='';renderPengeluaran()}
const katStyle={'Modal Stok':'badge-purple','Packing & Ongkir':'badge-orange','Iklan Shopee':'badge-pink','Gaji / Upah':'badge-blue','Operasional Lain':'badge-green'};
function renderPengeluaran(){
  const dari=document.getElementById('kel-dari')?.value,sampai=document.getElementById('kel-sampai')?.value;
  let data=transaksiKel.filter(k=>inRange(k.tanggal,dari,sampai));
  document.getElementById('kel-total-badge').textContent=rp(data.reduce((s,k)=>s+k.jumlah,0));
  const tbody=document.getElementById('tbody-pengeluaran');
  if(!data.length){tbody.innerHTML=\`<tr><td colspan="5"><div class="empty"><div class="icon">💸</div><p>Tidak ada data</p></div></td></tr>\`;return}
  tbody.innerHTML=data.map(k=>\`<tr><td>\${k.tanggal}</td><td><span class="badge \${katStyle[k.kat]||'badge-purple'}">\${k.kat}</span></td><td>\${k.ket}\${k.catatan?'<br><span style="font-size:11px;color:var(--muted)">'+k.catatan+'</span>':''}</td><td class="mono fw9" style="color:var(--red)">\${rp(k.jumlah)}</td><td><button class="btn btn-danger" onclick="hapusPengeluaran('\${k.id}')">🗑</button></td></tr>\`).join('');
}

// ── TRANSAKSI ────────────────────────────────────
function setTrxFilter(mode,el){trxFilterMode=mode;document.querySelectorAll('#page-transaksi .filter-chip').forEach(x=>x.classList.remove('active'));el.classList.add('active');trxPage=1;renderTransaksi()}
function clearTrxFilter(){document.getElementById('trx-dari').value='';document.getElementById('trx-sampai').value='';trxFilterMode='all';document.querySelectorAll('#page-transaksi .filter-chip').forEach((x,i)=>x.classList.toggle('active',i===0));trxPage=1;renderTransaksi()}
async function hapusTrx(id,type){
  if(!confirm('Hapus?'))return;
  if(type==='jual')transaksiJual=transaksiJual.filter(t=>t.id!==id);else transaksiKel=transaksiKel.filter(t=>t.id!==id);
  renderTransaksi();updHeaderStats();await saveData(type==='jual'?'jual':'pengeluaran');toast('Dihapus','red');
}
function exportCSV(){
  const dari=document.getElementById('trx-dari').value,sampai=document.getElementById('trx-sampai').value;
  let rows=[['Tanggal','Jenis','Detail','Total','Admin Shopee (Rp)','Laba','Bayar']];
  let all=[];
  if(trxFilterMode!=='pengeluaran')transaksiJual.forEach(t=>all.push({...t,type:'jual'}));
  if(trxFilterMode!=='pemasukan')transaksiKel.forEach(t=>all.push({...t,type:'kel'}));
  all.sort((a,b)=>b.tanggal.localeCompare(a.tanggal));
  if(dari||sampai)all=all.filter(x=>inRange(x.tanggal,dari,sampai));
  all.forEach(x=>{
    if(x.type==='jual')rows.push([x.tanggal,'Pemasukan',x.items.map(i=>i.nama+' x'+i.qty).join('; '),x.total,x.adminTotal||0,x.laba,x.pay.mode==='split'?\`Split(Shopee:\${x.pay.shopee}+Tunai:\${x.pay.cash})\`:x.pay.mode]);
    else rows.push([x.tanggal,'Pengeluaran',x.ket,x.jumlah,0,0,'-']);
  });
  const csv=rows.map(r=>r.map(v=>'"'+String(v||0).replace(/"/g,'""')+'"').join(',')).join('\\n');
  const blob=new Blob(['\\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='TRIXY_'+today()+'.csv';a.click();
  toast('CSV didownload! 📊','teal');
}

function renderTransaksi(){
  const dari=document.getElementById('trx-dari')?.value,sampai=document.getElementById('trx-sampai')?.value;
  let all=[];
  if(trxFilterMode!=='pengeluaran')transaksiJual.forEach(t=>all.push({...t,type:'jual'}));
  if(trxFilterMode!=='pemasukan')transaksiKel.forEach(t=>all.push({...t,type:'kel'}));
  all.sort((a,b)=>b.tanggal.localeCompare(a.tanggal));
  if(dari||sampai)all=all.filter(x=>inRange(x.tanggal,dari,sampai));

  const tp=transaksiJual.reduce((s,t)=>s+t.total,0);
  const ta=transaksiJual.reduce((s,t)=>s+(t.adminTotal||0),0);
  const tk=transaksiKel.reduce((s,t)=>s+t.jumlah,0);
  const tl=transaksiJual.reduce((s,t)=>s+t.laba,0)-tk;
  document.getElementById('st-pemasukan').textContent=rp(tp);
  document.getElementById('st-admin').textContent=rp(ta);
  document.getElementById('st-pengeluaran').textContent=rp(tk);
  const le=document.getElementById('st-laba-bersih');le.textContent=rp(tl);le.className='stat-value mono '+(tl>=0?'green':'red');

  const pages=Math.ceil(all.length/TRX_PER_PAGE)||1;
  if(trxPage>pages)trxPage=1;
  const slice=all.slice((trxPage-1)*TRX_PER_PAGE,trxPage*TRX_PER_PAGE);
  const tbody=document.getElementById('tbody-transaksi');
  if(!slice.length){tbody.innerHTML=\`<tr><td colspan="8"><div class="empty"><div class="icon">📋</div><p>Tidak ada transaksi</p></div></td></tr>\`;document.getElementById('trx-pagination').innerHTML='';return}
  tbody.innerHTML=slice.map(x=>{
    if(x.type==='jual'){
      const il=x.items.map(i=>i.nama+' x'+i.qty).join(', ');
      // admin per item detail
      const adminDetail=x.items.filter(i=>i.adminRp>0).map(i=>\`\${i.adminPct}%→\${rp(i.adminRp)}\`).join('<br>');
      const adminTotalRp=x.adminTotal||x.items.reduce((s,i)=>s+(i.adminRp||0),0);
      const bayar=x.pay.mode==='shopee'?'<span class="badge badge-orange">Shopee</span>':x.pay.mode==='cash'?'<span class="badge badge-green">Tunai</span>':\`<span class="badge badge-blue">Split</span><div style="font-size:10px;color:var(--muted)">\${rp(x.pay.shopee)}+\${rp(x.pay.cash)}</div>\`;
      const adminCol=adminTotalRp>0?\`<div class="mono" style="color:var(--orange);font-size:12px">\${rp(adminTotalRp)}</div><div class="admin-info">\${adminDetail}</div>\`:'<span style="color:var(--muted);font-size:12px">—</span>';
      return\`<tr>
        <td>\${x.tanggal}</td>
        <td><span class="badge badge-pink">💰</span></td>
        <td style="max-width:140px;font-size:12px">\${x.order!=='-'?'<b>'+x.order+'</b><br>':''}<span style="color:var(--muted)">\${il}</span></td>
        <td class="mono fw9" style="color:var(--pink)">\${rp(x.total)}</td>
        <td>\${adminCol}</td>
        <td class="mono" style="color:var(--green)">\${rp(x.laba)}</td>
        <td>\${bayar}</td>
        <td style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" onclick="openEditModal('\${x.id}')">✏️</button><button class="btn btn-danger" onclick="hapusTrx('\${x.id}','jual')">🗑</button></td>
      </tr>\`;
    }else{
      return\`<tr>
        <td>\${x.tanggal}</td><td><span class="badge badge-red">💸</span></td>
        <td style="font-size:12px">\${x.ket}</td>
        <td class="mono fw9" style="color:var(--red)">\${rp(x.jumlah)}</td>
        <td>—</td><td>—</td>
        <td><span class="badge \${katStyle[x.kat]||'badge-purple'}">\${x.kat}</span></td>
        <td><button class="btn btn-danger" onclick="hapusTrx('\${x.id}','kel')">🗑</button></td>
      </tr>\`;
    }
  }).join('');
  renderPagination('trx-pagination',trxPage,pages,p=>{trxPage=p;renderTransaksi()});
}

// ── ANALITIK ─────────────────────────────────────
function setAnFilter(mode,el){anFilterMode=mode;document.querySelectorAll('#page-analitik .filter-chip').forEach(x=>x.classList.remove('active'));el.classList.add('active');renderAnalitik()}
function clearAnFilter(){document.getElementById('an-dari').value='';document.getElementById('an-sampai').value='';anFilterMode='all';document.querySelectorAll('#page-analitik .filter-chip').forEach((x,i)=>x.classList.toggle('active',i===0));renderAnalitik()}
function renderAnalitik(){
  const dari=document.getElementById('an-dari')?.value,sampai=document.getElementById('an-sampai')?.value;
  const showJ=anFilterMode!=='pengeluaran',showK=anFilterMode!=='pemasukan';
  let jual=transaksiJual,kel=transaksiKel;
  if(dari||sampai){jual=jual.filter(t=>inRange(t.tanggal,dari,sampai));kel=kel.filter(k=>inRange(k.tanggal,dari,sampai))}
  const tj=showJ?jual.reduce((s,t)=>s+t.total,0):0;
  const ta=showJ?jual.reduce((s,t)=>s+(t.adminTotal||0),0):0;
  const tk=showK?kel.reduce((s,k)=>s+k.jumlah,0):0;
  const tl=jual.reduce((s,t)=>s+t.laba,0)-kel.reduce((s,k)=>s+k.jumlah,0);
  document.getElementById('an-jual').textContent=rp(tj);
  document.getElementById('an-admin').textContent=rp(ta);
  document.getElementById('an-kel').textContent=rp(tk);
  document.getElementById('an-laba').textContent=rp(tl);
  document.getElementById('an-trx').textContent=jual.length+' transaksi';
  document.getElementById('pay-shopee-t').textContent=rp(jual.filter(t=>t.pay.mode==='shopee').reduce((s,t)=>s+t.total,0));
  document.getElementById('pay-split-t').textContent=rp(jual.filter(t=>t.pay.mode==='split').reduce((s,t)=>s+t.total,0));
  document.getElementById('pay-cash-t').textContent=rp(jual.filter(t=>t.pay.mode==='cash').reduce((s,t)=>s+t.total,0));

  // chart
  let days=[];
  if(dari&&sampai){
    const d1=new Date(dari),d2=new Date(sampai),diff=(d2-d1)/(86400000);
    if(diff<=31){for(let i=0;i<=diff;i++){const d=new Date(d1);d.setDate(d.getDate()+i);const ds=d.toISOString().split('T')[0];days.push({lbl:d.toLocaleDateString('id-ID',{day:'numeric',month:'short'}),jual:showJ?transaksiJual.filter(t=>t.tanggal===ds).reduce((s,t)=>s+t.total,0):0,kel:showK?transaksiKel.filter(k=>k.tanggal===ds).reduce((s,k)=>s+k.jumlah,0):0})}}
    else{for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=d.toISOString().split('T')[0];days.push({lbl:d.toLocaleDateString('id-ID',{weekday:'short',day:'numeric'}),jual:showJ?transaksiJual.filter(t=>t.tanggal===ds).reduce((s,t)=>s+t.total,0):0,kel:showK?transaksiKel.filter(k=>k.tanggal===ds).reduce((s,k)=>s+k.jumlah,0):0})}}
  }else{for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=d.toISOString().split('T')[0];days.push({lbl:d.toLocaleDateString('id-ID',{weekday:'short',day:'numeric'}),jual:showJ?transaksiJual.filter(t=>t.tanggal===ds).reduce((s,t)=>s+t.total,0):0,kel:showK?transaksiKel.filter(k=>k.tanggal===ds).reduce((s,k)=>s+k.jumlah,0):0})}}
  drawChart(days);

  const pc={};jual.forEach(t=>t.items.forEach(i=>{if(!pc[i.nama])pc[i.nama]={qty:0,rev:0};pc[i.nama].qty+=i.qty;pc[i.nama].rev+=i.subtotal}));
  const sorted=Object.entries(pc).sort((a,b)=>b[1].qty-a[1].qty).slice(0,5);
  const maxQ=sorted.length?sorted[0][1].qty:1;
  const topEl=document.getElementById('top-produk-list');
  if(!sorted.length)topEl.innerHTML=\`<div class="empty"><div class="icon">📊</div><p>Belum ada data</p></div>\`;
  else topEl.innerHTML=sorted.map(([n,d],i)=>\`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:13px;font-weight:800">\${i+1}. \${n}</span><span class="mono" style="font-size:12px;color:var(--purple)">\${d.qty} terjual · \${rp(d.rev)}</span></div><div class="prog-bar"><div class="prog-fill" style="width:\${Math.round(d.qty/maxQ*100)}%;background:linear-gradient(90deg,var(--pink),var(--purple))"></div></div></div>\`).join('');

  const kats=['Modal Stok','Packing & Ongkir','Iklan Shopee','Gaji / Upah','Operasional Lain'];
  const cc=['var(--purple)','var(--orange)','var(--pink)','var(--blue)','var(--green)'];
  const kt=kats.map(k=>({kat:k,total:kel.filter(x=>x.kat===k).reduce((s,x)=>s+x.jumlah,0)}));
  const mk=Math.max(...kt.map(k=>k.total),1);
  const ke=document.getElementById('kel-cat-breakdown');
  if(!kel.length)ke.innerHTML=\`<div class="empty"><div class="icon">💸</div><p>Belum ada data</p></div>\`;
  else ke.innerHTML=kt.map((k,i)=>\`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:13px;font-weight:800">\${k.kat}</span><span class="mono" style="font-size:12px;color:\${cc[i]}">\${rp(k.total)}</span></div><div class="prog-bar"><div class="prog-fill" style="width:\${Math.round(k.total/mk*100)}%;background:\${cc[i]}"></div></div></div>\`).join('');
}
function drawChart(days){
  const cv=document.getElementById('bar-chart');const W=cv.parentElement.offsetWidth||600,H=160;
  cv.width=W;cv.height=H;const ctx=cv.getContext('2d');ctx.clearRect(0,0,W,H);
  const max=Math.max(...days.map(d=>Math.max(d.jual,d.kel)),1);
  const sw=(W-20)/days.length,bw=Math.min(sw*.28,22),g=3,ch=H-36;
  days.forEach((d,i)=>{
    const cx=20+i*sw+sw/2;
    if(d.jual>0){const jh=Math.max(4,Math.round(d.jual/max*ch));const gr=ctx.createLinearGradient(0,H-24-jh,0,H-24);gr.addColorStop(0,'#FF6B9D');gr.addColorStop(1,'rgba(255,107,157,0.3)');ctx.fillStyle=gr;ctx.beginPath();ctx.roundRect(cx-bw-g/2,H-24-jh,bw,jh,[4,4,0,0]);ctx.fill();ctx.fillStyle='#FF6B9D';ctx.font='bold 8px JetBrains Mono';ctx.textAlign='center';ctx.fillText(d.jual>=1000000?(d.jual/1000000).toFixed(1)+'jt':(d.jual/1000).toFixed(0)+'rb',cx-bw/2-g/2,H-26-jh)}
    if(d.kel>0){const kh=Math.max(4,Math.round(d.kel/max*ch));const gr2=ctx.createLinearGradient(0,H-24-kh,0,H-24);gr2.addColorStop(0,'#FB923C');gr2.addColorStop(1,'rgba(251,146,60,0.3)');ctx.fillStyle=gr2;ctx.beginPath();ctx.roundRect(cx+g/2,H-24-kh,bw,kh,[4,4,0,0]);ctx.fill()}
    ctx.fillStyle='#9B7BB8';ctx.font='bold 9px Nunito';ctx.textAlign='center';ctx.fillText(d.lbl,cx,H-6);
  });
}
// ── INIT ─────────────────────────────────────────
document.getElementById('j-tanggal').value=today();
document.getElementById('k-tanggal').value=today();
</script>
</body>
</html>
`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-PIN",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function checkPin(request) {
  return request.headers.get("X-PIN") === CORRECT_PIN;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: CORS });

    if (path.startsWith("/api/")) {
      if (!checkPin(request)) return json({ error: "PIN salah" }, 401);

      if (path === "/api/verify-pin" && request.method === "GET")
        return json({ ok: true });

      const key = path.replace("/api/", "");
      if (!["produk","jual","pengeluaran"].includes(key))
        return json({ error: "Not found" }, 404);

      if (request.method === "GET") {
        const raw = await env.TRIXY_KV.get(key);
        return json(raw ? JSON.parse(raw) : []);
      }
      if (request.method === "POST") {
        await env.TRIXY_KV.put(key, JSON.stringify(await request.json()));
        return json({ ok: true });
      }
      if (request.method === "DELETE") {
        await env.TRIXY_KV.put(key, JSON.stringify([]));
        return json({ ok: true });
      }
    }

    return new Response(HTML, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
