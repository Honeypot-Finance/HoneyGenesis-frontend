/* eslint-disable @typescript-eslint/no-unused-vars */

//-------------common-------------
import none from "./None.png";

// layer 0 bgimage for both predator and pot
import bgGreen_0 from "./单色背景/0-绿色.png";
import bgBlue_0 from "./单色背景/0-蓝色.png";
import bgYellow_0 from "./单色背景/0-黄色.png";
import logoBlue_0 from "./单色背景/0-logo蓝色.png";
import logoYellow from "./单色背景/0-logo黄色.png";

//-------------predator-------------
//layer 0 bgimage for predator
import predator_farm_0 from "./掠夺阵营/0-农场围栏外.png";
import predator_jail_0 from "./掠夺阵营/0-监狱.png";
//layer 1 bear type
import predator_polarBear_1 from "./掠夺阵营/1-北极熊.png";
import predator_brownBear_1 from "./掠夺阵营/1-棕熊.png";
import predator_pandaBear_1 from "./掠夺阵营/1-熊猫.png";
import predator_blackBear_1 from "./掠夺阵营/1-黑熊.png";
//layer 2 nail
import predator_bottomNail_2 from "./掠夺阵营/2-下层爪子.png";
//layer 3 emotion
import predator_anger_3 from "./掠夺阵营/3-愤怒.png";
import predator_normal_3 from "./掠夺阵营/3-默认.png";
//layer 4 clothes
import predator_purple_4 from "./掠夺阵营/4-紫衣服破.png";
import predator_green_4 from "./掠夺阵营/4-绿衣服破.png";
//layer 5 hat
import predator_honeyCell_5 from "./掠夺阵营/5-蜂窝帽.png";
import predator_ironPot_5 from "./掠夺阵营/5-铁锅帽.png";
//layer 6 glasses
import predator_triangle_6 from "./掠夺阵营/6-三角眼镜.png";
import predator_white_6 from "./掠夺阵营/6-白框眼镜.png";
//layer 7 smoke
import predator_cigarette_7 from "./掠夺阵营/7-卷烟.png";
import predator_pipe_7 from "./掠夺阵营/7-烟斗.png";
import predator_cigar_7 from "./掠夺阵营/7-雪茄.png";
//layer 8 weapon
import predator_pan_8 from "./掠夺阵营/8b-平底锅.png";
import predator_chainSaw_8 from "./掠夺阵营/8b-电锯.png";
import predator_ironShove_8 from "./掠夺阵营/8b-铁铲.png";
import predator_sickle_8 from "./掠夺阵营/8b-镰刀.png";
//layer 9 nail
import predator_topNail_9 from "./掠夺阵营/9-上层爪子.png";

//-------------pot-------------
//layer 0 bgimage for pot
import pot_farm_0 from "./蜜罐阵营/0-农场.png";
import pot_house_0 from "./蜜罐阵营/0-家庭.png";
import pot_aigen_0 from "./蜜罐阵营/0-AIgen.png";
//layer 1 bear type
import pot_polarBear_1 from "./蜜罐阵营/1-北极熊.png";
import pot_brownBear_1 from "./蜜罐阵营/1-棕熊.png";
import pot_pandaBear_1 from "./蜜罐阵营/1-熊猫.png";
//layer 2 nail
import pot_bottomNail_2 from "./蜜罐阵营/2-下层爪子.png";
//layer 3 emotion
import pot_anger_3 from "./蜜罐阵营/3-生气.png";
import pot_normal_3 from "./蜜罐阵营/3-默认.png";
import pot_nervous_3 from "./蜜罐阵营/3-紧张.png";
//layer 4 clothes
import pot_purple_4 from "./蜜罐阵营/4-紫衣服.png";
import pot_green_4 from "./蜜罐阵营/4-绿衣服.png";
//layer 5 hat
import pot_red_5 from "./蜜罐阵营/5-红帽子.png";
import pot_honeyCellHat_5 from "./蜜罐阵营/5-蜂窝帽.png";
import pot_ironPot_5 from "./蜜罐阵营/5-铁锅帽.png";
//layer 6 glasses
import pot_triangle_6 from "./蜜罐阵营/6-三角眼镜.png";
import pot_iron_6 from "./蜜罐阵营/6-金属框墨镜.png";
//layer 7 smoke
import pot_cigarette_7 from "./蜜罐阵营/7-卷烟.png";
import pot_pipe_7 from "./蜜罐阵营/7-烟斗.png";
import pot_cigar_7 from "./蜜罐阵营/7-雪茄.png";
//layer 8 weapon
import pot_ikeaBag_8 from "./蜜罐阵营/8a-IKEA购物袋.png";
import pot_honeyCell_8 from "./蜜罐阵营/8a-蜂窝.png";
import pot_ironPot_8 from "./蜜罐阵营/8a-铁锅.png";
import pot_clayPot_8 from "./蜜罐阵营/8a-陶罐.png";
import pot_bronzeHotPot_8 from "./蜜罐阵营/8a-铜火锅.png";
import pot_highPressurePot_8 from "./蜜罐阵营/8a-高压锅.png";
//layer 9 nail
import pot_topNail_9 from "./蜜罐阵营/9-上层爪子.png";

const NFT_PARTS = {
  pot: {
    0: [
      { name: "green", img: bgGreen_0 },
      { name: "blue", img: bgBlue_0 },
      { name: "yellow", img: bgYellow_0 },
      { name: "farm", img: pot_farm_0 },
      { name: "house", img: pot_house_0 },
      { name: "aigen", img: pot_aigen_0 },
      { name: "logoBlue", img: logoBlue_0 },
      { name: "logoYellow", img: logoYellow },
    ],
    1: [
      { name: "polarBear", img: pot_polarBear_1 },
      { name: "brownBear", img: pot_brownBear_1 },
      { name: "pandaBear", img: pot_pandaBear_1 },
    ],
    2: [{ name: "none", img: none }],
    3: [
      { name: "anger", img: pot_anger_3 },
      { name: "normal", img: pot_normal_3 },
      { name: "nervous", img: pot_nervous_3 },
    ],
    4: [
      { name: "none", img: none },
      { name: "purple", img: pot_purple_4 },
      { name: "green", img: pot_green_4 },
    ],
    5: [
      { name: "none", img: none },
      { name: "red", img: pot_red_5 },
      { name: "ironPot", img: pot_ironPot_5 },
      { name: "honeyCellHat", img: pot_honeyCellHat_5 },
    ],
    6: [
      { name: "none", img: none },
      { name: "triangle", img: pot_triangle_6 },
      { name: "iron", img: pot_iron_6 },
    ],
    7: [
      { name: "none", img: none },
      { name: "cigarette", img: pot_cigarette_7 },
      { name: "pipe", img: pot_pipe_7 },
      { name: "cigar", img: pot_cigar_7 },
    ],
    8: [
      { name: "honeyCell", img: pot_honeyCell_8 },
      { name: "ironPot", img: pot_ironPot_8 },
      { name: "clayPot", img: pot_clayPot_8 },
      { name: "ikeaBag", img: pot_ikeaBag_8 },
      { name: "bronzeHotPot", img: pot_bronzeHotPot_8 },
      { name: "highPressurePot", img: pot_highPressurePot_8 },
    ],
    9: [{ name: "none", img: none }],
  },
  predator: {
    0: [
      { name: "green", img: bgGreen_0 },
      { name: "blue", img: bgBlue_0 },
      { name: "yellow", img: bgYellow_0 },
      { name: "farm", img: predator_farm_0 },
      { name: "jail", img: predator_jail_0 },
      { name: "logoBlue", img: logoBlue_0 },
      { name: "logoYellow", img: logoYellow },
    ],
    1: [
      { name: "polarBear", img: predator_polarBear_1 },
      { name: "brownBear", img: predator_brownBear_1 },
      { name: "pandaBear", img: predator_pandaBear_1 },
      { name: "blackBear", img: predator_blackBear_1 },
    ],
    2: [
      { name: "none", img: none },
      { name: "nail", img: predator_bottomNail_2 },
    ],
    3: [
      { name: "anger", img: predator_anger_3 },
      { name: "normal", img: predator_normal_3 },
    ],
    4: [
      { name: "none", img: none },
      { name: "purple", img: predator_purple_4 },
      { name: "green", img: predator_green_4 },
    ],
    5: [
      { name: "none", img: none },
      { name: "honeyCell", img: predator_honeyCell_5 },
      { name: "ironPot", img: predator_ironPot_5 },
    ],
    6: [
      { name: "none", img: none },
      { name: "triangle", img: predator_triangle_6 },
      { name: "white", img: predator_white_6 },
    ],
    7: [
      { name: "none", img: none },
      { name: "cigarette", img: predator_cigarette_7 },
      { name: "pipe", img: predator_pipe_7 },
      { name: "cigar", img: predator_cigar_7 },
    ],
    8: [
      { name: "none", img: none },
      { name: "pan", img: predator_pan_8 },
      { name: "chainSaw", img: predator_chainSaw_8 },
      { name: "ironShove", img: predator_ironShove_8 },
      { name: "sickle", img: predator_sickle_8 },
    ],
    9: [
      { name: "none", img: none },
      { name: "nail", img: predator_topNail_9 },
    ],
  },
};

export default NFT_PARTS;
