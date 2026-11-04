// ---------- Elements ----------
const textInput = document.getElementById("text-input");
const charCount = document.getElementById("char-count");
const sizeSelect = document.getElementById("size-select");
const levelSelect = document.getElementById("level-select");
const fgColor = document.getElementById("fg-color");
const bgColor = document.getElementById("bg-color");
const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const errorEl = document.getElementById("error");
const output = document.getElementById("output");
const qrBox = document.getElementById("qr-box");

const DOWNLOAD_PADDING = 16; // white margin around the QR code in the PNG

// ---------- Helpers ----------
function showError(message) {
  errorEl.textContent = message;
  output.classList.add("hidden");
  qrBox.innerHTML = "";
}

function clearError() {
  errorEl.textContent = "";
}

// ---------- Generate ----------
function generateQR() {
  clearError();

  const text = textInput.value.trim();
  if (!text) {
    showError("Please enter some text or a URL.");
    return;
  }

  if (fgColor.value.toLowerCase() === bgColor.value.toLowerCase()) {
    showError("QR color and background must be different.");
    return;
  }

  const size = Number(sizeSelect.value);
  qrBox.innerHTML = "";
  qrBox.style.background = bgColor.value;

  try {
    new QRCode(qrBox, {
      text: text,
      width: size,
      height: size,
      colorDark: fgColor.value,
      colorLight: bgColor.value,
      correctLevel: QRCode.CorrectLevel[levelSelect.value]
    });
    output.classList.remove("hidden");
  } catch (err) {
    showError("This text is too long for the chosen error correction. Shorten it or choose Low.");
  }
}

// ---------- Download ----------
function downloadQR() {
  const canvas = qrBox.querySelector("canvas");
  if (!canvas) return;

  // Draw the QR on a larger canvas to add a margin, so it scans reliably
  const out = document.createElement("canvas");
  out.width = canvas.width + DOWNLOAD_PADDING * 2;
  out.height = canvas.height + DOWNLOAD_PADDING * 2;

  const ctx = out.getContext("2d");
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, DOWNLOAD_PADDING, DOWNLOAD_PADDING);

  const link = document.createElement("a");
  link.href = out.toDataURL("image/png");
  link.download = "qrcode.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------- Events ----------
generateBtn.addEventListener("click", generateQR);
downloadBtn.addEventListener("click", downloadQR);

textInput.addEventListener("input", () => {
  charCount.textContent = textInput.value.length;
});

textInput.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "Enter") generateQR();
});