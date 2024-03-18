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
