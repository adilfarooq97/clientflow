export default function SocialImage() {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#f8fafc",
        color: "#0f172a",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "64px",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "28px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "64px 72px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#1d4ed8",
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          Souqivo
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.08,
            marginTop: 30,
            maxWidth: 900,
          }}
        >
          One workspace from kickoff to approval.
        </div>
        <div
          style={{
            color: "#64748b",
            display: "flex",
            fontSize: 27,
            lineHeight: 1.4,
            marginTop: 24,
          }}
        >
          Client collaboration for freelancers, agencies, and clients.
        </div>
        <div
          style={{
            backgroundColor: "#1d4ed8",
            borderRadius: 4,
            display: "flex",
            height: 6,
            marginTop: 38,
            width: 112,
          }}
        />
      </div>
    </div>
  );
}
