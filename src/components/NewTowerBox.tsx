import React, { useState, useCallback } from "react";

//const nameRegex = /[a-z]+ \d{1,3}/i;

export default function NewTowerBox(props: { onCreateTower: Function }) {
  const [name, setName] = useState("");
  const [qlText, setQlText] = useState("");
  const [kingdom, setKingdom] = useState("pirates");

  const onCreateTower = useCallback(() => {
    // Tower name checking not enabled
    //if (!nameRegex.test(name)) return;
    props.onCreateTower(name, kingdom, Number(qlText));
  }, [name, kingdom, qlText, props]);

  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  }, []);

  const onKingdomChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setKingdom(e.currentTarget.value);
    },
    []
  );

  const onQlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQl = e.currentTarget.value;
    if (isNaN(Number(newQl))) return;

    setQlText(e.currentTarget.value);
  }, []);

  return (<div className="menu-subcontainer">
    <input
      type="text"
      name="name"
      className="name-input"
      pattern="[a-zA-Z]+ \d{1,3}"
      value={name}
      placeholder="Name"
      onChange={onNameChange}
    />
    <br></br>
    <select onChange={onKingdomChange} value={kingdom}>
      <option value="pirates">Pirates</option>
      <option value="hots">Horde of the Summoned</option>
      <option value="freedom">Freedom Isles</option>
      <option value="planned">Planned</option>
    </select>
    <input
      type="text"
      name="ql"
      pattern="\d+\.{0,1}\d*"
      value={qlText}
      onChange={onQlChange}
      placeholder="Quality"
    />
    <button onClick={onCreateTower}>Add tower</button>
  </div>);
}
