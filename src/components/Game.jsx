
import {
  Birds,
  Bricks,
  Clouds,
  Mario,
  Obstacles,
  Sun,
  KeyMessage,
  Score,
  MobileControls,
} from ".";
import { useSelector } from "react-redux";

export default function Game(prop) {
  const isPlay = useSelector((state) => state.engine.play);
  

  return (
    <div className={prop.className}>
      {!isPlay && <KeyMessage />}
      <Bricks />
      <Sun />
      <Clouds />
      <Birds />
      <Obstacles />
      <MobileControls />
      
      <Score />
      
      <Mario />
    </div>
  );
}
