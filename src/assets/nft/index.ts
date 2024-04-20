import none from "./None.png";

// bgimage for both predator and pot
import bg_1 from "./bg/0-1.png";
import bg_2 from "./bg/0-2.png";
import bg_3 from "./bg/0-3.png";

//pot
import potLayer_1_1 from "./pot/1-1.png";
import potLayer_1_2 from "./pot/1-2.png";
import potLayer_2_1 from "./pot/2-1.png";
import potLayer_2_2 from "./pot/2-2.png";
import potLayer_3_1 from "./pot/3-1.png";
import potLayer_3_2 from "./pot/3-2.png";
import potLayer_4_1 from "./pot/4-1.png";
import potLayer_4_2 from "./pot/4-2.png";
import potLayer_5_1 from "./pot/5-1.png";
import potLayer_5_2 from "./pot/5-2.png";
import potLayer_6_1 from "./pot/6b-1.png";
import potLayer_6_2 from "./pot/6b-2.png";
import potLayer_6_3 from "./pot/6b-3.png";

//predator
import PredatorLayer_1_1 from "./predator/1-1.png";
import PredatorLayer_1_2 from "./predator/1-2.png";
import PredatorLayer_2_1 from "./predator/2-1.png";
import PredatorLayer_3_1 from "./predator/3-1.png";
import PredatorLayer_4_1 from "./predator/4-1.png";
import PredatorLayer_4_2 from "./predator/4-2.png";
import PredatorLayer_5_1 from "./predator/5-1.png";
import PredatorLayer_5_2 from "./predator/5-2.png";
import PredatorLayer_6_1 from "./predator/6a-1.png";
import PredatorLayer_6_2 from "./predator/6a-2.png";

const NFT_PARTS = {
  pot: {
    0: [none, bg_1, bg_2, bg_3],
    1: [potLayer_1_1, potLayer_1_2],
    2: [none, potLayer_2_1, potLayer_2_2],
    3: [none, potLayer_3_1, potLayer_3_2],
    4: [none, potLayer_4_1, potLayer_4_2],
    5: [none, potLayer_5_1, potLayer_5_2],
    6: [none, potLayer_6_1, potLayer_6_2, potLayer_6_3],
  },
  predator: {
    0: [none, bg_1, bg_2, bg_3],
    1: [PredatorLayer_1_1, PredatorLayer_1_2],
    2: [none, PredatorLayer_2_1],
    3: [none, PredatorLayer_3_1],
    4: [none, PredatorLayer_4_1, PredatorLayer_4_2],
    5: [none, PredatorLayer_5_1, PredatorLayer_5_2],
    6: [none, PredatorLayer_6_1, PredatorLayer_6_2],
  },
};

export default NFT_PARTS;
