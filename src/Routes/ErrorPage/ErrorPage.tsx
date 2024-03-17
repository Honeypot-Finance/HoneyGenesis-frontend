import "./ErrorPage.css";
import Header from "@/components/Header";
import icon404 from "@/assets/404.svg";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";

export default function ErrorPage() {
  return (
    <div className="App error">
      <Header />
      <main className="main-404">
        <img className="img-404" src={icon404} alt="" />
        <h1 className="text-404">
          Oops looks like there was an error with the link you clicked.{" "}
        </h1>
        <GeneralButton>Back To homepage</GeneralButton>
      </main>
    </div>
  );
}
