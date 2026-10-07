import {
  makeAutoObservable,
  //reaction
} from "mobx";
import NFT_PARTS, { layerOption } from "@/assets/nft_sm";

export type LAYER_TYPE = {
  name: string;
  value: layerOption;
  constraints: string[];
};

export type BEAR_TYPE = "pot" | "predator";

export const bearOptions: BEAR_TYPE[] = ["pot", "predator"];

export class NFT {
  bearType: BEAR_TYPE = "pot";
  layers: Record<number, LAYER_TYPE> = {
    0: {
      name: "Background",
      value: {
        name: NFT_PARTS[this.bearType][0][0].name,
        img: NFT_PARTS[this.bearType][0][0].img,
      },
      constraints: [],
    },
    1: {
      name: "Bear",
      value: {
        name: NFT_PARTS[this.bearType][1][0].name,
        img: NFT_PARTS[this.bearType][1][0].img,
      },
      constraints: [],
    },
    2: {
      name: "Nail",
      value: {
        name: NFT_PARTS[this.bearType][2][0].name,
        img: NFT_PARTS[this.bearType][2][0].img,
      },
      constraints: [],
    },
    3: {
      name: "Emotion",
      value: {
        name: NFT_PARTS[this.bearType][3][0].name,
        img: NFT_PARTS[this.bearType][3][0].img,
      },
      constraints: [],
    },
    4: {
      name: "Cloth",
      value: {
        name: NFT_PARTS[this.bearType][4][0].name,
        img: NFT_PARTS[this.bearType][4][0].img,
      },
      constraints: [],
    },
    5: {
      name: "Hat",
      value: {
        name: NFT_PARTS[this.bearType][5][0].name,
        img: NFT_PARTS[this.bearType][5][0].img,
      },
      constraints: [],
    },
    6: {
      name: "Glasses",
      value: {
        name: NFT_PARTS[this.bearType][6][0].name,
        img: NFT_PARTS[this.bearType][6][0].img,
      },
      constraints: [],
    },
    7: {
      name: "Smoke",
      value: {
        name: NFT_PARTS[this.bearType][7][0].name,
        img: NFT_PARTS[this.bearType][7][0].img,
      },
      constraints: [],
    },
    8: {
      name: "Handhold",
      value: {
        name: NFT_PARTS[this.bearType][8][0].name,
        img: NFT_PARTS[this.bearType][8][0].img,
      },
      constraints: [],
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  setBearType = (type: BEAR_TYPE) => {
    this.bearType = type;
    Object.keys(this.layers).forEach((key) => {
      this.setLayer(
        parseInt(key),
        NFT_PARTS[this.bearType][parseInt(key)][0].name
      );
    });
  };

  setLayer = (layer: number, name: string) => {
    //this.removeConstraint(Object.entries(this.layers[layer].constraints));
    this.layers[layer].value = this.getLayerOptionByName(layer, name);
    //this.addConstraint(Object.entries(this.layers[layer].constraints));
    this.updateConstraints();
  };

  updateConstraints = () => {
    const newConstraints: {
      [key: number]: {
        [key: string]: number;
      };
    } = {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
    };

    Object.values(this.layers).forEach((layer) => {
      layer.value?.layerConstrain &&
        Object.entries(layer.value.layerConstrain).forEach(
          ([key, constraint]) => {
            constraint.forEach((c) => {
              if (!newConstraints[parseInt(key)][c]) {
                newConstraints[parseInt(key)][c] = 1;
              } else {
                newConstraints[parseInt(key)][c] += 1;
              }
            });
          }
        );
    });

    Object.entries(newConstraints).forEach(([key, value]) => {
      const maxVal = Math.max(...Object.values(value));

      Object.entries(value).forEach(([constraint, count]) => {
        if (count < maxVal) {
          delete newConstraints[parseInt(key)][constraint];
        }
      });
    });

    Object.entries(newConstraints).forEach(([key, value]) => {
      this.layers[parseInt(key)].constraints = Object.keys(value).filter(
        (constraint) => value[constraint] !== undefined
      );

      //console.log(3, Object(this.layers[parseInt(key)].constraints));

      //   if (
      //     Object.keys(value).length > 0 &&
      //     !Object.keys(value).includes(this.layers[parseInt(key)].value.name)
      //   ) {
      //     // console.log(3, this.layers[parseInt(key)].constraints[0]);
      //     this.setLayer(parseInt(key), this.layers[parseInt(key)].constraints[0]);
      //   }
    });
  };

  //   removeConstraint = (constraint: { [key: number]: string[] }) => {
  //     if (!constraint || Object.entries(constraint).length === 0) return;

  //     Object.entries(constraint).forEach(([key, value]) => {
  //       while (this.layers[parseInt(key)].constraints.includes(value[0])) {
  //         this.layers[parseInt(key)].constraints.splice(
  //           this.layers[parseInt(key)].constraints.indexOf(value[0]),
  //           1
  //         );
  //       }
  //     });
  //   };

  //   addConstraint = (constraint: { [key: number]: string[] }) => {
  //     if (!constraint || Object.entries(constraint).length === 0) return;
  //     console.log(constraint);

  //     Object.entries(constraint).forEach(([key, layer]) => {
  //       this.layers[parseInt(key)].constraints.push(...layer);

  //       if (
  //         this.layers[parseInt(key)].constraints.includes(
  //           this.layers[parseInt(key)].value.name
  //         )
  //       ) {
  //         this.setLayer(parseInt(key), constraint[parseInt(key)][0]);
  //       }
  //     });
  //   };

  getLayerOptionByName = (layer: number, name: string) => {
    return NFT_PARTS[this.bearType][layer].find(
      (option) => option.name === name
    );
  };

  randomNFT = () => {
    this.setBearType(Math.random() < 0.5 ? "pot" : "predator");

    Object.keys(this.layers).forEach((layer) => {
      if (this.layers[parseInt(layer)].constraints.length > 0) {
        this.setLayer(
          parseInt(layer),
          this.layers[parseInt(layer)].constraints[
            Math.floor(
              Math.random() * this.layers[parseInt(layer)].constraints.length
            )
          ]
        );
      } else {
        const filtered = NFT_PARTS[this.bearType][parseInt(layer)].filter(
          (option) => option.defaultHidden !== true
        );
        const random = Math.floor(Math.random() * filtered.length);
        this.setLayer(parseInt(layer), filtered[Math.floor(random)].name);
      }
    });
  };
}

export const nftStore = new NFT();

export default nftStore;
