(function () {
  "use strict";

  const config = window.HAN_CONFIG;
  const storagePrefix = "han_";
  const storageKeys = {
    cart: `${storagePrefix}cart_v2`,
    favorites: `${storagePrefix}favorites_v1`,
    recent: `${storagePrefix}recent_v1`,
    profile: `${storagePrefix}shipping_profile_v1`,
    orders: `${storagePrefix}demo_orders_v1`,
    addressCache: `${storagePrefix}address_cache_v2`,
    device: `${storagePrefix}device_id_v1`,
  };

  window.HAN_STATE = {
    products: Array.isArray(window.HAN_CATALOG) ? window.HAN_CATALOG.filter((item) => item.visible) : [],
    settings: window.HAN_CONTENT?.shop || {},
    apiReady: false,
  };

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (parsed?.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(key);
        return fallback;
      }
      return parsed?.value ?? parsed;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value, ttlDays = null) {
    try {
      const payload = ttlDays
        ? { value, expiresAt: Date.now() + ttlDays * 86400000 }
        : value;
      localStorage.setItem(key, JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }[character]));
  }

  function formatMoney(value) {
    return `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}₫`;
  }

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function formatDate(value, options = {}) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...options,
    }).format(date);
  }

  function icon(name, className = "") {
    const paths = {
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
      cart: '<path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 2-1.6L21 8H7"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
      heart: '<path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/>',
      package: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.3 7.7 7.7 4.4 7.7-4.4M12 21v-8.9"/>',
      phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>',
      chat: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-5A7 7 0 0 1 3 13V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
      home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
      grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      chevron: '<path d="m9 18 6-6-6-6"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
      truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
      refresh: '<path d="M20 7h-6V1"/><path d="M20 7a9 9 0 1 0 2 6"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      minus: '<path d="M5 12h14"/>',
      trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
      copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
      filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
      star: '<path d="m12 2 3 6 7 .9-5 4.8 1.2 6.8L12 17.3l-6.2 3.2L7 13.7 2 8.9 9 8l3-6Z"/>',
    };
    return `<svg class="${escapeHtml(className)}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.info}</svg>`;
  }

  function getProduct(productId) {
    return window.HAN_STATE.products.find((product) => product.id === productId || product.slug === productId);
  }

  function productUrl(product) {
    return `chi-tiet.html?sp=${encodeURIComponent(product.slug)}`;
  }

  function productImage(product, className = "") {
    const source = product?.images?.[0];
    if (source) {
      return `<img class="${escapeHtml(className)}" src="${escapeHtml(source)}" alt="${escapeHtml(product.name)}" loading="lazy" width="720" height="720">`;
    }
    return `<span class="product-placeholder"><img src="assets/images/brand/hankeyboard-logomark-color.svg" alt="" width="180" height="180"></span>`;
  }

  function getCart() {
    const value = readStorage(storageKeys.cart, { items: [] });
    if (!value || !Array.isArray(value.items)) return { items: [] };
    return value;
  }

  function saveCart(cart) {
    const cleaned = {
      items: cart.items.filter((item) => item.quantity > 0),
      updatedAt: new Date().toISOString(),
    };
    writeStorage(storageKeys.cart, cleaned, config.cartTtlDays);
    window.dispatchEvent(new CustomEvent("han:cart-updated", { detail: cleaned }));
    return cleaned;
  }

  function cartLineKey(productId, options = {}) {
    const normalized = Object.entries(options).sort(([a], [b]) => a.localeCompare(b));
    return `${productId}:${JSON.stringify(normalized)}`;
  }

  function addToCart(productId, quantity = 1, options = {}) {
    const product = getProduct(productId);
    if (!product || product.stock <= 0) throw new Error("Sản phẩm đang tạm hết hàng.");
    const safeQuantity = Math.max(1, Math.min(Number(quantity) || 1, product.stock));
    const cart = getCart();
    const key = cartLineKey(product.id, options);
    const existing = cart.items.find((item) => item.key === key);
    if (existing) existing.quantity = Math.min(existing.quantity + safeQuantity, product.stock);
    else cart.items.push({ key, productId: product.id, quantity: safeQuantity, options });
    saveCart(cart);
    return cart;
  }

  function updateCartItem(key, quantity) {
    const cart = getCart();
    const item = cart.items.find((line) => line.key === key);
    if (!item) return cart;
    const product = getProduct(item.productId);
    item.quantity = Math.max(0, Math.min(Number(quantity) || 0, product?.stock || 0));
    return saveCart(cart);
  }

  function removeCartItem(key) {
    const cart = getCart();
    cart.items = cart.items.filter((item) => item.key !== key);
    return saveCart(cart);
  }

  function cartDetails() {
    const cart = getCart();
    const items = cart.items.map((item) => ({ ...item, product: getProduct(item.productId) })).filter((item) => item.product);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, subtotal, quantity };
  }

  function shippingFee(subtotal, quantity, method = "delivery", province = "") {
    const rules = window.HAN_CONTENT.shop.shipping;
    if (method === "pickup" || subtotal >= rules.freeThreshold) return 0;
    const isHanoi = /hà nội|ha noi/i.test(province);
    const base = isHanoi ? Math.max(rules.standardBase, 18000) : rules.standardBase;
    return base + Math.max(0, quantity - 1) * rules.additionalItem;
  }

  function getFavorites() {
    const value = readStorage(storageKeys.favorites, []);
    return Array.isArray(value) ? value : [];
  }

  function toggleFavorite(productId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(productId);
    if (index >= 0) favorites.splice(index, 1);
    else favorites.unshift(productId);
    writeStorage(storageKeys.favorites, favorites);
    window.dispatchEvent(new CustomEvent("han:favorites-updated", { detail: favorites }));
    return favorites.includes(productId);
  }

  function addRecent(productId) {
    const recent = readStorage(storageKeys.recent, []).filter((id) => id !== productId);
    recent.unshift(productId);
    writeStorage(storageKeys.recent, recent.slice(0, 10), 30);
  }

  function getRecentProducts(excludeId = "") {
    return readStorage(storageKeys.recent, []).filter((id) => id !== excludeId).map(getProduct).filter(Boolean);
  }

  function getProfile() {
    return readStorage(storageKeys.profile, {});
  }

  function saveProfile(profile) {
    writeStorage(storageKeys.profile, profile, 365);
  }

  function clearProfile() {
    localStorage.removeItem(storageKeys.profile);
  }

  function getDeviceId() {
    let deviceId = readStorage(storageKeys.device, "");
    if (deviceId) return deviceId;
    if (window.crypto?.randomUUID) deviceId = window.crypto.randomUUID();
    else {
      const random = window.crypto?.getRandomValues
        ? Array.from(window.crypto.getRandomValues(new Uint32Array(4))).map((value) => value.toString(16)).join("")
        : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
      deviceId = `han-${random}`;
    }
    writeStorage(storageKeys.device, deviceId, 730);
    return deviceId;
  }

  function toast(message, type = "default") {
    const region = document.getElementById("toast-region");
    if (!region) return;
    const element = document.createElement("div");
    element.className = `toast${type === "default" ? "" : ` toast--${type}`}`;
    element.textContent = message;
    region.appendChild(element);
    window.setTimeout(() => element.remove(), 3200);
  }

  function productCard(product) {
    const salePercent = product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;
    const favorite = getFavorites().includes(product.id);
    const optionText = product.options?.map((option) => option.values.join(", ")).join(" · ") || product.shortDescription;
    return `<article class="product-card${product.stock <= 0 ? " is-sold-out" : ""}" data-product-id="${escapeHtml(product.id)}">
      <a class="product-card__media" href="${productUrl(product)}" aria-label="Xem ${escapeHtml(product.name)}">
        ${productImage(product)}
        <span class="product-badges">
          ${salePercent ? `<span class="badge badge--sale">-${salePercent}%</span>` : ""}
          ${product.stock <= 0 ? '<span class="badge badge--stock">Tạm hết hàng</span>' : product.stock <= 2 ? '<span class="badge badge--stock">Sắp hết</span>' : ""}
        </span>
      </a>
      <button class="favorite-button${favorite ? " is-active" : ""}" type="button" data-action="favorite" data-product-id="${escapeHtml(product.id)}" aria-label="${favorite ? "Bỏ khỏi" : "Thêm vào"} sản phẩm yêu thích" aria-pressed="${favorite}">${icon("heart")}</button>
      <div class="product-card__body">
        <p class="product-card__brand">${escapeHtml(product.brand)}</p>
        <h3 class="product-card__name"><a href="${productUrl(product)}">${escapeHtml(product.name)}</a></h3>
        <p class="product-card__option" title="${escapeHtml(optionText)}">${escapeHtml(optionText)}</p>
        <div class="price-row"><span class="price">${formatMoney(product.price)}</span>${product.compareAtPrice > product.price ? `<span class="price-old">${formatMoney(product.compareAtPrice)}</span>` : ""}</div>
        <div class="product-card__actions">
          <button class="btn btn--primary btn--small quick-add" type="button" data-action="quick-add" data-product-id="${escapeHtml(product.id)}" ${product.stock <= 0 ? "disabled" : ""}>${icon("cart")}<span>${product.stock <= 0 ? "Hết hàng" : "Thêm giỏ"}</span></button>
          <a class="btn btn--outline btn--small" href="${productUrl(product)}" aria-label="Xem chi tiết ${escapeHtml(product.name)}">${icon("chevron")}</a>
        </div>
      </div>
    </article>`;
  }

  function registerWebMcp() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tools = [
      {
        name: "search_products",
        title: "Tìm sản phẩm",
        description: "Tìm sản phẩm HANKeyboard theo tên, thương hiệu hoặc từ khóa và trả về kết quả đang hiển thị trên website.",
        inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute(input) {
          const query = String(input?.query || "").trim().toLowerCase();
          if (!query) throw new Error("Cần nhập từ khóa tìm kiếm.");
          return window.HAN_STATE.products
            .filter((product) => [product.name, product.brand, product.tags.join(" ")].join(" ").toLowerCase().includes(query))
            .slice(0, 10)
            .map((product) => ({ id: product.id, name: product.name, price: product.price, stock: product.stock, url: productUrl(product) }));
        },
      },
      {
        name: "add_product_to_cart",
        title: "Thêm vào giỏ hàng",
        description: "Thêm một sản phẩm đang bán vào giỏ hàng hiện tại và cập nhật số lượng hiển thị.",
        inputSchema: { type: "object", properties: { productId: { type: "string" }, quantity: { type: "integer", minimum: 1, maximum: 20 } }, required: ["productId"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const product = getProduct(String(input?.productId || ""));
          if (!product) throw new Error("Không tìm thấy sản phẩm.");
          addToCart(product.id, Number(input.quantity) || 1, {});
          const detail = cartDetails();
          return { added: product.id, cartQuantity: detail.quantity, subtotal: detail.subtotal };
        },
      },
      {
        name: "read_cart",
        title: "Xem giỏ hàng",
        description: "Đọc các sản phẩm, số lượng và tạm tính của giỏ hàng hiện tại.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute() {
          const detail = cartDetails();
          return { quantity: detail.quantity, subtotal: detail.subtotal, items: detail.items.map((item) => ({ productId: item.product.id, name: item.product.name, quantity: item.quantity, unitPrice: item.product.price, options: item.options })) };
        },
      },
    ];

    tools.forEach((tool) => {
      try {
        Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
      } catch {
        // Trình duyệt có thể đang thử nghiệm WebMCP; lỗi đăng ký không ảnh hưởng cửa hàng.
      }
    });
  }

  window.HANStore = {
    storageKeys,
    readStorage,
    writeStorage,
    escapeHtml,
    formatMoney,
    formatDate,
    normalizePhone,
    icon,
    getProduct,
    productUrl,
    productImage,
    productCard,
    getCart,
    saveCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    cartDetails,
    shippingFee,
    getFavorites,
    toggleFavorite,
    addRecent,
    getRecentProducts,
    getProfile,
    saveProfile,
    clearProfile,
    getDeviceId,
    toast,
    registerWebMcp,
  };
})();
