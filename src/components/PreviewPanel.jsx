import { useMemo } from "react";

export default function PreviewPanel({ code }) {
  const srcdoc = useMemo(() => {
    if (!code.html && !code.css && !code.js) return "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${code.css || ""}</style>
</head>
<body>
  ${code.html
        ? code.html
          .replace(/<!DOCTYPE html>/i, "")
          .replace(/<html[^>]*>/i, "")
          .replace(/<\/html>/i, "")
          .replace(/<head>[\s\S]*?<\/head>/i, "")
          .replace(/<body[^>]*>/i, "")
          .replace(/<\/body>/i, "")
        : ""}
  <script>${code.js || ""}<\/script>
</body>
</html>`;
  }, [code]);

  return (
    <div className="preview-panel">
      {srcdoc ? (
        <iframe
          title="Website Preview"
          srcDoc={srcdoc}
          sandbox="allow-scripts allow-modals"
          className="preview-iframe"
        />
      ) : (
        <div className="preview-empty">
          <span>👁️</span>
          <p>Live preview will appear here</p>
        </div>
      )}
    </div>
  );
}
