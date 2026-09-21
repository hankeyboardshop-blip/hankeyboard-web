(function () {
  "use strict";

  const store = window.HANStore;
  const api = window.HANApi;
  const content = window.HAN_CONTENT;
  const { escapeHtml, formatMoney, formatDate, icon } = store;

  const PAGE_TITLES = {
    home: "HANKeyboard",
    products: "Sản phẩm",
    product: "Chi tiết sản phẩm",
    cart: "Giỏ hàng",
    checkout: "Thanh toán",
    thanks: "Đặt hàng thành công",
    tracking: "Tra cứu đơn hàng",
    guides: "Hướng dẫn",
    article: "Bài hướng dẫn",
    policy: "Chính sách",
    about: "Giới thiệu",
    contact: "Liên hệ",
    favorites: "Sản phẩm đã thích",
  };

  function params() {
    return new URLSearchParams(location.search);
  }

  function setTitle(value) {
    document.title = `${value} | HANKeyboard`;
  }

  function setMeta(selector, attribute, value) {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      const propertyMatch = selector.match(/meta\[property="([^"]+)"\]/);
      const nameMatch = selector.match(/meta\[name="([^"]+)"\]/);
      if (propertyMatch) element.setAttribute("property", propertyMatch[1]);
      if (nameMatch) element.setAttribute("name", nameMatch[1]);
      document.head.appendChild(element);
    }
    element.setAttribute(attribute, value);
  }

  function setCanonical(url) {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }

  function breadcrumbs(items) {
    return `<nav class="breadcrumbs container" aria-label="Đường dẫn"><a href="index.html">Trang chủ</a>${items.map((item, index) => `${icon("chevron")}${index === items.length - 1 || !item.url ? `<span aria-current="page">${escapeHtml(item.label)}</span>` : `<a href="${item.url}">${escapeHtml(item.label)}</a>`}`).join("")}</nav>`;
  }

  function pageHeader(title, description = "", kicker = "HANKeyboard") {
    return `<section class="page-hero"><div class="container"><p class="section-kicker">${escapeHtml(kicker)}</p><h1>${escapeHtml(title)}</h1>${description ? `<p>${escapeHtml(description)}</p>` : ""}</div></section>`;
  }

  function emptyState(title, description, actionLabel, actionUrl) {
    return `<div class="empty-state">${icon("package")}<h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p>${actionUrl ? `<a class="btn btn--primary" href="${actionUrl}">${escapeHtml(actionLabel)}</a>` : ""}</div>`;
  }

  function productSection(products, className = "") {
    return `<div class="product-grid ${className}">${products.map(store.productCard).join("")}</div>`;
  }

  function categoryIcon(index) {
    return ["grid", "refresh", "plus", "star", "search", "package"][index] || "grid";
  }

  function renderHome() {
    setTitle("Bàn phím cơ & phụ kiện tại Hà Đông");
    const products = window.HAN_STATE.products;
    const featured = products.filter((product) => product.featured && product.stock > 0).slice(0, 8);
    const newest = [...products].filter((product) => product.stock > 0).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.views - a.views).slice(0, 8);
    const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))];
    const main = document.getElementById("main-content");
    main.innerHTML = `<section class="hero">
      <div class="container hero__grid">
        <div>
          <div class="hero__eyebrow">Tư vấn thật · Chọn đúng ngay từ đầu</div>
          <h1>Bàn phím hợp tay. <span>Góc máy hợp gu.</span></h1>
          <p class="hero__lead">Bàn phím cơ nhập môn, kit và phụ kiện được chọn theo nhu cầu thật. Xem hàng rõ ràng, hỏi nhanh qua Zalo, nhận hỗ trợ tại Hà Đông.</p>
          <div class="hero__actions"><a class="btn btn--primary" href="san-pham.html">Xem sản phẩm ${icon("arrow")}</a><a class="btn btn--outline" href="huong-dan.html">Chọn bàn phím cho người mới</a></div>
        </div>
        <aside class="hero__aside" aria-label="Thông tin nổi bật">
          <div class="hero-card"><span class="hero-card__mark"><img src="assets/images/brand/hankeyboard-logomark-on-dark.svg" alt="" width="64" height="64"></span><div><p class="hero-card__title">Tư vấn theo nhu cầu</p><p class="hero-card__copy">Layout, kết nối, switch và ngân sách được giải thích bằng ngôn ngữ dễ hiểu.</p></div></div>
          <div class="hero-card"><span class="hero-card__mark">${icon("package")}</span><div><p class="hero-card__title">Có thể nhận tại shop</p><p class="hero-card__copy">Kiến Hưng, Hà Đông · 08:30–18:30 sau khi xác nhận hàng sẵn.</p></div></div>
        </aside>
      </div>
    </section>
    <section class="promise-bar"><div class="container promise-grid">
      <div class="promise"><span class="promise__icon">${icon("shield")}</span><div><strong>Đổi 1–1 trong 7 ngày</strong><span>Nếu lỗi do nhà sản xuất</span></div></div>
      <div class="promise"><span class="promise__icon">${icon("refresh")}</span><div><strong>Bảo hành 30 ngày</strong><span>Quy trình và điều kiện rõ ràng</span></div></div>
      <div class="promise"><span class="promise__icon">${icon("truck")}</span><div><strong>Giao toàn quốc</strong><span>Miễn phí tiêu chuẩn từ 1,1 triệu</span></div></div>
    </div></section>
    <section class="section"><div class="container"><div class="section-head"><div><p class="section-kicker">Chọn nhanh</p><h2 class="section-title">Bạn đang tìm gì?</h2></div><a class="text-link" href="san-pham.html">Tất cả sản phẩm ${icon("arrow")}</a></div>
      <div class="category-grid">${content.categories.map((category, index) => `<a class="category-card" href="san-pham.html?category=${encodeURIComponent(category.name)}"><span class="category-card__icon">${icon(categoryIcon(index))}</span><strong>${escapeHtml(category.name)}</strong><span>${escapeHtml(category.description)}</span></a>`).join("")}</div>
    </div></section>
    <section class="section section--soft"><div class="container"><div class="section-head"><div><p class="section-kicker">Được quan tâm</p><h2 class="section-title">Sản phẩm nổi bật</h2><p class="section-copy">Các phiên bản đang có sẵn trong dữ liệu kho của shop.</p></div><a class="text-link" href="san-pham.html?sort=popular">Xem thêm ${icon("arrow")}</a></div>${featured.length ? productSection(featured) : emptyState("Đang cập nhật sản phẩm", "Danh sách nổi bật sẽ xuất hiện khi shop bật trạng thái trong trang quản trị.", "Xem toàn bộ", "san-pham.html")}</div></section>
    <section class="section"><div class="container"><div class="section-head"><div><p class="section-kicker">Kho mới cập nhật</p><h2 class="section-title">Hàng mới về</h2></div><a class="text-link" href="san-pham.html?sort=newest">Xem tất cả ${icon("arrow")}</a></div>${productSection(newest)}</div></section>
    <section class="section section--dark"><div class="container"><div class="section-head"><div><p class="section-kicker">Thương hiệu</p><h2 class="section-title">Dòng phím đang có tại shop</h2><p class="section-copy">Tồn kho và phiên bản màu được cập nhật theo từng mã sản phẩm.</p></div></div><div class="brand-strip">${brands.map((brand) => `<a class="brand-pill" href="san-pham.html?brand=${encodeURIComponent(brand)}">${escapeHtml(brand)}</a>`).join("")}</div></div></section>
    <section class="section"><div class="container"><div class="section-head"><div><p class="section-kicker">Kiến thức cơ bản</p><h2 class="section-title">Chọn đúng trước khi mua</h2></div><a class="text-link" href="huong-dan.html">Tất cả hướng dẫn ${icon("arrow")}</a></div><div class="article-grid">${content.articles.slice(0, 3).map((article) => `<a class="article-card" href="bai-viet.html?id=${encodeURIComponent(article.id)}"><span class="article-card__tag">${escapeHtml(article.tag)} · ${escapeHtml(article.readTime)}</span><h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(article.excerpt)}</p></a>`).join("")}</div></div></section>
    <section class="section section--soft"><div class="container visit-panel"><div><p class="section-kicker">HANKeyboard Hà Đông</p><h2 class="section-title">Xem hàng hoặc nhận đơn tại shop</h2><p>${escapeHtml(content.shop.address)}<br>${escapeHtml(content.shop.openingHours)}</p><div class="hero__actions"><a class="btn btn--dark" href="${content.shop.mapUrl}" target="_blank" rel="noopener">${icon("map")}Mở bản đồ</a><a class="btn btn--outline" href="lien-he.html">Thông tin liên hệ</a></div></div><div class="visit-panel__mark"><img src="assets/images/brand/hankeyboard-logomark-color.svg" alt="Biểu tượng HANKeyboard" width="260" height="260"></div></div></section>`;
  }

  function filterProducts(allProducts, controls) {
    const query = controls.query.trim().toLowerCase();
    return allProducts.filter((product) => {
      const haystack = [product.name, product.id, product.brand, product.shortDescription, ...(product.tags || [])].join(" ").toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (controls.category && product.category !== controls.category) return false;
      if (controls.brand && product.brand !== controls.brand) return false;
      if (controls.price === "under500" && product.price >= 500000) return false;
      if (controls.price === "500to800" && (product.price < 500000 || product.price > 800000)) return false;
      if (controls.price === "over800" && product.price <= 800000) return false;
      if (controls.layout && product.attributes?.layout !== controls.layout) return false;
      if (controls.connection && !product.attributes?.connections?.includes(controls.connection)) return false;
      if (controls.switchType && product.attributes?.switchType !== controls.switchType) return false;
      if (controls.hotSwap && !product.attributes?.hotSwap) return false;
      if (controls.inStock && product.stock <= 0) return false;
      return true;
    });
  }

  function sortProducts(products, sort) {
    const result = [...products];
    if (sort === "price-asc") return result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return result.sort((a, b) => b.price - a.price);
    if (sort === "popular") return result.sort((a, b) => b.views - a.views);
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.views - a.views);
  }

  function renderProducts() {
    setTitle("Sản phẩm");
    const all = window.HAN_STATE.products;
    const categories = [...new Set(all.map((product) => product.category))];
    const brands = [...new Set(all.map((product) => product.brand))];
    const query = params().get("q") || "";
    const selectedCategory = params().get("category") || "";
    const selectedBrand = params().get("brand") || "";
    const selectedSort = params().get("sort") || "newest";
    const main = document.getElementById("main-content");
    main.innerHTML = `${breadcrumbs([{ label: "Sản phẩm" }])}${pageHeader("Sản phẩm", "Lọc theo nhu cầu sử dụng, kiểm tra tồn kho và chọn đúng phiên bản trước khi thêm vào giỏ.", "Danh mục")}
      <section class="section catalog-section"><div class="container catalog-layout">
        <aside class="filter-panel" data-filter-panel><div class="filter-panel__head"><h2>Bộ lọc</h2><button type="button" class="text-button" data-action="clear-filters">Xóa lọc</button></div>
          <form data-product-filters>
            <label class="field"><span>Tìm trong sản phẩm</span><span class="input-with-icon">${icon("search")}<input type="search" name="query" value="${escapeHtml(query)}" placeholder="Tên, mã sản phẩm..."></span></label>
            <label class="field"><span>Danh mục</span><select name="category"><option value="">Tất cả danh mục</option>${categories.map((value) => `<option value="${escapeHtml(value)}" ${value === selectedCategory ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></label>
            <label class="field"><span>Thương hiệu</span><select name="brand"><option value="">Tất cả thương hiệu</option>${brands.map((value) => `<option value="${escapeHtml(value)}" ${value === selectedBrand ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></label>
            <fieldset class="filter-group"><legend>Khoảng giá</legend><label><input type="radio" name="price" value="" checked> Tất cả</label><label><input type="radio" name="price" value="under500"> Dưới 500.000₫</label><label><input type="radio" name="price" value="500to800"> 500.000₫–800.000₫</label><label><input type="radio" name="price" value="over800"> Trên 800.000₫</label></fieldset>
            <label class="field"><span>Layout</span><select name="layout"><option value="">Tất cả</option>${["60", "65", "75", "TKL", "Full", "Alice"].map((value) => `<option value="${value}">${value}${/^\d+$/.test(value) ? "%" : ""}</option>`).join("")}</select></label>
            <label class="field"><span>Kết nối</span><select name="connection"><option value="">Tất cả</option>${["Dây", "2.4G", "Bluetooth", "3 mode"].map((value) => `<option value="${value}">${value}</option>`).join("")}</select></label>
            <label class="field"><span>Loại switch</span><select name="switchType"><option value="">Tất cả</option><option>Linear</option><option>Tactile</option><option>Clicky</option></select></label>
            <label class="check-row"><input type="checkbox" name="hotSwap"> Chỉ sản phẩm hot-swap</label><label class="check-row"><input type="checkbox" name="inStock"> Chỉ sản phẩm còn hàng</label>
          </form>
        </aside>
        <div class="catalog-results">
          <div class="catalog-toolbar"><button class="btn btn--outline btn--small filter-toggle" type="button" data-action="toggle-filters">${icon("filter")}Bộ lọc</button><p><strong data-result-count>${all.length}</strong> sản phẩm</p><label><span class="sr-only">Sắp xếp</span><select data-product-sort><option value="newest" ${selectedSort === "newest" ? "selected" : ""}>Mới nhất</option><option value="price-asc" ${selectedSort === "price-asc" ? "selected" : ""}>Giá tăng dần</option><option value="price-desc" ${selectedSort === "price-desc" ? "selected" : ""}>Giá giảm dần</option><option value="popular" ${selectedSort === "popular" ? "selected" : ""}>Được xem nhiều</option></select></label></div>
          <div data-product-results>${productSection(all)}</div>
        </div>
      </div></section>`;

    const form = document.querySelector("[data-product-filters]");
    const sort = document.querySelector("[data-product-sort]");
    const rerender = () => {
      const data = new FormData(form);
      const controls = {
        query: String(data.get("query") || ""), category: String(data.get("category") || ""), brand: String(data.get("brand") || ""), price: String(data.get("price") || ""), layout: String(data.get("layout") || ""), connection: String(data.get("connection") || ""), switchType: String(data.get("switchType") || ""), hotSwap: data.get("hotSwap") === "on", inStock: data.get("inStock") === "on",
      };
      const filtered = sortProducts(filterProducts(all, controls), sort.value);
      document.querySelector("[data-result-count]").textContent = filtered.length;
      document.querySelector("[data-product-results]").innerHTML = filtered.length ? productSection(filtered) : emptyState("Không có sản phẩm phù hợp", "Hãy bỏ bớt bộ lọc hoặc thử từ khóa khác.", "Xem tất cả", "san-pham.html");
    };
    form.addEventListener("input", rerender);
    form.addEventListener("change", rerender);
    sort.addEventListener("change", rerender);
    document.querySelector('[data-action="clear-filters"]').addEventListener("click", () => { form.reset(); rerender(); });
    document.querySelector('[data-action="toggle-filters"]').addEventListener("click", () => document.querySelector("[data-filter-panel]").classList.toggle("is-open"));
    rerender();
  }

  function selectedOptionsFromForm(form, product) {
    const data = new FormData(form);
    return Object.fromEntries((product.options || []).map((option, index) => [option.name, data.get(`option-${index}`) || option.values[0] || ""]));
  }

  function renderProduct() {
    const key = params().get("sp") || "";
    const product = store.getProduct(key);
    if (!product) {
      setTitle("Không tìm thấy sản phẩm");
      document.getElementById("main-content").innerHTML = `${breadcrumbs([{ label: "Sản phẩm", url: "san-pham.html" }, { label: "Không tìm thấy" }])}<section class="section"><div class="container">${emptyState("Không tìm thấy sản phẩm", "Sản phẩm có thể đã được ẩn hoặc đường dẫn không còn đúng.", "Quay lại sản phẩm", "san-pham.html")}</div></section>`;
      return;
    }
    setTitle(product.name);
    const productUrl = `${window.HAN_CONFIG.domain}/chi-tiet.html?sp=${encodeURIComponent(product.slug)}`;
    const productDescription = (product.shortDescription || `Xem giá, thông số và tồn kho ${product.name} tại HANKeyboard.`).slice(0, 180);
    setCanonical(productUrl);
    setMeta('meta[name="description"]', "content", productDescription);
    setMeta('meta[property="og:type"]', "content", "product");
    setMeta('meta[property="og:title"]', "content", `${product.name} | HANKeyboard`);
    setMeta('meta[property="og:description"]', "content", productDescription);
    setMeta('meta[property="og:url"]', "content", productUrl);
    if (product.images[0]) setMeta('meta[property="og:image"]', "content", product.images[0]);
    document.getElementById("product-jsonld")?.remove();
    const structuredData = document.createElement("script");
    structuredData.id = "product-jsonld";
    structuredData.type = "application/ld+json";
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      sku: product.id,
      description: productDescription,
      ...(product.images.length ? { image: product.images } : {}),
      brand: { "@type": "Brand", name: product.brand || "HANKeyboard" },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "VND",
        price: String(product.price),
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    });
    document.head.appendChild(structuredData);
    store.addRecent(product.id);
    const images = product.images.length ? product.images : [""];
    const lightboxImages = product.images.length ? product.images : ["assets/images/brand/hankeyboard-logomark-color.svg"];
    const favorite = store.getFavorites().includes(product.id);
    const related = window.HAN_STATE.products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
    const recent = store.getRecentProducts(product.id).slice(0, 4);
    const main = document.getElementById("main-content");
    main.innerHTML = `${breadcrumbs([{ label: "Sản phẩm", url: "san-pham.html" }, { label: product.name }])}
      <section class="section product-detail"><div class="container product-detail__grid">
        <div class="gallery" data-gallery>
          <button class="gallery__main" type="button" data-action="open-gallery" aria-label="Phóng to ảnh sản phẩm">${images[0] ? `<img src="${escapeHtml(images[0])}" alt="${escapeHtml(product.name)}" width="900" height="900">` : store.productImage(product)}</button>
          ${images.length > 1 ? `<div class="gallery__thumbs">${images.map((image, index) => `<button type="button" data-action="gallery-image" data-src="${escapeHtml(image)}" class="${index === 0 ? "is-active" : ""}" aria-label="Xem ảnh ${index + 1}"><img src="${escapeHtml(image)}" alt="" loading="lazy" width="120" height="120"></button>`).join("")}</div>` : ""}
        </div>
        <div class="product-info">
          <p class="product-card__brand">${escapeHtml(product.brand)} · ${escapeHtml(product.id)}</p>
          <h1>${escapeHtml(product.name)}</h1>
          <p class="product-lead">${escapeHtml(product.shortDescription)}</p>
          <div class="detail-price"><span>${formatMoney(product.price)}</span>${product.compareAtPrice > product.price ? `<del>${formatMoney(product.compareAtPrice)}</del>` : ""}</div>
          <div class="stock-status ${product.stock > 0 ? "is-in" : "is-out"}">${product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Tạm hết hàng"}</div>
          <form class="purchase-box" data-purchase-form>
            ${(product.options || []).map((option, index) => `<fieldset class="option-group"><legend>${escapeHtml(option.name)}</legend><div>${option.values.map((value, valueIndex) => `<label><input type="radio" name="option-${index}" value="${escapeHtml(value)}" ${valueIndex === 0 ? "checked" : ""}><span>${escapeHtml(value)}</span></label>`).join("")}</div></fieldset>`).join("")}
            <div class="quantity-row"><span>Số lượng</span><div class="quantity-control"><button type="button" data-action="quantity-minus" aria-label="Giảm số lượng">${icon("minus")}</button><input name="quantity" type="number" min="1" max="${product.stock}" value="1" inputmode="numeric" aria-label="Số lượng"><button type="button" data-action="quantity-plus" aria-label="Tăng số lượng">${icon("plus")}</button></div></div>
            <div class="purchase-actions"><button class="btn btn--primary btn--block" type="submit" ${product.stock <= 0 ? "disabled" : ""}>${icon("cart")}Thêm vào giỏ</button><button class="btn btn--dark btn--block" type="button" data-action="buy-now" ${product.stock <= 0 ? "disabled" : ""}>Mua ngay</button></div>
          </form>
          <button class="favorite-wide${favorite ? " is-active" : ""}" type="button" data-action="favorite" data-product-id="${escapeHtml(product.id)}" aria-pressed="${favorite}">${icon("heart")} ${favorite ? "Đã lưu sản phẩm" : "Lưu sản phẩm yêu thích"}</button>
          <div class="detail-promises"><p>${icon("shield")} Đổi 1–1 hoặc hoàn tiền trong 7 ngày nếu lỗi nhà sản xuất</p><p>${icon("refresh")} ${escapeHtml(product.warranty || "Bảo hành 30 ngày")}</p><p>${icon("chat")} Cần nghe âm thanh gõ? Nhắn Zalo để shop gửi video thực tế.</p></div>
        </div>
      </div></section>
      <section class="section section--soft"><div class="container detail-content-grid"><article class="product-copy"><h2>Thông tin sản phẩm</h2>${product.description.length ? product.description.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("") : `<p>${escapeHtml(product.shortDescription)}</p>`}</article><aside class="spec-card"><h2>Thông số kỹ thuật</h2><dl>${product.specs.map((spec) => `<div><dt>${escapeHtml(spec.label)}</dt><dd>${escapeHtml(spec.value)}</dd></div>`).join("")}</dl></aside></div></section>
      ${product.video ? `<section class="section"><div class="container"><div class="section-head"><div><p class="section-kicker">Video thực tế</p><h2 class="section-title">Nghe thử âm thanh gõ</h2></div></div><div class="video-wrap"><iframe src="${escapeHtml(product.video)}" title="Video gõ thử ${escapeHtml(product.name)}" loading="lazy" allowfullscreen></iframe></div></div></section>` : ""}
      ${related.length ? `<section class="section"><div class="container"><div class="section-head"><div><p class="section-kicker">Cùng danh mục</p><h2 class="section-title">Sản phẩm liên quan</h2></div></div>${productSection(related)}</div></section>` : ""}
      ${recent.length ? `<section class="section section--soft"><div class="container"><div class="section-head"><div><p class="section-kicker">Lịch sử gần đây</p><h2 class="section-title">Bạn vừa xem</h2></div></div>${productSection(recent)}</div></section>` : ""}
      <div class="lightbox" data-lightbox hidden role="dialog" aria-modal="true" aria-label="Xem ảnh ${escapeHtml(product.name)}">
        <button class="lightbox__backdrop" type="button" data-action="close-lightbox" aria-label="Đóng"></button>
        <div class="lightbox__content">
          <button class="lightbox__close" type="button" data-action="close-lightbox" aria-label="Đóng">${icon("close")}</button>
          ${lightboxImages.length > 1 ? `<button class="lightbox__nav lightbox__nav--prev" type="button" data-action="lightbox-prev" aria-label="Ảnh trước">‹</button>` : ""}
          <img data-lightbox-image src="${escapeHtml(lightboxImages[0])}" alt="${escapeHtml(product.name)}" width="1200" height="1200">
          ${lightboxImages.length > 1 ? `<button class="lightbox__nav lightbox__nav--next" type="button" data-action="lightbox-next" aria-label="Ảnh tiếp">›</button>` : ""}
          <p data-lightbox-count>1 / ${lightboxImages.length}</p>
        </div>
      </div>`;

    const form = document.querySelector("[data-purchase-form]");
    const quantityInput = form.querySelector('[name="quantity"]');
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      store.addToCart(product.id, Number(quantityInput.value), selectedOptionsFromForm(form, product));
      store.toast("Đã thêm sản phẩm vào giỏ.", "success");
    });
    form.querySelector('[data-action="buy-now"]').addEventListener("click", () => {
      store.addToCart(product.id, Number(quantityInput.value), selectedOptionsFromForm(form, product));
      location.href = "thanh-toan.html";
    });
    form.querySelector('[data-action="quantity-minus"]').addEventListener("click", () => { quantityInput.value = Math.max(1, Number(quantityInput.value) - 1); });
    form.querySelector('[data-action="quantity-plus"]').addEventListener("click", () => { quantityInput.value = Math.min(product.stock, Number(quantityInput.value) + 1); });
    document.querySelectorAll('[data-action="gallery-image"]').forEach((button) => button.addEventListener("click", () => {
      const image = document.querySelector(".gallery__main img");
      if (image) image.src = button.dataset.src;
      document.querySelectorAll('[data-action="gallery-image"]').forEach((item) => item.classList.toggle("is-active", item === button));
    }));
    const lightbox = document.querySelector("[data-lightbox]");
    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const lightboxCount = lightbox.querySelector("[data-lightbox-count]");
    let lightboxIndex = 0;
    const updateLightbox = () => {
      lightboxImage.src = lightboxImages[lightboxIndex];
      lightboxCount.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    };
    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
      document.querySelector('[data-action="open-gallery"]')?.focus();
    };
    document.querySelector('[data-action="open-gallery"]').addEventListener("click", () => {
      const currentSource = document.querySelector(".gallery__main img")?.getAttribute("src");
      lightboxIndex = Math.max(0, lightboxImages.indexOf(currentSource));
      updateLightbox();
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lightbox.querySelector(".lightbox__close").focus();
    });
    lightbox.querySelectorAll('[data-action="close-lightbox"]').forEach((button) => button.addEventListener("click", closeLightbox));
    lightbox.querySelector('[data-action="lightbox-prev"]')?.addEventListener("click", () => { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; updateLightbox(); });
    lightbox.querySelector('[data-action="lightbox-next"]')?.addEventListener("click", () => { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; updateLightbox(); });
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft" && lightboxImages.length > 1) { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; updateLightbox(); }
      if (event.key === "ArrowRight" && lightboxImages.length > 1) { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; updateLightbox(); }
    });
  }

  function bindProductActions() {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-action]");
      if (!trigger) return;
      const action = trigger.dataset.action;
      const productId = trigger.dataset.productId;
      if (action === "quick-add" && productId) {
        const product = store.getProduct(productId);
        const options = Object.fromEntries((product.options || []).map((option) => [option.name, option.values[0] || ""]));
        try {
          store.addToCart(productId, 1, options);
          store.toast("Đã thêm vào giỏ hàng.", "success");
        } catch (error) {
          store.toast(error.message, "error");
        }
      }
      if (action === "favorite" && productId) {
        const active = store.toggleFavorite(productId);
        document.querySelectorAll(`[data-action="favorite"][data-product-id="${CSS.escape(productId)}"]`).forEach((button) => {
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
          const label = button.querySelector("svg")?.nextSibling;
          if (label && button.classList.contains("favorite-wide")) label.textContent = active ? " Đã lưu sản phẩm" : " Lưu sản phẩm yêu thích";
        });
        store.toast(active ? "Đã lưu sản phẩm yêu thích." : "Đã bỏ khỏi yêu thích.", "success");
      }
    });
  }

  function renderFavorites() {
    setTitle("Sản phẩm đã thích");
    const favoriteIds = store.getFavorites();
    const products = favoriteIds.map(store.getProduct).filter(Boolean);
    document.getElementById("main-content").innerHTML = `${breadcrumbs([{ label: "Sản phẩm đã thích" }])}${pageHeader("Sản phẩm đã thích", "Danh sách được lưu riêng trên trình duyệt này trong thời gian bạn sử dụng.", "Của bạn")}<section class="section"><div class="container">${products.length ? productSection(products) : emptyState("Chưa có sản phẩm đã thích", "Bấm biểu tượng trái tim trên sản phẩm để lưu lại và so sánh sau.", "Khám phá sản phẩm", "san-pham.html")}</div></section>`;
  }

  function renderCart() {
    setTitle("Giỏ hàng");
    const main = document.getElementById("main-content");
    const draw = () => {
      const cart = store.cartDetails();
      main.innerHTML = `${breadcrumbs([{ label: "Giỏ hàng" }])}${pageHeader("Giỏ hàng", "Kiểm tra đúng phiên bản và số lượng trước khi sang bước giao hàng.", "Đơn của bạn")}
        <section class="section"><div class="container">${cart.items.length ? `<div class="cart-layout">
          <div class="cart-lines"><div class="cart-lines__head"><h2>${cart.quantity} sản phẩm</h2><a href="san-pham.html">Tiếp tục mua</a></div>${cart.items.map((item) => `<article class="cart-line" data-cart-key="${escapeHtml(item.key)}">
            <a class="cart-line__image" href="${store.productUrl(item.product)}">${store.productImage(item.product)}</a>
            <div class="cart-line__info"><p class="product-card__brand">${escapeHtml(item.product.brand)}</p><h3><a href="${store.productUrl(item.product)}">${escapeHtml(item.product.name)}</a></h3>${Object.keys(item.options || {}).length ? `<p>${Object.entries(item.options).map(([name, value]) => `${escapeHtml(name)}: ${escapeHtml(value)}`).join(" · ")}</p>` : ""}<strong>${formatMoney(item.product.price)}</strong></div>
            <div class="cart-line__controls"><div class="quantity-control"><button type="button" data-cart-action="minus" aria-label="Giảm số lượng">${icon("minus")}</button><input type="number" min="1" max="${item.product.stock}" value="${item.quantity}" inputmode="numeric" aria-label="Số lượng ${escapeHtml(item.product.name)}"><button type="button" data-cart-action="plus" aria-label="Tăng số lượng">${icon("plus")}</button></div><button class="remove-button" type="button" data-cart-action="remove">${icon("trash")} Xóa</button></div>
          </article>`).join("")}</div>
          <aside class="order-summary"><h2>Tóm tắt đơn</h2><dl><div><dt>Tạm tính</dt><dd>${formatMoney(cart.subtotal)}</dd></div><div><dt>Phí giao hàng</dt><dd>Tính ở bước sau</dd></div></dl>${cart.subtotal < content.shop.shipping.freeThreshold ? `<div class="shipping-progress"><span style="--progress:${Math.min(100, Math.round(cart.subtotal / content.shop.shipping.freeThreshold * 100))}%"></span></div><p>Mua thêm <strong>${formatMoney(content.shop.shipping.freeThreshold - cart.subtotal)}</strong> để được miễn phí giao tiêu chuẩn.</p>` : '<p class="success-text">Đơn hàng đã đạt mức miễn phí giao tiêu chuẩn.</p>'}<div class="summary-total"><span>Tạm tính</span><strong>${formatMoney(cart.subtotal)}</strong></div><a class="btn btn--primary btn--block" href="thanh-toan.html">Tiến hành đặt hàng ${icon("arrow")}</a><small>Chưa thanh toán ở bước này. Shop sẽ xác nhận tồn kho sau khi nhận đơn.</small></aside>
        </div>` : emptyState("Giỏ hàng đang trống", "Chọn sản phẩm phù hợp rồi thêm vào giỏ. Giỏ hàng được giữ trên thiết bị này trong 30 ngày.", "Xem sản phẩm", "san-pham.html")}</div></section>`;
      if (!cart.items.length) return;
      main.querySelectorAll("[data-cart-key]").forEach((line) => {
        const key = line.dataset.cartKey;
        const input = line.querySelector("input");
        line.addEventListener("click", (event) => {
          const action = event.target.closest("[data-cart-action]")?.dataset.cartAction;
          if (!action) return;
          if (action === "remove") store.removeCartItem(key);
          if (action === "minus") store.updateCartItem(key, Number(input.value) - 1);
          if (action === "plus") store.updateCartItem(key, Number(input.value) + 1);
          draw();
        });
        input.addEventListener("change", () => { store.updateCartItem(key, Number(input.value)); draw(); });
      });
    };
    draw();
  }

  const VIETNAM_PROVINCES = ["An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Nội", "Hà Tĩnh", "Hải Phòng", "Huế", "Hưng Yên", "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "TP. Hồ Chí Minh", "Tuyên Quang", "Vĩnh Long"];

  async function loadAddressData() {
    const cached = store.readStorage(store.storageKeys.addressCache, null);
    if (cached) return cached;
    try {
      const response = await fetch(`${window.HAN_CONFIG.addressApiUrl}?depth=2`, { mode: "cors" });
      if (!response.ok) throw new Error("Address API error");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Address data invalid");
      store.writeStorage(store.storageKeys.addressCache, data, 30);
      return data;
    } catch {
      return [];
    }
  }

  function renderCheckoutSummary(cart, shipping, discount = 0) {
    const total = Math.max(0, cart.subtotal + shipping - discount);
    return `<h2>Đơn hàng</h2><div class="checkout-items">${cart.items.map((item) => `<div><span>${escapeHtml(item.product.name)} <small>×${item.quantity}</small></span><strong>${formatMoney(item.product.price * item.quantity)}</strong></div>`).join("")}</div><dl><div><dt>Tạm tính</dt><dd>${formatMoney(cart.subtotal)}</dd></div><div><dt>Phí giao hàng</dt><dd>${shipping ? formatMoney(shipping) : "Miễn phí"}</dd></div>${discount ? `<div class="discount-row"><dt>Giảm giá</dt><dd>−${formatMoney(discount)}</dd></div>` : ""}</dl><div class="summary-total"><span>Tổng cộng</span><strong>${formatMoney(total)}</strong></div><p class="summary-note">Giá đã gồm mọi khoản hiển thị. Shop xác nhận lại phí nếu khách chọn giao hỏa tốc.</p>`;
  }

  function renderCheckout() {
    setTitle("Thanh toán");
    const cart = store.cartDetails();
    const main = document.getElementById("main-content");
    if (!cart.items.length) {
      main.innerHTML = `${breadcrumbs([{ label: "Giỏ hàng", url: "gio-hang.html" }, { label: "Thanh toán" }])}<section class="section"><div class="container">${emptyState("Chưa có sản phẩm để đặt", "Giỏ hàng đang trống hoặc đã hết hạn.", "Chọn sản phẩm", "san-pham.html")}</div></section>`;
      return;
    }
    const profile = store.getProfile();
    main.innerHTML = `${breadcrumbs([{ label: "Giỏ hàng", url: "gio-hang.html" }, { label: "Thanh toán" }])}${pageHeader("Thông tin đặt hàng", "Không cần tài khoản. Thông tin giao hàng có thể được lưu trên thiết bị để dùng cho lần sau.", "Bước cuối")}
      <section class="section checkout-section"><div class="container checkout-layout">
        <form class="checkout-form" data-checkout-form novalidate>
          ${!api.isConfigured() && !api.canUseLocalDemo() ? `<div class="status-banner status-banner--warning">${icon("info")}<div><strong>Kênh đặt hàng trực tuyến đang được kết nối</strong><p>Bạn vẫn có thể xem giỏ hàng và gửi danh sách sản phẩm qua Zalo. Nút đặt hàng sẽ hoạt động ngay khi backend Apps Script được triển khai.</p><a class="text-link" href="${window.HAN_CONFIG.zaloUrl}" target="_blank" rel="noopener">Mở Zalo shop ${icon("arrow")}</a></div></div>` : ""}
          <section class="form-section"><div class="form-section__head"><span>1</span><div><h2>Người nhận</h2><p>Shop dùng thông tin này để xác nhận và giao đơn.</p></div></div><div class="form-grid">
            <label class="field field--wide"><span>Họ và tên *</span><input name="name" autocomplete="name" value="${escapeHtml(profile.name || "")}" required minlength="3" placeholder="Ví dụ: Nguyễn Minh Anh"><small data-error-for="name"></small></label>
            <label class="field"><span>Số điện thoại *</span><input name="phone" inputmode="tel" autocomplete="tel" value="${escapeHtml(profile.phone || "")}" required pattern="0[0-9]{9}" placeholder="0xxxxxxxxx"><small data-error-for="phone"></small></label>
            <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" value="${escapeHtml(profile.email || "")}" placeholder="ten@email.com"><small data-error-for="email"></small></label>
            <label class="check-row field--wide"><input type="checkbox" name="sameZalo" ${profile.sameZalo !== false ? "checked" : ""}> Số Zalo trùng số điện thoại</label>
            <label class="field field--wide"><span>Số Zalo</span><input name="zalo" inputmode="tel" value="${escapeHtml(profile.zalo || profile.phone || "")}" placeholder="0xxxxxxxxx"><small>Phải có ít nhất email hoặc số Zalo.</small><small data-error-for="contact"></small></label>
          </div></section>
          <section class="form-section"><div class="form-section__head"><span>2</span><div><h2>Cách nhận hàng</h2><p>Địa chỉ Việt Nam hiện dùng mô hình Tỉnh/Thành phố → Phường/Xã/Đặc khu.</p></div></div>
            <div class="choice-grid"><label class="choice-card"><input type="radio" name="deliveryMethod" value="delivery" checked><span>${icon("truck")}<strong>Giao tận nơi</strong><small>Giao tiêu chuẩn toàn quốc</small></span></label><label class="choice-card"><input type="radio" name="deliveryMethod" value="pickup"><span>${icon("map")}<strong>Nhận tại shop</strong><small>Kiến Hưng, Hà Đông</small></span></label></div>
            <div class="form-grid address-fields" data-address-fields><label class="field"><span>Tỉnh/Thành phố *</span><select name="province" required><option value="">Chọn Tỉnh/Thành phố</option>${VIETNAM_PROVINCES.map((province) => `<option value="${escapeHtml(province)}" ${profile.province === province ? "selected" : ""}>${escapeHtml(province)}</option>`).join("")}</select><small data-error-for="province"></small></label>
              <label class="field"><span>Phường/Xã/Đặc khu *</span><input name="ward" list="ward-options" value="${escapeHtml(profile.ward || "")}" required autocomplete="address-level3" placeholder="Chọn hoặc nhập tên"><datalist id="ward-options"></datalist><small data-address-hint>Đang tải danh sách địa giới mới...</small><small data-error-for="ward"></small></label>
              <label class="field field--wide"><span>Địa chỉ cụ thể *</span><input name="address" autocomplete="street-address" value="${escapeHtml(profile.address || "")}" required placeholder="Số nhà, ngõ, đường, thôn/tổ"><small data-error-for="address"></small></label></div>
          </section>
          <section class="form-section"><div class="form-section__head"><span>3</span><div><h2>Thanh toán</h2><p>Shop không yêu cầu và không lưu thông tin thẻ ngân hàng.</p></div></div><div class="choice-grid"><label class="choice-card"><input type="radio" name="paymentMethod" value="bank" checked><span>${icon("copy")}<strong>Chuyển khoản QR</strong><small>QR tự điền số tiền và mã đơn</small></span></label><label class="choice-card"><input type="radio" name="paymentMethod" value="cod"><span>${icon("package")}<strong>COD</strong><small>Cọc 30.000₫ sau khi đặt</small></span></label></div></section>
          <section class="form-section"><div class="form-section__head"><span>4</span><div><h2>Ghi chú và xác nhận</h2></div></div><label class="field"><span>Ghi chú</span><textarea name="note" rows="3" placeholder="Thời gian nhận, yêu cầu gọi trước..."></textarea></label><div class="coupon-row"><label class="field"><span>Mã giảm giá</span><input name="coupon" autocomplete="off" placeholder="Nhập mã nếu có"></label><button class="btn btn--outline" type="button" data-action="apply-coupon">Áp dụng</button></div><p class="coupon-message" data-coupon-message></p><label class="check-row terms-check"><input type="checkbox" name="agree" required> Tôi đồng ý với <a href="chinh-sach.html?loai=terms" target="_blank">điều khoản mua hàng</a> và <a href="chinh-sach.html?loai=privacy" target="_blank">chính sách bảo mật</a>.</label><small data-error-for="agree"></small><button class="btn btn--primary btn--block checkout-submit" type="submit">Đặt hàng</button><p class="secure-note">${icon("lock")} Thông tin được dùng để xử lý đơn và hỗ trợ sau bán.</p></section>
        </form>
        <aside class="order-summary order-summary--sticky" data-checkout-summary></aside>
      </div></section>`;

    const form = document.querySelector("[data-checkout-form]");
    const summary = document.querySelector("[data-checkout-summary]");
    const sameZalo = form.elements.sameZalo;
    const phone = form.elements.phone;
    const zalo = form.elements.zalo;
    const province = form.elements.province;
    const ward = form.elements.ward;
    const deliveryRadios = [...form.elements.deliveryMethod];
    let discount = 0;
    let submitting = false;

    const syncZalo = () => { zalo.readOnly = sameZalo.checked; if (sameZalo.checked) zalo.value = phone.value; };
    const totals = () => {
      const method = new FormData(form).get("deliveryMethod");
      const shipping = store.shippingFee(cart.subtotal, cart.quantity, method, province.value);
      const total = Math.max(0, cart.subtotal + shipping - discount);
      summary.innerHTML = renderCheckoutSummary(cart, shipping, discount);
      return { subtotal: cart.subtotal, shipping, discount, total };
    };
    const toggleAddress = () => {
      const pickup = new FormData(form).get("deliveryMethod") === "pickup";
      document.querySelector("[data-address-fields]").classList.toggle("is-hidden", pickup);
      [province, ward, form.elements.address].forEach((input) => { input.required = !pickup; });
      totals();
    };
    syncZalo();
    totals();
    sameZalo.addEventListener("change", syncZalo);
    phone.addEventListener("input", syncZalo);
    deliveryRadios.forEach((input) => input.addEventListener("change", toggleAddress));
    province.addEventListener("change", totals);

    loadAddressData().then((addressData) => {
      const hint = document.querySelector("[data-address-hint]");
      if (!addressData.length) {
        hint.textContent = "Không tải được danh sách; vui lòng nhập đúng tên phường/xã theo địa chỉ hiện tại.";
        return;
      }
      hint.textContent = "Có thể gõ để tìm nhanh trong danh sách địa giới sau 01/07/2025.";
      const updateWards = () => {
        const selected = addressData.find((item) => String(item.name || "").toLowerCase().includes(province.value.toLowerCase()));
        const wards = selected?.wards || selected?.communes || selected?.districts?.flatMap((district) => district.wards || []) || [];
        document.getElementById("ward-options").innerHTML = wards.map((item) => `<option value="${escapeHtml(item.name || item)}"></option>`).join("");
      };
      province.addEventListener("change", updateWards);
      updateWards();
    });

    form.querySelector('[data-action="apply-coupon"]').addEventListener("click", async () => {
      const code = form.elements.coupon.value.trim().toUpperCase();
      const message = document.querySelector("[data-coupon-message]");
      if (!code) { message.textContent = "Nhập mã trước khi áp dụng."; return; }
      try {
        const result = await api.validateCoupon(code, cart.subtotal);
        if (!result.valid) throw new Error(result.message || "Mã không hợp lệ hoặc đã hết hạn.");
        discount = Number(result.discount) || 0;
        message.textContent = `Đã áp dụng ${code}: giảm ${formatMoney(discount)}.`;
        message.className = "coupon-message success-text";
        totals();
      } catch (error) {
        discount = 0;
        message.textContent = error.message;
        message.className = "coupon-message error-text";
        totals();
      }
    });

    function showError(name, message) {
      const target = form.querySelector(`[data-error-for="${name}"]`);
      if (target) target.textContent = message;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitting) return;
      form.querySelectorAll("[data-error-for]").forEach((element) => { element.textContent = ""; });
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const normalizedPhone = store.normalizePhone(data.get("phone"));
      const email = String(data.get("email") || "").trim();
      const zaloNumber = store.normalizePhone(data.get("zalo"));
      const deliveryMethod = String(data.get("deliveryMethod"));
      let valid = true;
      if (name.split(/\s+/).length < 2) { showError("name", "Vui lòng nhập đầy đủ họ và tên."); valid = false; }
      if (!/^0\d{9}$/.test(normalizedPhone)) { showError("phone", "Số điện thoại cần có 10 chữ số và bắt đầu bằng 0."); valid = false; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("email", "Email chưa đúng định dạng."); valid = false; }
      if (!email && !/^0\d{9}$/.test(zaloNumber)) { showError("contact", "Vui lòng nhập email hoặc số Zalo để shop gửi thông tin đơn."); valid = false; }
      if (deliveryMethod === "delivery" && !province.value) { showError("province", "Vui lòng chọn Tỉnh/Thành phố."); valid = false; }
      if (deliveryMethod === "delivery" && !ward.value.trim()) { showError("ward", "Vui lòng nhập Phường/Xã/Đặc khu."); valid = false; }
      if (deliveryMethod === "delivery" && !String(data.get("address") || "").trim()) { showError("address", "Vui lòng nhập địa chỉ cụ thể."); valid = false; }
      if (!data.get("agree")) { showError("agree", "Bạn cần đồng ý điều khoản trước khi đặt hàng."); valid = false; }
      if (!valid) { form.querySelector("[data-error-for]:not(:empty)")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      const currentTotals = totals();
      const order = {
        customer: { name, phone: normalizedPhone, email, zalo: zaloNumber },
        shipping: { method: deliveryMethod, province: province.value, ward: ward.value.trim(), address: String(data.get("address") || "").trim(), note: String(data.get("note") || "").trim() },
        paymentMethod: String(data.get("paymentMethod")),
        couponCode: String(data.get("coupon") || "").trim().toUpperCase(),
        items: cart.items.map((item) => ({ productId: item.product.id, name: item.product.name, options: item.options, quantity: item.quantity, unitPrice: item.product.price, lineTotal: item.product.price * item.quantity })),
        totals: currentTotals,
        source: "website",
        deviceId: store.getDeviceId(),
      };
      const button = form.querySelector('[type="submit"]');
      submitting = true;
      button.disabled = true;
      button.textContent = "Đang ghi nhận đơn...";
      try {
        const result = await api.createOrder(order);
        const profileToSave = { name, phone: normalizedPhone, email, zalo: zaloNumber, sameZalo: sameZalo.checked, province: province.value, ward: ward.value.trim(), address: String(data.get("address") || "").trim() };
        store.saveProfile(profileToSave);
        sessionStorage.setItem("han_last_order", JSON.stringify({ ...order, ...result, createdAt: new Date().toISOString() }));
        store.saveCart({ items: [] });
        const orderCode = result.orderCode || result.ma_don || result.code;
        location.href = `cam-on.html?ma=${encodeURIComponent(orderCode)}${result.demo ? "&demo=1" : ""}`;
      } catch (error) {
        store.toast(error.message, "error");
        button.disabled = false;
        button.textContent = "Đặt hàng";
        submitting = false;
      }
    });
  }

  function renderThanks() {
    setTitle("Cảm ơn bạn đã đặt hàng");
    let order = null;
    try { order = JSON.parse(sessionStorage.getItem("han_last_order") || "null"); } catch { order = null; }
    const code = params().get("ma") || order?.orderCode || order?.ma_don || "";
    if (order && ![order.orderCode, order.ma_don, order.code].includes(code)) order = null;
    const paymentMethod = order?.paymentMethod || "bank";
    const total = order?.totals?.total || order?.total || 0;
    const qrAmount = paymentMethod === "cod" ? content.shop.shipping.codDeposit : total;
    const qr = order?.qrUrl || api.vietQrUrl(qrAmount, code);
    document.getElementById("main-content").innerHTML = `<section class="thanks-hero"><div class="container thanks-card"><span class="thanks-icon">${icon("check")}</span><p class="section-kicker">Đã ghi nhận</p><h1>Cảm ơn bạn đã đặt hàng</h1><p>Mã đơn của bạn</p><button class="order-code" type="button" data-copy="${escapeHtml(code)}" aria-label="Sao chép mã đơn">${escapeHtml(code || "Đang cập nhật")} ${icon("copy")}</button><p class="thanks-note">Shop sẽ kiểm tra tồn kho và liên hệ xác nhận qua số điện thoại/Zalo hoặc email bạn đã cung cấp.</p></div></section>
      ${code ? `<section class="section"><div class="container thanks-layout"><div class="payment-card"><p class="section-kicker">${paymentMethod === "cod" ? "Xác nhận COD" : "Thanh toán chuyển khoản"}</p><h2>${paymentMethod === "cod" ? `Cọc ${formatMoney(qrAmount)}` : `Thanh toán ${formatMoney(qrAmount)}`}</h2><img src="${escapeHtml(qr)}" alt="Mã QR thanh toán đơn ${escapeHtml(code)}" width="320" height="320"><dl><div><dt>Ngân hàng</dt><dd>${escapeHtml(content.shop.bank.name)}</dd></div><div><dt>Số tài khoản</dt><dd><strong>${escapeHtml(content.shop.bank.accountNumber)}</strong> <button type="button" class="copy-mini" data-copy="${escapeHtml(content.shop.bank.accountNumber)}">${icon("copy")}</button></dd></div><div><dt>Chủ tài khoản</dt><dd>${escapeHtml(content.shop.bank.accountName)}</dd></div><div><dt>Nội dung</dt><dd><strong>${escapeHtml(code)}</strong> <button type="button" class="copy-mini" data-copy="${escapeHtml(code)}">${icon("copy")}</button></dd></div></dl><p>Ghi đúng mã đơn trong nội dung để shop đối chiếu nhanh.</p></div><aside class="next-steps"><h2>Tiếp theo</h2><ol><li><span>1</span><p><strong>${paymentMethod === "cod" ? "Chuyển khoản tiền cọc" : "Hoàn tất chuyển khoản"}</strong>Quét QR hoặc sao chép thông tin bên cạnh.</p></li><li><span>2</span><p><strong>Chờ shop xác nhận</strong>Shop liên hệ sau khi kiểm tra tồn kho và khoản thanh toán.</p></li><li><span>3</span><p><strong>Theo dõi đơn</strong>Dùng mã đơn và số điện thoại tại trang tra cứu.</p></li></ol><a class="btn btn--primary btn--block" href="${content.shop.zaloUrl}" target="_blank" rel="noopener">${icon("chat")}Mở Zalo shop</a><a class="btn btn--outline btn--block" href="tra-cuu.html?ma=${encodeURIComponent(code)}">${icon("package")}Theo dõi đơn hàng</a></aside></div></section>` : `<section class="section"><div class="container">${emptyState("Không có mã đơn", "Hãy kiểm tra đường dẫn hoặc liên hệ shop để được hỗ trợ.", "Về trang chủ", "index.html")}</div></section>`}`;
    document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(button.dataset.copy); store.toast("Đã sao chép.", "success"); } catch { store.toast("Không thể sao chép tự động. Hãy bôi đen và sao chép.", "error"); }
    }));
  }

  const ORDER_STATUSES = ["Chờ xác nhận", "Đã xác nhận", "Chờ thanh toán", "Đã thanh toán", "Đang đóng gói", "Đã giao vận chuyển", "Hoàn thành"];

  function renderTrackingResult(order) {
    const status = order.status || order.trang_thai || "Chờ xác nhận";
    const statusIndex = Math.max(0, ORDER_STATUSES.indexOf(status));
    const items = order.items || order.chi_tiet || [];
    const total = order.totals?.total || order.total || order.tong_cong || 0;
    return `<div class="tracking-card"><div class="tracking-card__head"><div><p>Mã đơn</p><h2>${escapeHtml(order.code || order.ma_don || "")}</h2></div><span class="status-chip">${escapeHtml(status)}</span></div>
      ${status === "Đã hủy" ? '<div class="status-banner status-banner--danger">Đơn hàng đã hủy. Liên hệ shop nếu bạn cần kiểm tra lý do.</div>' : `<ol class="status-timeline">${ORDER_STATUSES.map((item, index) => `<li class="${index < statusIndex ? "is-done" : index === statusIndex ? "is-current" : ""}"><span>${index < statusIndex ? icon("check") : index + 1}</span><p>${escapeHtml(item)}</p></li>`).join("")}</ol>`}
      <div class="tracking-grid"><div><h3>Sản phẩm</h3>${items.length ? items.map((item) => `<div class="tracking-item"><span>${escapeHtml(item.name || item.ten_sp || item.productName || "Sản phẩm")} <small>×${item.quantity || item.so_luong || 1}</small></span><strong>${formatMoney(item.lineTotal || item.thanh_tien || 0)}</strong></div>`).join("") : "<p>Chi tiết sản phẩm sẽ được cập nhật sau khi shop xác nhận.</p>"}</div><div><h3>Thông tin giao</h3><p>${escapeHtml(order.shipping?.address || order.dia_chi || "Đang cập nhật")}</p>${order.trackingCode || order.ma_van_don ? `<p>Mã vận đơn: <strong>${escapeHtml(order.trackingCode || order.ma_van_don)}</strong></p>` : ""}<p>Tổng cộng: <strong>${formatMoney(total)}</strong></p></div></div>
      ${!["Đã thanh toán", "Đang đóng gói", "Đã giao vận chuyển", "Hoàn thành", "Đã hủy"].includes(status) && (order.paymentMethod || order.hinh_thuc_tt) !== "cod" ? `<div class="unpaid-box"><img src="${escapeHtml(api.vietQrUrl(total, order.code || order.ma_don))}" alt="QR thanh toán" width="180" height="180"><div><h3>Đơn chưa ghi nhận thanh toán</h3><p>Quét QR và ghi đúng mã đơn trong nội dung chuyển khoản.</p></div></div>` : ""}
    </div>`;
  }

  function renderTracking() {
    setTitle("Tra cứu đơn hàng");
    const prefilled = params().get("ma") || "";
    const main = document.getElementById("main-content");
    main.innerHTML = `${breadcrumbs([{ label: "Tra cứu đơn hàng" }])}${pageHeader("Tra cứu đơn hàng", "Nhập đúng mã đơn và số điện thoại đã dùng khi đặt. Cả hai thông tin phải khớp để bảo vệ dữ liệu.", "Theo dõi")}
      <section class="section section--soft"><div class="container tracking-layout"><form class="lookup-card" data-tracking-form><h2>Thông tin đơn</h2><label class="field"><span>Mã đơn hàng</span><input name="code" value="${escapeHtml(prefilled)}" placeholder="HAN-YYMMDD-NNN" required autocomplete="off"></label><label class="field"><span>Số điện thoại đặt hàng</span><input name="phone" inputmode="tel" placeholder="0xxxxxxxxx" required pattern="0[0-9]{9}"></label><button class="btn btn--primary btn--block" type="submit">${icon("search")}Tra cứu</button><p>Không nhớ mã đơn? <a href="${content.shop.zaloUrl}" target="_blank" rel="noopener">Nhắn Zalo ${content.shop.phoneDisplay}</a>.</p></form><div class="lookup-result" data-tracking-result>${emptyState("Kết quả sẽ hiển thị tại đây", "Thông tin đơn chỉ hiện khi mã đơn và số điện thoại cùng khớp.", "", "")}</div></div></section>`;
    const form = document.querySelector("[data-tracking-form]");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button");
      const data = new FormData(form);
      button.disabled = true;
      button.textContent = "Đang tra cứu...";
      try {
        const order = await api.trackOrder(String(data.get("code")).trim().toUpperCase(), data.get("phone"));
        document.querySelector("[data-tracking-result]").innerHTML = renderTrackingResult(order);
      } catch (error) {
        document.querySelector("[data-tracking-result]").innerHTML = `<div class="status-banner status-banner--danger">${icon("info")}<div><strong>Chưa tìm thấy đơn</strong><p>${escapeHtml(error.message)}</p></div></div>`;
      } finally {
        button.disabled = false;
        button.innerHTML = `${icon("search")}Tra cứu`;
      }
    });
  }

  function renderGuides() {
    setTitle("Hướng dẫn");
    document.getElementById("main-content").innerHTML = `${breadcrumbs([{ label: "Hướng dẫn" }])}${pageHeader("Hiểu sản phẩm trước khi mua", "Các bài viết ngắn, tập trung vào lựa chọn layout, switch và cách sử dụng bàn phím cơ an toàn.", "Kiến thức")}
      <section class="section"><div class="container guides-grid">${content.articles.map((article) => `<article class="guide-card"><a href="bai-viet.html?id=${encodeURIComponent(article.id)}"><span class="guide-card__index">${String(content.articles.indexOf(article) + 1).padStart(2, "0")}</span><p class="section-kicker">${escapeHtml(article.tag)} · ${escapeHtml(article.readTime)}</p><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.excerpt)}</p><span class="text-link">Đọc bài ${icon("arrow")}</span></a></article>`).join("")}</div></section>
      <section class="section section--soft"><div class="container help-banner"><div><p class="section-kicker">Cần tư vấn riêng?</p><h2>Gửi mẫu bàn phím bạn đang cân nhắc</h2><p>Shop giúp so sánh theo layout, kết nối, switch và ngân sách.</p></div><a class="btn btn--primary" href="${content.shop.zaloUrl}" target="_blank" rel="noopener">${icon("chat")}Nhắn Zalo</a></div></section>`;
  }

  function renderArticle() {
    const article = content.articles.find((item) => item.id === params().get("id")) || content.articles[0];
    setTitle(article.title);
    document.getElementById("main-content").innerHTML = `${breadcrumbs([{ label: "Hướng dẫn", url: "huong-dan.html" }, { label: article.title }])}<article class="article-page"><header class="article-header container"><p class="section-kicker">${escapeHtml(article.tag)} · ${escapeHtml(article.readTime)}</p><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.excerpt)}</p><div>Cập nhật ${formatDate(article.date)}</div></header><div class="article-body container">${article.body.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}</section>`).join("")}<aside class="article-cta"><h2>Muốn thử trực tiếp?</h2><p>Liên hệ shop trước khi tới để kiểm tra đúng mẫu và màu đang có.</p><a class="btn btn--primary" href="lien-he.html">Liên hệ HANKeyboard</a></aside></div></article>`;
  }

  function policyContent(policy) {
    return `<article class="policy-copy"><header><p>${escapeHtml(policy.intro)}</p></header>${policy.sections.map((section, index) => `<section><span class="policy-number">${String(index + 1).padStart(2, "0")}</span><div><h2>${escapeHtml(section.heading)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}</div></section>`).join("")}</article>`;
  }

  function renderPolicy() {
    const keys = ["warranty", "shipping", "privacy", "terms"];
    const selected = keys.includes(params().get("loai")) ? params().get("loai") : "warranty";
    const labels = { warranty: "Bảo hành & đổi trả", shipping: "Vận chuyển", privacy: "Bảo mật", terms: "Điều khoản" };
    setTitle(labels[selected]);
    document.getElementById("main-content").innerHTML = `${breadcrumbs([{ label: "Chính sách" }])}${pageHeader("Chính sách mua hàng", "Các điều kiện quan trọng được trình bày rõ để khách kiểm tra trước khi đặt.", "Minh bạch")}
      <section class="section"><div class="container policy-layout"><nav class="policy-nav" aria-label="Các chính sách">${keys.map((key) => `<a href="chinh-sach.html?loai=${key}" class="${key === selected ? "is-active" : ""}">${labels[key]} ${icon("chevron")}</a>`).join("")}</nav>${policyContent(content.policies[selected])}</div></section>`;
  }

  function renderAbout() {
    setTitle("Giới thiệu");
    document.getElementById("main-content").innerHTML = `${breadcrumbs([{ label: "Giới thiệu" }])}<section class="about-hero"><div class="container about-hero__grid"><div><p class="section-kicker">HANKeyboard</p><h1>Bàn phím nhập môn chất lượng, tư vấn vừa đủ.</h1><p>HANKeyboard là shop nhỏ tại Kiến Hưng, Hà Đông, tập trung vào bàn phím cơ, kit và phụ kiện dễ tiếp cận. Mục tiêu của shop là giúp người mới hiểu mình đang mua gì, thay vì phải tự giải mã hàng loạt thông số.</p></div><div class="about-mark"><img src="assets/images/brand/hankeyboard-primary-on-dark.svg" alt="HANKeyboard - bàn phím, phụ kiện, thiết bị ngoại vi" width="640" height="360"></div></div></section>
      <section class="section"><div class="container values-grid"><article><span>01</span><h2>Nói rõ điểm phù hợp</h2><p>Mỗi sản phẩm có ưu và nhược điểm. Shop tư vấn theo nhu cầu, không mặc định mẫu đắt hơn là tốt hơn.</p></article><article><span>02</span><h2>Thông tin kho rõ ràng</h2><p>Từng mã màu có tồn kho riêng. Đơn được kiểm tra lại trước khi shop xác nhận giao.</p></article><article><span>03</span><h2>Hỗ trợ sau bán</h2><p>Chính sách 30 ngày và quy trình 7 ngày đầu được công bố để khách biết cách xử lý khi sản phẩm lỗi.</p></article></div></section>
      <section class="section section--soft"><div class="container visit-panel"><div><p class="section-kicker">Ghé shop</p><h2 class="section-title">Kiến Hưng, Hà Đông</h2><p>${escapeHtml(content.shop.address)}<br>${escapeHtml(content.shop.openingHours)}</p><div class="hero__actions"><a class="btn btn--dark" href="${content.shop.mapUrl}" target="_blank" rel="noopener">${icon("map")}Mở bản đồ</a><a class="btn btn--outline" href="tel:${content.shop.phone}">${icon("phone")}Gọi shop</a></div></div><div class="visit-panel__mark"><img src="assets/images/brand/hankeyboard-logomark-color.svg" alt="" width="260" height="260"></div></div></section>`;
  }

  function renderContact() {
    setTitle("Liên hệ");
    document.getElementById("main-content").innerHTML = `${breadcrumbs([{ label: "Liên hệ" }])}${pageHeader("Liên hệ HANKeyboard", "Hỏi tồn kho, xin video gõ thử hoặc hẹn xem hàng trước khi tới shop.", "Hỗ trợ")}
      <section class="section"><div class="container contact-grid"><div class="contact-list"><a href="${content.shop.zaloUrl}" target="_blank" rel="noopener"><span>${icon("chat")}</span><div><small>Zalo</small><strong>${content.shop.phoneDisplay}</strong><p>Kênh phản hồi nhanh nhất</p></div>${icon("arrow")}</a><a href="tel:${content.shop.phone}"><span>${icon("phone")}</span><div><small>Điện thoại</small><strong>${content.shop.phoneDisplay}</strong><p>${content.shop.openingHours}</p></div>${icon("arrow")}</a><a href="mailto:${content.shop.email}"><span>${icon("user")}</span><div><small>Email</small><strong>${content.shop.email}</strong><p>Đơn hàng và bảo hành</p></div>${icon("arrow")}</a><a href="${content.shop.mapUrl}" target="_blank" rel="noopener"><span>${icon("map")}</span><div><small>Địa chỉ</small><strong>Kiến Hưng, Hà Đông</strong><p>${escapeHtml(content.shop.plusCode)}</p></div>${icon("arrow")}</a></div>
        <form class="contact-form" data-contact-form><h2>Soạn yêu cầu qua email</h2><p>Điền nội dung, website sẽ mở ứng dụng email trên thiết bị của bạn.</p><label class="field"><span>Họ tên</span><input name="name" required></label><label class="field"><span>Số điện thoại</span><input name="phone" inputmode="tel" required></label><label class="field"><span>Nội dung</span><textarea name="message" rows="6" required placeholder="Sản phẩm cần hỏi, màu, ngân sách..."></textarea></label><button class="btn btn--primary btn--block" type="submit">Mở email gửi shop</button></form></div></section>
      <section class="map-section"><iframe title="Bản đồ HANKeyboard" src="https://www.google.com/maps?q=XQ47%2BH3%20Ki%E1%BA%BFn%20H%C6%B0ng%2C%20H%C3%A0%20N%E1%BB%99i&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></section>`;
    document.querySelector("[data-contact-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const subject = encodeURIComponent(`Liên hệ website - ${data.get("name")}`);
      const body = encodeURIComponent(`Họ tên: ${data.get("name")}\nSố điện thoại: ${data.get("phone")}\n\n${data.get("message")}`);
      location.href = `mailto:${content.shop.email}?subject=${subject}&body=${body}`;
    });
  }

  async function init() {
    const bootstrap = await api.getBootstrap();
    window.HAN_STATE.products = bootstrap.products;
    window.HAN_STATE.settings = bootstrap.settings;
    window.HAN_STATE.apiReady = bootstrap.apiReady;
    window.HANLayout.init();
    bindProductActions();
    store.registerWebMcp();
    const page = document.body.dataset.page || "home";
    const renderers = {
      home: renderHome,
      products: renderProducts,
      product: renderProduct,
      favorites: renderFavorites,
      cart: renderCart,
      checkout: renderCheckout,
      thanks: renderThanks,
      tracking: renderTracking,
      guides: renderGuides,
      article: renderArticle,
      policy: renderPolicy,
      about: renderAbout,
      contact: renderContact,
    };
    (renderers[page] || renderHome)();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
