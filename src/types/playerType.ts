import PlayerClassType from "./playerClassType";

export default interface PlayerType {
  id: string;
  name: string;
  class: PlayerClassType;
  disabled?: boolean;
}
