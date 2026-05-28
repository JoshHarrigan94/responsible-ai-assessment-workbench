function nowIso() {
  return new Date().toISOString();
}

function uid(prefix = "id") {
  if (window.crypto && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatDate(value) {
  if (!value) return "Not available";

  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return "Invalid date";
  }
}

function riskPillClass(riskLevel) {
  const value = String(riskLevel || "").toLowerCase();

  if (value.includes("low")) return "green";
  if (value.includes("medium") || value.includes("amber")) return "amber";
  if (value.includes("high") || value.includes("red")) return "red";

  return "";
}

function truncateText(text, maxLength = 520) {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}...`;
}

function metricCard(label, value, helper) {
  return `
    <div class="card metric-card">
      <div>
        <div class="metric-label">${label}</div>
        <div class="metric-value">${value}</div>
      </div>
      <div class="metric-helper">${helper}</div>
    </div>
  `;
}

function infoRow(label, value) {
  return `
    <div class="list-item">
      <div class="item-title">${escapeHtml(label)}</div>
      <div class="item-meta">${escapeHtml(String(value ?? ""))}</div>
    </div>
  `;
}

function emptyState(title, message) {
  return `
    <div class="empty">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(message)}</span>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
