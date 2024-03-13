import Header from "@/components/Header";
import PageLock from "@/components/atoms/PageLock/PageLock";

interface MainContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  lock?: boolean;
}

function MainContentWrapper({ lock, children }: MainContentWrapperProps) {
  return (
    <>
      <Header />
      {(lock && <PageLock />) || children}
    </>
  );
}

export default MainContentWrapper;
