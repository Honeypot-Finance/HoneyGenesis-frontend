import lockIcon from "@/assets/lock-svgrepo-com.svg";
import "./PageLock.css";

export default function PageLock() {
  return (
    <div className="page-lock">
      <div className="lock-icon">
        <img src={lockIcon} alt="" />
      </div>
      <div className="lock-text">
        <h1>Page Locked</h1>
        <p>check our social media for unlocking time!</p>
      </div>
    </div>
  );
}
