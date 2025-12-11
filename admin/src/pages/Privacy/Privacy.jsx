import React from "react";
import privacyPdf from "../../assets/docs/privacy.pdf";

const Privacy = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src={privacyPdf}
        title="Политика конфиденциальности"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
};

export default Privacy;