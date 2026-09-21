(function () {
  "use strict";

  const config = window.HAN_CONFIG;
  const store = window.HANStore;

  function isConfigured() {
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:\?.*)?$/i.test(config.apiUrl || "");
  }

  function canUseLocalDemo() {
    const localHost = !location.hostname || ["localhost", "127.0.0.1", "terminal.local"].includes(location.hostname);
    return config.allowLocalDemoOrders || localHost || new URLSearchParams(location.search).get("demo") === "1";
  }

  async function fetchWithTimeout(url, options = {}, timeout = 12000) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal, redirect: "follow" });
      const text = await response.text();
      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        throw new Error("Máy chủ trả về dữ liệu không hợp lệ.");
      }
      if (!response.ok || payload?.ok === false) throw new Error(payload?.message || "Không thể kết nối máy chủ.");
      return payload;
    } finally {
      window.clearTimeout(timer);
    }
  }

  function endpoint(action, params = {}) {
    const url = new URL(config.apiUrl);
    url.searchParams.set("action", action);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
    });
    return url.toString();
  }

  function parseMoney(value) {
    if (typeof value === "number") return value;
    const digits = String(value || "").replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  }

  function splitPipe(value) {
    return String(value || "").split("|").map((item) => item.trim()).filter(Boolean);
  }

  function normalizeSheetProduct(row, index) {
    if (row.id && row.slug && Number.isFinite(Number(row.price))) return row;
    const name = String(row.ten_sp || row.name || "").trim();
    const id = String(row.ma_sp || row.id || `SP-${index + 1}`).trim();
    const price = parseMoney(row.gia_ban ?? row.price);
    const suppliedCompareAt = parseMoney(row.gia_goc ?? row.compareAtPrice);
    const description = String(row.mo_ta_chi_tiet || row.description || "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    const specs = String(row.thong_so || "")
      .split("|")
      .flatMap((part) => part.split(/\n+/))
      .map((part) => part.replace(/^\s*[-•]\s*/, "").trim())
      .filter(Boolean)
      .map((part) => {
        const position = part.indexOf(":");
        return position < 0
          ? { label: "Thông tin", value: part }
          : { label: part.slice(0, position).trim(), value: part.slice(position + 1).trim() };
      });
    const options = String(row.tuy_chon || "")
      .split("|")
      .map((group) => {
        const [optionName, ...rest] = group.split(":");
        return { name: optionName?.trim() || "Phiên bản", values: rest.join(":").split(",").map((item) => item.trim()).filter(Boolean) };
      })
      .filter((group) => group.values.length);
    const slug = `${name}-${id}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const combined = [name, row.mo_ta_ngan, row.thong_so, row.tags].join(" ").toLowerCase();
    const layout = combined.match(/(?:layout|size)\s*(60|65|68|75|80|87|96|100)\s*%?/i)?.[1] || "";
    const connections = [];
    if (/3\s*mode|3\s*chế độ|tri-mode/.test(combined)) connections.push("3 mode");
    if (/bluetooth/.test(combined)) connections.push("Bluetooth");
    if (/2\.4\s*g|wireless/.test(combined)) connections.push("2.4G");
    if (/type-c|usb-c|có dây/.test(combined)) connections.push("Dây");
    return {
      id,
      slug,
      name,
      category: /kit/i.test(row.danh_muc || row.category) ? "Kit bàn phím" : String(row.danh_muc || row.category || "Bàn phím cơ"),
      brand: /aula/i.test(name) ? "AULA" : /leobog/i.test(name) ? "Leobog" : String(row.thuong_hieu || row.brand || "Khác"),
      price,
      compareAtPrice: suppliedCompareAt > price ? suppliedCompareAt : 0,
      stock: Number.parseInt(row.ton_kho ?? row.stock, 10) || 0,
      visible: !/false|0|ẩn/i.test(String(row.hien_thi ?? row.visible ?? true)),
      images: Array.isArray(row.images) ? row.images : splitPipe(row.anh),
      shortDescription: String(row.mo_ta_ngan || row.shortDescription || "").trim(),
      description,
      specs,
      options,
      warranty: String(row.bao_hanh || row.warranty || "Bảo hành 30 ngày").trim(),
      featured: /true|1|có/i.test(String(row.noi_bat ?? row.featured ?? false)),
      video: String(row.video || "").trim(),
      tags: Array.isArray(row.tags) ? row.tags : String(row.tags || "").split(",").map((item) => item.trim()).filter(Boolean),
      createdAt: String(row.ngay_tao || row.createdAt || "2026-09-20"),
      views: Number.parseInt(row.luot_xem ?? row.views, 10) || 0,
      attributes: {
        layout: layout === "68" ? "65" : ["80", "87"].includes(layout) ? "TKL" : ["96", "100"].includes(layout) ? "Full" : layout,
        connections: [...new Set(connections)],
        hotSwap: /hot\s*-?swap|hotswap/.test(combined),
        switchType: /tactile/.test(combined) ? "Tactile" : /clicky/.test(combined) ? "Clicky" : /linear/.test(combined) ? "Linear" : "",
      },
    };
  }

  async function getBootstrap() {
    if (!isConfigured()) return { products: window.HAN_STATE.products, settings: window.HAN_STATE.settings, apiReady: false };
    try {
      const [productsPayload, settingsPayload] = await Promise.all([
        fetchWithTimeout(endpoint("products")),
        fetchWithTimeout(endpoint("settings")),
      ]);
      const productRows = productsPayload.data || productsPayload.products || productsPayload;
      const settings = settingsPayload.data || settingsPayload.settings || settingsPayload;
      const products = Array.isArray(productRows)
        ? productRows.map(normalizeSheetProduct).filter((product) => product.name && product.price > 0 && product.visible)
        : window.HAN_STATE.products;
      return { products, settings: { ...window.HAN_STATE.settings, ...settings }, apiReady: true };
    } catch (error) {
      console.warn("Không tải được dữ liệu trực tuyến, đang dùng dữ liệu dự phòng.", error);
      return { products: window.HAN_STATE.products, settings: window.HAN_STATE.settings, apiReady: false, error };
    }
  }

  function createDemoOrder(order) {
    const now = new Date();
    const datePart = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const stored = store.readStorage(store.storageKeys.orders, []);
    const todayCount = stored.filter((item) => String(item.code).startsWith(`HAN-${datePart}`)).length + 1;
    const code = `HAN-${datePart}-${String(todayCount).padStart(3, "0")}`;
    const record = { ...order, code, ma_don: code, status: "Chờ xác nhận", trang_thai: "Chờ xác nhận", createdAt: now.toISOString() };
    stored.unshift(record);
    store.writeStorage(store.storageKeys.orders, stored.slice(0, 30), 30);
    return {
      ok: true,
      demo: true,
      orderCode: code,
      ma_don: code,
      total: order.totals?.total || order.tong_cong || 0,
      qrUrl: vietQrUrl(order.paymentMethod === "cod" ? window.HAN_CONTENT.shop.shipping.codDeposit : order.totals?.total || 0, code),
    };
  }

  async function createOrder(order) {
    if (!isConfigured()) {
      if (canUseLocalDemo()) return createDemoOrder(order);
      throw new Error("Kênh nhận đơn trực tuyến đang được kết nối. Vui lòng gửi giỏ hàng qua Zalo hoặc gọi shop.");
    }
    const payload = await fetchWithTimeout(config.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ action: "createOrder", ...order }),
    }, 20000);
    return payload.data || payload;
  }

  async function trackOrder(code, phone) {
    if (!isConfigured()) {
      if (!canUseLocalDemo()) throw new Error("Tra cứu đơn đang được kết nối. Vui lòng liên hệ shop để được hỗ trợ.");
      const orders = store.readStorage(store.storageKeys.orders, []);
      const match = orders.find((order) => (order.code === code || order.ma_don === code) && store.normalizePhone(order.customer?.phone || order.sdt) === store.normalizePhone(phone));
      if (!match) throw new Error("Không tìm thấy đơn khớp với mã đơn và số điện thoại.");
      return match;
    }
    const payload = await fetchWithTimeout(endpoint("track", { ma_don: code, sdt: store.normalizePhone(phone), device_id: store.getDeviceId() }));
    return payload.data || payload.order || payload;
  }

  async function validateCoupon(code, subtotal) {
    if (!code) return { valid: false, discount: 0 };
    if (!isConfigured()) throw new Error("Mã giảm giá chỉ được kiểm tra khi hệ thống đơn hàng trực tuyến hoạt động.");
    const payload = await fetchWithTimeout(endpoint("coupon", { code, subtotal }));
    return payload.data || payload;
  }

  async function subscribe(email) {
    if (!isConfigured()) throw new Error("Đăng ký email đang được kết nối.");
    const payload = await fetchWithTimeout(config.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ action: "subscribe", email }),
    });
    return payload.data || payload;
  }

  function vietQrUrl(amount, orderCode) {
    const bank = window.HAN_CONTENT.shop.bank;
    const params = new URLSearchParams({
      amount: String(Math.max(0, Math.round(Number(amount) || 0))),
      addInfo: String(orderCode || "HANKEYBOARD"),
      accountName: bank.accountName,
    });
    return `https://img.vietqr.io/image/${bank.bin}-${bank.accountNumber}-compact2.png?${params.toString()}`;
  }

  window.HANApi = {
    isConfigured,
    canUseLocalDemo,
    getBootstrap,
    createOrder,
    trackOrder,
    validateCoupon,
    subscribe,
    vietQrUrl,
  };
})();
