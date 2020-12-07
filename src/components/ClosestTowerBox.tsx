import React, { useState, useCallback, useEffect } from "react";
import Tower from "./../interfaces/Tower";
import CoordinateBox from "./CoordinateBox";

export default function ClosestTowerBox(props: {
  tower: Tower | undefined;
  onDeleteTower: Function;
  onUpdateTower: Function;
}) {
  const [name, setName] = useState("");
  const [qlText, setQlText] = useState("");
  const [kingdom, setKingdom] = useState(
    props.tower !== undefined ? props.tower.kingdom : "pirates"
  );
  const [pos, setPos] = useState({
    x: props.tower !== undefined ? props.tower.x : -1,
    y: props.tower !== undefined ? props.tower.y : -1,
  });

  const [tower, setTower] = useState<Tower | undefined>(props.tower);

  const resetState = useCallback(() => {
    if (props.tower === undefined) return;

    setName(props.tower.name);
    setQlText(String(props.tower.ql));
    setKingdom(props.tower.kingdom);
    setPos({ x: props.tower.x, y: props.tower.y });
    setTower(props.tower);
  }, [props]);

  useEffect(() => {
    if (props.tower === undefined) return;
    if (props.tower !== tower) {
      resetState();
    }
  }, [props, pos, resetState, tower]);

  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  }, []);

  const onKingdomChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.currentTarget.value!;
      if (
        val === "pirates" ||
        val === "hots" ||
        val === "freedom" ||
        val === "planned"
      )
        setKingdom(val);
    },
    []
  );

  const onQlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQl = e.currentTarget.value;
    if (isNaN(Number(newQl))) return;

    setQlText(e.currentTarget.value);
  }, []);

  const onDeleteTower = useCallback(() => {
    if (props.tower === undefined || props.tower._id === undefined) return;
    props.onDeleteTower(props.tower!._id);
  }, [props]);

  const onUpdateTower = useCallback(() => {
    if (props.tower === undefined || props.tower._id === undefined) return;
    props.onUpdateTower(props.tower._id, name, Number(qlText), kingdom);
  }, [props, kingdom, name, qlText]);


  if (props.tower === undefined || (pos.x === -1 && pos.y === -1))
    return <div></div>;

  return (<div className="menu-subcontainer">
    <CoordinateBox pos={pos} />
    <input
      type="text"
      value={name}
      className="name-input"
      pattern="[a-zA-Z]+ \d{1,3}"
      placeholder="Name"
      onChange={onNameChange}
    />
    <br></br>
    <select value={kingdom} onChange={onKingdomChange}>
      <option value="pirates">Pirates</option>
      <option value="hots">Horde of the Summoned</option>
      <option value="freedom">Freedom Isles</option>
      <option value="planned">Planned</option>
    </select>
    <input
      type="text"
      value={qlText}
      pattern="\d+\.{0,1}\d*"
      onChange={onQlChange}
      placeholder="Quality"
    />
    <button onClick={onUpdateTower}>Update tower</button>
    <button className="delete-button" onClick={onDeleteTower}>
      Delete tower
    </button>
  </div>);
}
