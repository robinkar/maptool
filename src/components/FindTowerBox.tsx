import React, { useState, useCallback } from "react";
import SearchBox from "./SearchBox";

export default function FindTowerBox(props: {
  towerNames: Array<string>;
  onSearch: Function;
}) {
  const [searchText, setSearchText] = useState("");

  const onSearch = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      props.onSearch(searchText);
    },
    [searchText, props]
  );
  
  return (
    <div className="menu-subcontainer">
        <SearchBox
          suggestions={props.towerNames}
          onSearchTextChange={setSearchText}
        />
        <button onClick={onSearch}>Find tower</button>
      </div>
    );
}
