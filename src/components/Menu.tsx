import React from "react";
import NewTowerBox from "./NewTowerBox";
import CoordinateBox from "./CoordinateBox";
import ClosestTowerBox from "./ClosestTowerBox";
import SettingsBox from "./SettingsBox";
import Tower from "./../interfaces/Tower";
import FindTowerBox from "./FindTowerBox";

export default function Menu(props: {
  pos: { x: number; y: number };
  closestTower: Tower | undefined;
  onCreateTower: Function;
  onDeleteTower: Function;
  onUpdateTower: Function;
  showInfluence: boolean;
  showMinDist: boolean;
  showMaxDist: boolean;
  showTowerNames: boolean;
  showPreview: boolean;
  showLinks: boolean;
  alpha: number;
  setShowInfluence: Function;
  setShowMinDist: Function;
  setShowMaxDist: Function;
  setShowTowerNames: Function;
  setShowPreview: Function;
  setShowLinks: Function;
  towerNames: Array<string>;
  onSearch: Function;
  setAlpha: Function;
}) {
  return (
    <div id="menu">
      <CoordinateBox pos={props.pos} />
      <NewTowerBox onCreateTower={props.onCreateTower} />
      <ClosestTowerBox
        tower={props.closestTower}
        onDeleteTower={props.onDeleteTower}
        onUpdateTower={props.onUpdateTower}
      />
      <FindTowerBox towerNames={props.towerNames} onSearch={props.onSearch} />

      <SettingsBox
        showInfluence={props.showInfluence}
        showMinDist={props.showMinDist}
        showMaxDist={props.showMaxDist}
        showTowerNames={props.showTowerNames}
        showPreview={props.showPreview}
        showLinks={props.showLinks}
        alpha={props.alpha}
        setShowInfluence={props.setShowInfluence}
        setShowMinDist={props.setShowMinDist}
        setShowMaxDist={props.setShowMaxDist}
        setShowTowerNames={props.setShowTowerNames}
        setShowPreview={props.setShowPreview}
        setShowLinks={props.setShowLinks}
        setAlpha={props.setAlpha}
      />
    </div>
  );
}
