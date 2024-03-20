import "./PageLock.css";

import honeyBar from "@/assets/honey-bar.svg";
import GeneralButton from "../GeneralButton/GeneralButton";

export default function PageLock() {
  const handleBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="page-lock">
      <div className="lock-icon">
        <img src={honeyBar} alt="" />
      </div>
      <div className="lock-text">
        <h1>
          Sorry you don't have access to this page. Check our twitter or discord
          for updates!
        </h1>
      </div>
      <GeneralButton onClick={() => handleBack()}>
        Back to homepage
      </GeneralButton>
    </div>
  );
}
