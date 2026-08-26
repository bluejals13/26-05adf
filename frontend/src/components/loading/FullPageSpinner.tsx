// components/loading/FullPageSpinner.tsx	큰 대기창

import "./Loading.Module.css";

export default function FullPageSpinner() {
  return (
    <div className="fullscreen-loader">
      <div className="spinner" />
    </div>
  );
}
