import "./PopUp.css";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppSelector";
import { closePopUp } from "@/config/redux/popUpSlice";

interface PopUpProps extends React.HTMLProps<HTMLDivElement> {}

export default function PopUp({ ...props }: PopUpProps) {
  const popUp = useAppSelector((state) => state.popUp);

  const dispatch = useAppDispatch();

  const handelClosePopUp = () => {
    dispatch(closePopUp());
    console.log(popUp);
  };

  return (
    <>
      {popUp.isOpen && (
        <div className={"pop-up " + popUp.info} {...props}>
          <div className="pop-up-container ">
            <div className="pop-up-header ">
              <h2 className="pop-up-title">{popUp.title}</h2>
              <button
                className="pop-up-close-button"
                onClick={() => handelClosePopUp()}
              >
                X
              </button>
            </div>
            <div className="pop-up-content">
              <p className="pop-up-text">{popUp.message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
