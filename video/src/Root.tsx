import { Composition, Folder } from "remotion";
import { BRAND_FILM_FRAMES, BrandFilm } from "./BrandFilm";
import { Showcase, SHOWCASE_FRAMES } from "./Showcase";
import { Seasonal, SEASONAL_FRAMES, seasonalDefaults } from "./Seasonal";

export const RemotionRoot: React.FC = () => (
  <Folder name="JUICY">
    <Composition id="BrandFilm" component={BrandFilm} width={1920} height={1080} fps={30} durationInFrames={BRAND_FILM_FRAMES} />
    <Composition id="Showcase" component={Showcase} width={1920} height={1080} fps={30} durationInFrames={SHOWCASE_FRAMES} />
    <Composition id="Seasonal" component={Seasonal} width={1920} height={1080} fps={30} durationInFrames={SEASONAL_FRAMES} defaultProps={seasonalDefaults} />
  </Folder>
);
