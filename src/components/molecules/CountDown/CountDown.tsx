import Container from "@/components/atoms/Container/Container";
import { ReactNode } from "react";
import Countdown from "react-countdown";

export default function CountDown({
  date,
  completeRenderer,
}: {
  date: string | Date;
  completeRenderer: ReactNode;
}) {
  const countDownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return completeRenderer;
    } else {
      return (
        <Container>
          <div className="count-down">
            <Container>
              <span className="count-down-part">{days}d</span>{" "}
            </Container>
            <Container>
              <span className="count-down-part">{hours}h</span>{" "}
            </Container>
            <Container>
              <span className="count-down-part">{minutes}m</span>{" "}
            </Container>
            <Container>
              <span className="count-down-part">{seconds}s</span>{" "}
            </Container>
          </div>
        </Container>
      );
    }
  };

  return <Countdown date={date} renderer={countDownRenderer} />;
}
