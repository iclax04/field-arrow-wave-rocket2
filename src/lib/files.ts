export async function fileToCover(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Use a JPEG, PNG, or WebP cover.");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that image."));
      el.src = url;
    });
    const max = 1280;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare that image.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let quality = 0.82;
    let data = canvas.toDataURL("image/jpeg", quality);
    while (data.length > 1_450_000 && quality > 0.5) {
      quality -= 0.08;
      data = canvas.toDataURL("image/jpeg", quality);
    }
    if (data.length > 1_650_000) throw new Error("That image is still too large.");
    return data;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function fileToMedia(file: File, kind: "video" | "audio"): Promise<string> {
  const ok = kind === "video" ? /^video\/(mp4|webm)$/ : /^audio\/(mpeg|mp3|wav|ogg|webm)$/;
  if (!ok.test(file.type)) throw new Error("Use mp4 or webm video, or mp3, wav, or ogg audio.");
  if (file.size > 900_000) throw new Error("Keep audio and video under 900 KB.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}
