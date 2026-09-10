import React from "react";
import { Composition } from "remotion";
import { ProductShowcase } from "./compositions/ProductShowcase";
import { BehindScenes } from "./compositions/BehindScenes";
import { MoroccanTouch } from "./compositions/MoroccanTouch";
import { Promotion } from "./compositions/Promotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductShowcase"
        component={ProductShowcase}
        width={1080}
        height={1080}
        fps={30}
        durationInFrames={150}
        defaultProps={{
          productName: "Waffle Amlou",
          caption: "La douceur marocaine dans chaque bouchée",
          hashtags: ["#KechWaffles", "#WaffleMarrakech", "#Amlou"],
          visualBrief: "Waffle doré avec sauce amlou",
        }}
      />
      <Composition
        id="BehindScenes"
        component={BehindScenes}
        width={1080}
        height={1080}
        fps={30}
        durationInFrames={150}
        defaultProps={{
          title: "Dans notre cuisine",
          subtitle: "Chaque waffle préparé avec amour",
          visualBrief: "Cuisine en action, chocolat Callebaut",
        }}
      />
      <Composition
        id="MoroccanTouch"
        component={MoroccanTouch}
        width={1080}
        height={1080}
        fps={30}
        durationInFrames={150}
        defaultProps={{
          productName: "Waffle Chebakia",
          moroccanIngredient: "شباكية",
          caption: "Le goût du Maroc dans nos gaufres",
          visualBrief: "Gaufre avec miel de chebakia",
        }}
      />
      <Composition
        id="Promotion"
        component={Promotion}
        width={1080}
        height={1080}
        fps={30}
        durationInFrames={150}
        defaultProps={{
          offerText: "2 POUR 1 — AUJOURD'HUI",
          caption: "Profitez de notre offre spéciale!",
          hashtags: ["#KechWaffles", "#Promo", "#Marrakech"],
        }}
      />
    </>
  );
};
