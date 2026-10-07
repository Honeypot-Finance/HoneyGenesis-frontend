import "./PopUp.css";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppSelector";
import { closePopUp } from "@/config/redux/popUpSlice";

//icons
import xIcon from "@/assets/x-icon.svg";
import successIcon from "@/assets/pop-up-success-icon.svg";
import peidingIcon from "@/assets/pop-up-pending-icon.svg";
import warningIcon from "@/assets/pop-up-warning-icon.svg";

interface PopUpProps extends React.HTMLProps<HTMLDivElement> {}

export default function PopUp({ ...props }: PopUpProps) {
  const popUp = useAppSelector((state) => state.popUp);

  const dispatch = useAppDispatch();

  const handelClosePopUp = () => {
    dispatch(closePopUp());
    console.log(popUp);
  };

  const popUpIcon = () => {
    switch (popUp.info) {
      case "success":
        return successIcon;
      case "error":
        return warningIcon;
      case "warning":
        return warningIcon;
      case "pending":
        return peidingIcon;
      default:
        return "";
    }
  };

  return (
    <>
      {popUp.isOpen && (
        <div className={"pop-up " + popUp.info} {...props}>
          <div className="pop-up-container ">
            <img className="pop-up-type-img" src={popUpIcon()} alt="" />

            <div className="pop-up-content">
              <h2 className="pop-up-title">{popUp.title}</h2>
              <pre className="pop-up-text">{popUp.message}</pre>

              {popUp.link && (
                <a
                  href={popUp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#ffcd4d',
                    color: '#1a1410',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f7941d';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffcd4d';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {popUp.linkText || 'View Transaction'} ↗
                </a>
              )}
            </div>

            <div>
              <img
                className="pop-up-close-button"
                src={xIcon}
                onClick={() => handelClosePopUp()}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
