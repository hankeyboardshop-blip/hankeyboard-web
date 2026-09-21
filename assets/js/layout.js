(function () {
  "use strict";

  const store = window.HANStore;
  const { icon, escapeHtml, formatMoney } = store;
  const config = window.HAN_CONFIG;
  const content = window.HAN_CONTENT;

  function currentPage() {
    return document.body.dataset.page || "";
  }

  function activeFor(group) {
    const page = currentPage();
    const groups = {
      home: ["home"],
      products: ["products", "product", "favorites"],
      guides: ["guides", "article"],
      policies: ["policy"],
      contact: ["contact", "about"],
      cart: ["cart", "checkout", "thanks"],
      tracking: ["tracking"],
    };
    return groups[group]?.includes(page) ? ' aria-current="page"' : "";
  }

  function renderHeader() {
    const target = document.getElementById("site-header");
    if (!target) return;
    const announcements = content.announcement.map((item) => `<span>${escapeHtml(item)}</span><i class="announcement__dot" aria-hidden="true"></i>`).join("");
    target.innerHTML = `<div class="announcement"><div class="container announcement__track">${announcements}</div></div>
      <header class="site-header" aria-label="Đầu trang">
        <div class="container header-main">
          <a class="brand" href="index.html" aria-label="HANKeyboard - Trang chủ">
            <img src="assets/images/brand/hankeyboard-wordmark-no-tagline-navy.svg" alt="HANKeyboard" width="352" height="72">
          </a>
          <nav class="desktop-nav" aria-label="Điều hướng chính">
            <a href="san-pham.html"${activeFor("products")}>Sản phẩm</a>
            <a href="san-pham.html?brand=AULA">Thương hiệu</a>
            <a href="huong-dan.html"${activeFor("guides")}>Hướng dẫn</a>
            <a href="chinh-sach.html"${activeFor("policies")}>Chính sách</a>
            <a href="lien-he.html"${activeFor("contact")}>Liên hệ</a>
          </nav>
          <div class="header-actions">
            <button class="icon-button" type="button" data-layout-action="search" aria-label="Tìm kiếm sản phẩm">${icon("search")}</button>
            <a class="track-link" href="tra-cuu.html"${activeFor("tracking")}>${icon("package")}Tra cứu đơn</a>
            <a class="icon-button" href="gio-hang.html" aria-label="Giỏ hàng"${activeFor("cart")}>${icon("cart")}<span class="cart-count" data-cart-count>0</span></a>
            <button class="icon-button mobile-menu-button" type="button" data-layout-action="menu" aria-label="Mở menu" aria-expanded="false">${icon("menu")}</button>
          </div>
        </div>
      </header>`;
  }

  function renderOverlays() {
    const target = document.getElementById("site-overlays");
    if (!target) return;
    target.innerHTML = `<aside class="mobile-drawer" data-mobile-drawer aria-hidden="true">
        <button class="mobile-drawer__scrim" type="button" data-layout-action="close-menu" aria-label="Đóng menu"></button>
        <div class="mobile-drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div class="drawer-top">
            <img src="assets/images/brand/hankeyboard-wordmark-no-tagline-navy.svg" alt="HANKeyboard" width="340" height="70">
            <button class="icon-button" type="button" data-layout-action="close-menu" aria-label="Đóng menu">${icon("close")}</button>
          </div>
          <nav class="drawer-nav" aria-label="Menu điện thoại">
            <a href="index.html">Trang chủ ${icon("chevron")}</a>
            <a href="san-pham.html">Sản phẩm ${icon("chevron")}</a>
            <a href="yeu-thich.html">Sản phẩm đã thích ${icon("chevron")}</a>
            <a href="huong-dan.html">Hướng dẫn ${icon("chevron")}</a>
            <a href="chinh-sach.html">Chính sách ${icon("chevron")}</a>
            <a href="gioi-thieu.html">Giới thiệu ${icon("chevron")}</a>
            <a href="lien-he.html">Liên hệ ${icon("chevron")}</a>
            <a href="tra-cuu.html">Tra cứu đơn hàng ${icon("chevron")}</a>
          </nav>
          <div class="drawer-quick">
            <a class="btn btn--primary btn--small" href="${config.zaloUrl}" target="_blank" rel="noopener">${icon("chat")}Zalo</a>
            <a class="btn btn--outline btn--small" href="tel:${config.supportPhone}">${icon("phone")}Gọi shop</a>
          </div>
        </div>
      </aside>
      <div class="search-overlay" data-search-overlay hidden>
        <div class="search-panel" role="dialog" aria-modal="true" aria-label="Tìm kiếm sản phẩm">
          <form class="search-box" data-search-form>
            ${icon("search")}
            <input type="search" name="q" placeholder="Tên sản phẩm, thương hiệu, mã sản phẩm..." autocomplete="off" aria-label="Từ khóa tìm kiếm">
            <button class="icon-button" type="button" data-layout-action="close-search" aria-label="Đóng tìm kiếm">${icon("close")}</button>
          </form>
          <div class="search-results" data-search-results><p class="empty-inline">Nhập ít nhất 2 ký tự để tìm sản phẩm.</p></div>
        </div>
      </div>
      <div class="floating-actions" aria-label="Liên hệ nhanh">
        <a class="floating-action" href="${config.zaloUrl}" target="_blank" rel="noopener" aria-label="Nhắn Zalo HANKeyboard">${icon("chat")}</a>
        <a class="floating-action floating-action--phone" href="tel:${config.supportPhone}" aria-label="Gọi HANKeyboard">${icon("phone")}</a>
      </div>
      <nav class="mobile-bottom-nav" aria-label="Điều hướng nhanh">
        <a href="index.html"${activeFor("home")}>${icon("home")}<span>Trang chủ</span></a>
        <a href="san-pham.html"${activeFor("products")}>${icon("grid")}<span>Sản phẩm</span></a>
        <a href="tra-cuu.html"${activeFor("tracking")}>${icon("package")}<span>Tra cứu</span></a>
        <a href="gio-hang.html"${activeFor("cart")}>${icon("cart")}<span>Giỏ hàng</span><span class="cart-count" data-cart-count>0</span></a>
      </nav>`;
  }

  function renderFooter() {
    const target = document.getElementById("site-footer");
    if (!target) return;
    const shop = content.shop;
    target.innerHTML = `<footer class="site-footer">
      <div class="container footer-main">
        <div class="footer-brand">
          <img src="assets/images/brand/hankeyboard-wordmark-no-tagline-on-dark.svg" alt="HANKeyboard" width="430" height="90">
          <p>${escapeHtml(shop.shortIntro)} Tư vấn trực tiếp, thông tin rõ ràng và hỗ trợ sau bán tại Hà Đông.</p>
          <form class="newsletter-form" data-newsletter-form>
            <label for="footer-email">Nhận bài hướng dẫn và thông tin hàng mới</label>
            <div class="newsletter-row"><input id="footer-email" name="email" type="email" autocomplete="email" placeholder="Email của bạn" required><button class="btn btn--primary btn--small" type="submit">Đăng ký</button></div>
            <small>Không gửi thư rác. Có thể hủy đăng ký bất cứ lúc nào.</small>
          </form>
        </div>
        <div class="footer-grid">
          <div class="footer-col"><h3>Sản phẩm</h3><a href="san-pham.html?category=B%C3%A0n%20ph%C3%ADm%20c%C6%A1">Bàn phím cơ</a><a href="san-pham.html?category=Kit%20b%C3%A0n%20ph%C3%ADm">Kit bàn phím</a><a href="san-pham.html?category=Switch">Switch</a><a href="san-pham.html?category=Keycap">Keycap</a></div>
          <div class="footer-col"><h3>Hỗ trợ</h3><a href="tra-cuu.html">Tra cứu đơn</a><a href="chinh-sach.html?loai=warranty">Bảo hành & đổi trả</a><a href="chinh-sach.html?loai=shipping">Vận chuyển</a><a href="huong-dan.html">Hướng dẫn</a></div>
          <div class="footer-col"><h3>HANKeyboard</h3><a href="gioi-thieu.html">Giới thiệu</a><a href="lien-he.html">Liên hệ</a><a href="${shop.facebookUrl}" target="_blank" rel="noopener">Facebook</a><a href="${shop.zaloUrl}" target="_blank" rel="noopener">Zalo</a></div>
          <div class="footer-col"><h3>Địa chỉ</h3><p>${escapeHtml(shop.address)}</p><p>${escapeHtml(shop.openingHours)}</p><a href="${shop.mapUrl}" target="_blank" rel="noopener">${icon("map")} Mở Google Maps</a><a href="tel:${shop.phone}">${shop.phoneDisplay}</a></div>
        </div>
      </div>
      <div class="container footer-bottom"><span>© ${new Date().getFullYear()} HANKeyboard. Thông tin sản phẩm có thể thay đổi theo lô hàng.</span><span><a href="chinh-sach.html?loai=privacy">Bảo mật</a> · <a href="chinh-sach.html?loai=terms">Điều khoản</a></span></div>
    </footer>`;
  }

  function updateCartCount() {
    const { quantity } = store.cartDetails();
    document.querySelectorAll("[data-cart-count]").forEach((element) => {
      element.textContent = quantity > 99 ? "99+" : String(quantity);
      element.hidden = quantity === 0;
    });
  }

  function setDrawer(open) {
    const drawer = document.querySelector("[data-mobile-drawer]");
    const trigger = document.querySelector('[data-layout-action="menu"]');
    if (!drawer) return;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    trigger?.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);
    if (open) drawer.querySelector(".mobile-drawer__panel a, .mobile-drawer__panel button")?.focus();
  }

  function setSearch(open) {
    const overlay = document.querySelector("[data-search-overlay]");
    if (!overlay) return;
    overlay.hidden = !open;
    document.body.classList.toggle("is-locked", open);
    if (open) window.setTimeout(() => overlay.querySelector("input")?.focus(), 30);
  }

  function renderSearchResults(query) {
    const results = document.querySelector("[data-search-results]");
    if (!results) return;
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) {
      results.innerHTML = '<p class="empty-inline">Nhập ít nhất 2 ký tự để tìm sản phẩm.</p>';
      return;
    }
    const matches = window.HAN_STATE.products.filter((product) => [product.name, product.brand, product.id, product.tags.join(" ")].join(" ").toLowerCase().includes(normalized)).slice(0, 8);
    results.innerHTML = matches.length ? `${matches.map((product) => `<a class="search-result" href="${store.productUrl(product)}">
      <span class="search-result__image">${store.productImage(product)}</span>
      <strong>${escapeHtml(product.name)}<small>${escapeHtml(product.brand)} · Còn ${product.stock}</small></strong>
      <span>${formatMoney(product.price)}</span>
    </a>`).join("")}<a class="btn btn--soft btn--block btn--small" href="san-pham.html?q=${encodeURIComponent(query)}">Xem tất cả kết quả</a>` : '<p class="empty-inline">Không tìm thấy sản phẩm phù hợp. Thử tên thương hiệu hoặc mã sản phẩm.</p>';
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const action = event.target.closest("[data-layout-action]")?.dataset.layoutAction;
      if (!action) return;
      if (action === "menu") setDrawer(true);
      if (action === "close-menu") setDrawer(false);
      if (action === "search") setSearch(true);
      if (action === "close-search") setSearch(false);
    });

    document.querySelector("[data-search-overlay]")?.addEventListener("click", (event) => {
      if (event.target.matches("[data-search-overlay]")) setSearch(false);
    });

    document.querySelector("[data-search-form] input")?.addEventListener("input", (event) => renderSearchResults(event.target.value));
    document.querySelector("[data-search-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = new FormData(event.currentTarget).get("q")?.trim();
      if (query) location.href = `san-pham.html?q=${encodeURIComponent(query)}`;
    });

    document.querySelector("[data-newsletter-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = event.currentTarget.querySelector("button");
      const email = new FormData(event.currentTarget).get("email");
      button.disabled = true;
      try {
        await window.HANApi.subscribe(email);
        event.currentTarget.reset();
        store.toast("Đã đăng ký nhận tin.", "success");
      } catch (error) {
        store.toast(error.message, "error");
      } finally {
        button.disabled = false;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setDrawer(false);
        setSearch(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch(true);
      }
    });
    window.addEventListener("han:cart-updated", updateCartCount);
  }

  function init() {
    renderHeader();
    renderFooter();
    renderOverlays();
    updateCartCount();
    bindEvents();
  }

  window.HANLayout = { init, updateCartCount, setSearch, setDrawer, renderSearchResults };
})();
